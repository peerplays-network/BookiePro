import {ChainTypes, TimeRangePeriodTypes, BetCategories, Config, BetTypes} from '../constants';
import {
  BlockchainUtils,
  DateUtils,
  CurrencyUtils,
  BettingModuleUtils,
  ObjectUtils
} from '../utility';
import {I18n} from 'react-redux-i18n';
import Immutable from 'immutable';
import moment from 'moment';

class HistoryService {
  /**
   * Convert blockchain raw history to the app transaction history
   * Transaction history object is as the following
   * transaction = {
   *  id,
   *  time,
   *  desc,
   *  blockNum,
   *  amount
   * };
   */
  static convertRawHistoryToTransactionHistory(state, rawHistory) {
    const dynGlobalObject = state.getIn(['app', 'blockchainDynamicGlobalProperty']);
    const globalObject = state.getIn(['app', 'blockchainGlobalProperty']);
    const gatewayAccountId = state.getIn(['app', 'gatewayAccount', 'id']);
    const assetsById = state.getIn(['asset', 'assetsById']);
    const accountId = state.getIn(['account', 'account', 'id']);

    let transactionHistory = Immutable.List();
    rawHistory.forEach((rawTransaction) => {
      // Check the operation type to ensure it is relevant
      const operationType = rawTransaction.getIn(['op', 0]);
      const isRelevant =
        operationType === ChainTypes.operations.transfer ||
        operationType === ChainTypes.operations.bet_place ||
        operationType === ChainTypes.operations.bet_matched ||
        operationType === ChainTypes.operations.betting_market_group_resolved ||
        operationType === ChainTypes.operations.bet_canceled;

      // Only process the transaction, if it is relevant
      if (isRelevant) {
        let amount, description, precision;

        switch (operationType) {
          case ChainTypes.operations.transfer: {
            const from = rawTransaction.getIn(['op', 1, 'from']);
            const to = rawTransaction.getIn(['op', 1, 'to']);

            if (from === gatewayAccountId && to === accountId) {
              description = I18n.t('transaction.deposit');
            } else if (to === gatewayAccountId && from === accountId) {
              description = I18n.t('transaction.withdraw');
            } else {
              description = I18n.t('transaction.transfer');
            }

            amount = rawTransaction.getIn(['op', 1, 'amount', 'amount']);
            const assetId = rawTransaction.getIn(['op', 1, 'amount', 'asset_id']);
            precision = assetsById.getIn([assetId, 'precision']);
            break;
          }

          case ChainTypes.operations.bet_place: {
            description = I18n.t('transaction.makeBet');
            const amountToBet = rawTransaction.getIn(['op', 1, 'amount_to_bet']);
            amount = amountToBet.get('amount');
            precision = assetsById.getIn([amountToBet.get('asset_id'), 'precision']);
            break;
          }

          case ChainTypes.operations.bet_canceled: {
            description = I18n.t('transaction.betCancelled');
            const stakeReturned = rawTransaction.getIn(['op', 1, 'stake_returned']);
            amount = stakeReturned.get('amount');
            precision = assetsById.getIn([stakeReturned.get('asset_id'), 'precision']);
            break;
          }

          case ChainTypes.operations.bet_matched: {
            description = I18n.t('transaction.betMatched');
            const amountBet = rawTransaction.getIn(['op', 1, 'amount_bet']);
            amount = amountBet.get('amount');
            precision = assetsById.getIn([amountBet.get('asset_id'), 'precision']);
            break;
          }

          case ChainTypes.operations.betting_market_group_resolved: {
            const resolvedBetsById = state.getIn(['bet', 'resolvedBetsById']);
            let totalAmountWon = 0;
            const resolutions = rawTransaction.getIn(['op', 1, 'resolutions']);
            const gameResultByBettingMarketId = Immutable.Map(resolutions);
            resolvedBetsById.forEach((resolvedBet) => {
              const bettingMarketId = resolvedBet.get('betting_market_id');

              if (gameResultByBettingMarketId.has(bettingMarketId)) {
                totalAmountWon += resolvedBet.get('amount_won');
              }
            });
            description = I18n.t('transaction.bettingMarketResolved');
            amount = totalAmountWon;
            precision = assetsById.getIn([Config.coreAsset, 'precision']);
            break;
          }

          default:
            break;
        }

        // Calculate block time
        const blockNum = rawTransaction.get('block_num');
        const blockTime = BlockchainUtils.calcBlockTime(blockNum, globalObject, dynGlobalObject);

        const transaction = Immutable.fromJS({
          key: rawTransaction.get('id'),
          id: rawTransaction.get('id'),
          time: moment(blockTime),
          desc: description,
          blockNum,
          amount: amount / Math.pow(10, precision)
        });
        // Add to the list
        transactionHistory = transactionHistory.push(transaction);
      }
    });
    return transactionHistory;
  }

  /**
   * Convert raw history into my bets which are unmatched bets, matched bets, and resolved bets
   * unmatched bets {
   * id,
   * category, (MATCHED_BET/ UNMATCHED_BET/ RESOLVED_BET)
   * bettor_id,
   * betting_market_id,
   * asset_id,
   * original_bet_amount, = stake for back bet; liability for lay bet
   * backer_multiplier, = odds
   * back_or_lay, = 'back' or 'lay'
   * unmatched_bet_amount = stake for back bet; liability for lay bet
   * }
   *
   * matched bets {
   * id,
   * category, (MATCHED_BET/ UNMATCHED_BET/ RESOLVED_BET)
   * bettor_id,
   * asset_id,
   * betting_market_id,
   * original_bet_amount, = stake for back bet; liability for lay bet
   * backer_multiplier, = odds
   * back_or_lay, = 'back' or 'lay'
   * matched_bet_amount = stake for back bet; liability for lay bet
   * }
   *
   * resolved bets {
   * id,
   * category, (MATCHED_BET/ UNMATCHED_BET/ RESOLVED_BET)
   * bettor_id,
   * asset_id,
   * betting_market_id,
   * original_bet_amount, = stake for back bet; liability for lay bet
   * backer_multiplier, = odds
   * back_or_lay, = 'back' or 'lay'
   * resolved_time,
   * matched_bet_amount, = stake for back bet; liability for lay bet
   * amount_won
   * }
   */

  static convertRawHistoryToMyBets(state, rawHistory) {
    // TODO: find better place to put odds precision (this one should be
    // returned by blockchain anyway)
    const oddsPrecision = Config.oddsPrecision;
    const dynGlobalObject = state.getIn(['app', 'blockchainDynamicGlobalProperty']);
    const globalObject = state.getIn(['app', 'blockchainGlobalProperty']);

    let unmatchedBetsById = state.getIn(['bet', 'unmatchedBetsById']);
    let matchedBetsById = state.getIn(['bet', 'matchedBetsById']);
    let resolvedBetsById = state.getIn(['bet', 'resolvedBetsById']);

    // Iterate from the beginning
    rawHistory.reverse().forEach((rawTransaction) => {
      const operationType = rawTransaction.getIn(['op', 0]);
      const operationContent = rawTransaction.getIn(['op', 1]);
      const operationResult = rawTransaction.getIn(['result', 1]);

      switch (operationType) {
        case ChainTypes.operations.bet_place: {
          // Create unmatched bets object
          const betId = operationResult;
          const id = rawTransaction.get('id');
          const betType = operationContent.get('back_or_lay');
          const assetID = operationContent.getIn(['amount_to_bet', 'asset_id']);

          // Do not process transactions/bets that do not match the core asset
          if (assetID !== Config.coreAsset) {
            return;
          }

          let unmatchedBet = Immutable.fromJS({
            id,
            original_bet_id: betId,
            category: BetCategories.UNMATCHED_BET,
            bettor_id: operationContent.get('bettor_id'),
            betting_market_id: operationContent.get('betting_market_id'),
            back_or_lay: betType,
            backer_multiplier: operationContent.get('backer_multiplier') / oddsPrecision,
            asset_id: assetID,
            original_bet_amount: operationContent.getIn(['amount_to_bet', 'amount']),
            unmatched_bet_amount: operationContent.getIn(['amount_to_bet', 'amount'])
          });

          unmatchedBet = unmatchedBet.set(
            'original_profit',
            betType === BetTypes.BACK
              ? ObjectUtils.getProfitLiabilityFromBetObject(unmatchedBet)
              : 0
          );
          unmatchedBet = unmatchedBet.set(
            'original_liability',
            betType === BetTypes.LAY 
              ? ObjectUtils.getProfitLiabilityFromBetObject(unmatchedBet) 
              : 0
          );
          unmatchedBetsById = unmatchedBetsById.set(id, unmatchedBet);
          break;
        }

        case ChainTypes.operations.bet_canceled: {
          const betId = operationContent.get('bet_id');
          unmatchedBetsById = unmatchedBetsById.filterNot(
            (bet) => bet.get('original_bet_id') === betId
          );
          break;
        }

        case ChainTypes.operations.bet_adjusted: {
          const betId = operationContent.get('bet_id');
          let unmatchedBet = unmatchedBetsById.find((bet) => bet.get('original_bet_id') === betId);

          if (unmatchedBet && !unmatchedBet.isEmpty()) {
            const unmatchedAmount = unmatchedBet.get('unmatched_bet_amount');
            const refund = operationContent.getIn(['stake_returned', 'amount']);

            // Deduct the refund from the unmatched bets bet amount.
            const updatedUnmatchedAmount = unmatchedAmount - refund;

            // If this refund returned the remainder of the unmatched value, remove it
            // from the unmatched bets.
            if (updatedUnmatchedAmount <= 0) {
              unmatchedBetsById = unmatchedBetsById.delete(unmatchedBet.get('id'));
            } else {
              unmatchedBet = unmatchedBet.set('unmatched_bet_amount', updatedUnmatchedAmount);
              unmatchedBetsById = unmatchedBetsById.set(unmatchedBet.get('id'), unmatchedBet);
            }
          }

          break;
        }

        case ChainTypes.operations.bet_matched: {
          const betId = operationContent.get('bet_id');
          // Get unmatched bet
          let unmatchedBet = unmatchedBetsById.find((bet) => bet.get('original_bet_id') === betId);

          if (unmatchedBet && !unmatchedBet.isEmpty()) {
            const originalAmount = unmatchedBet.get('original_bet_amount');
            const unmatchedAmount = unmatchedBet.get('unmatched_bet_amount');
            const betType = unmatchedBet.get('back_or_lay');
            const matchedAmount = operationContent.getIn(['amount_bet', 'amount']);
            const matchedBackerMultiplier =
              operationContent.get('backer_multiplier') / oddsPrecision;
            const updatedUnmatchedAmount = unmatchedAmount - matchedAmount;

            // Modify unmatched bet
            // Remove it if it reaches 0
            if (updatedUnmatchedAmount <= 0) {
              unmatchedBetsById = unmatchedBetsById.delete(unmatchedBet.get('id'));
            } else {
              unmatchedBet = unmatchedBet.set('unmatched_bet_amount', updatedUnmatchedAmount);

              // Update the original values so that we can represent what is truely
              // accurate for this bet.
              if (betType === 'back') {
                unmatchedBet = unmatchedBet.set(
                  'original_profit',
                  ObjectUtils.getProfitLiabilityFromBetObject(unmatchedBet)
                );
              } else {
                unmatchedBet = unmatchedBet.set(
                  'original_liability',
                  ObjectUtils.getProfitLiabilityFromBetObject(unmatchedBet)
                );
              }

              unmatchedBetsById = unmatchedBetsById.set(unmatchedBet.get('id'), unmatchedBet);
            }

            const id = rawTransaction.get('id');
            // Check if there is existing matchedBet object
            let matchedBet = Immutable.fromJS({
              id,
              original_bet_id: betId,
              category: BetCategories.MATCHED_BET,
              bettor_id: unmatchedBet.get('bettor_id'),
              betting_market_id: unmatchedBet.get('betting_market_id'),
              back_or_lay: betType,
              backer_multiplier: matchedBackerMultiplier,
              asset_id: unmatchedBet.get('asset_id'),
              original_bet_amount: originalAmount,
              matched_bet_amount: matchedAmount
            });

            matchedBet = matchedBet.set(
              'original_profit',
              betType === BetTypes.BACK
                ? ObjectUtils.getProfitLiabilityFromBetObject(unmatchedBet)
                : 0
            );
            matchedBet = matchedBet.set(
              'original_liability',
              betType === BetTypes.LAY
                ? ObjectUtils.getProfitLiabilityFromBetObject(unmatchedBet)
                : 0
            );
            // Update matched bets
            matchedBetsById = matchedBetsById.set(id, matchedBet);
          }

          break;
        }

        case ChainTypes.operations.betting_market_group_resolved: {
          const resolutions = operationContent.get('resolutions');
          const bettingMarketIds = resolutions.map((resolution) => resolution.get(0));
          let gameResultByBettingMarketId = Immutable.Map(resolutions);

          // Create resolved bets from related matched bets
          matchedBetsById.forEach((matchedBet) => {
            const bettingMarketId = matchedBet.get('betting_market_id');

            if (bettingMarketIds.includes(bettingMarketId)) {
              const betId = matchedBet.get('id');
              let resolvedBet = matchedBet;
              resolvedBet = resolvedBet.set('category', BetCategories.RESOLVED_BET);
              // Set resolved time
              const blockNum = rawTransaction.get('block_num');
              const resolvedTime = moment(
                BlockchainUtils.calcBlockTime(blockNum, globalObject, dynGlobalObject)
              );
              // Set amount won
              const gameResult = gameResultByBettingMarketId.get(bettingMarketId);
              const amountWon = ObjectUtils.getAmountWonFromBetObject(matchedBet, gameResult);
              resolvedBet = resolvedBet
                .set('resolved_time', resolvedTime)
                .set('amount_won', amountWon);
              resolvedBetsById = resolvedBetsById.set(betId, resolvedBet);
            }
          });
          // Remove resolved bets from matchedbets list
          matchedBetsById = matchedBetsById
            .filterNot(matchedBet => bettingMarketIds.includes(matchedBet.get('betting_market_id'))); // eslint-disable-line
          break;
        }

        default:
          break;
      }
    });

    return {
      unmatchedBetsById,
      matchedBetsById,
      resolvedBetsById
    };
  }

  /**
   * Filter transaction history given the time range
   */
  static filterTransactionHistoryGivenTimeRange(
    transactionHistory,
    periodType,
    customTimeRangeStartDate,
    customTimeRangeEndDate
  ) {
    const filteredTransactionHistory = transactionHistory.filter((transaction) => {
      let startDate, endDate;

      if (periodType === TimeRangePeriodTypes.CUSTOM) {
        startDate = customTimeRangeStartDate;
        endDate = customTimeRangeEndDate;
      } else {
        const timeRange = DateUtils.getTimeRangeGivenTimeRangePeriodType(periodType);
        startDate = timeRange.startDate;
        endDate = timeRange.endDate;
      }

      const time = transaction.get('time');

      return time.valueOf() <= endDate.valueOf() && time.valueOf() >= startDate.valueOf();
    });

    return filteredTransactionHistory;
  }

  /**
   * Convert transaction history to export data
   * {
   *  Id,
   *  Time,
   *  Description,
   *  Status,
   *  Amount
   * }
   */
  static convertTransactionHistoryToTransactionHistoryExportData(state, transactionHistory) {
    const accountId = state.getIn(['account', 'account', 'id']);
    const setting =
      state.getIn(['setting', 'settingByAccountId', accountId]) ||
      state.getIn(['setting', 'defaultSetting']);
    const currencyFormat = setting.get('currencyFormat');
    const lastIrreversibleBlockNum = state.getIn([
      'app',
      'blockchainDynamicGlobalProperty',
      'last_irreversible_block_num'
    ]);

    return transactionHistory.map((transaction) => {
      const blockNum = transaction.get('blockNum');
      let status;

      if (lastIrreversibleBlockNum >= blockNum) {
        status = I18n.t('myAccount.transaction_status_complete');
      } else {
        status = I18n.t('myAccount.transaction_status_processing');
      }

      return {
        Id: transaction.get('id'),
        Time: moment(transaction.get('time')).format('DD/MM/YYYY HH:mm:ss'),
        Description: transaction.get('desc'),
        Status: status,
        Amount: CurrencyUtils.getFormattedCurrency(
          transaction.get('amount'),
          currencyFormat,
          BettingModuleUtils.stakePlaces
        )
      };
    });
  }
}

export default HistoryService;
