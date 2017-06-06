import { DummyOperationTypes, TimeRangePeriodTypes, BetCategories } from '../constants';
import { BlockchainUtils, DateUtils, CurrencyUtils, BettingModuleUtils } from '../utility';
import { ChainTypes } from 'graphenejs-lib';
import { I18n } from 'react-redux-i18n';
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
      const isRelevant = (operationType === ChainTypes.operations.transfer) ||
                          (operationType === DummyOperationTypes.MAKE_BET) ||
                          (operationType === DummyOperationTypes.CANCEL_BET) ||
                          (operationType === DummyOperationTypes.BET_MATCHED) ||
                          (operationType === DummyOperationTypes.BETTING_MARKET_RESOLVED);

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
          case DummyOperationTypes.MAKE_BET: {
            description = I18n.t('transaction.makeBet');
            amount = rawTransaction.getIn(['op', 1, 'original_bet_amount']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          case DummyOperationTypes.CANCEL_BET: {
            description = I18n.t('transaction.cancelBet');
            amount = rawTransaction.getIn(['op', 1, 'amount_refunded']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          case DummyOperationTypes.BET_MATCHED: {
            description = I18n.t('transaction.betMatched');
            amount = rawTransaction.getIn(['op', 1, 'matched_bet_amount']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          case DummyOperationTypes.BETTING_MARKET_RESOLVED: {
            description = I18n.t('transaction.bettingMarketResolved');
            amount = rawTransaction.getIn(['op', 1, 'amount_paid']);
            precision = assetsById.getIn(['1.3.0', 'precision']);
            break;
          }
          default: break;
        }

        // Calculate block time
        const blockNum  = rawTransaction.get('block_num');
        const blockTime = BlockchainUtils.calcBlockTime(blockNum, globalObject, dynGlobalObject);

        const transaction = Immutable.fromJS({
          key: rawTransaction.get('id'),
          id: rawTransaction.get('id'),
          time: moment(blockTime),
          desc:  description,
          blockNum,
          amount: amount/ Math.pow(10, precision)
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
    const dynGlobalObject = state.getIn(['app', 'blockchainDynamicGlobalProperty']);
    const globalObject = state.getIn(['app', 'blockchainGlobalProperty']);

    let unmatchedBetsById = Immutable.Map();
    let matchedBetsById = Immutable.Map();
    let resolvedBetsById = Immutable.Map();

    // Iterate from the beginning
    rawHistory.reverse().forEach((rawTransaction) => {
      const operationType = rawTransaction.getIn(['op', 0]);
      const operationContent = rawTransaction.getIn(['op', 1]);
      switch (operationType) {
        case DummyOperationTypes.MAKE_BET: {
          // Create unmatched bets object
          const betId = operationContent.get('bet_id');
          const unmatchedBet = Immutable.fromJS({
            id: betId,
            category: BetCategories.UNMATCHED_BET,
            bettor_id: operationContent.get('account_id'),
            betting_market_id: operationContent.get('betting_market_id'),
            back_or_lay: operationContent.get('back_or_lay'),
            backer_multiplier: operationContent.get('backer_multiplier'),
            original_bet_amount: operationContent.get('original_bet_amount'),
            unmatched_bet_amount: operationContent.get('original_bet_amount')
          });
          unmatchedBetsById = unmatchedBetsById.set(betId, unmatchedBet);
          break;
        }
        case DummyOperationTypes.CANCEL_BET: {
          const betId = operationContent.get('bet_id');
          unmatchedBetsById = unmatchedBetsById.delete(betId);
          break;
        }
        case DummyOperationTypes.BET_MATCHED: {
          const betId = operationContent.get('bet_id');
          // Get unmatched bet
          let unmatchedBet = unmatchedBetsById.get(betId);
          if (unmatchedBet && !unmatchedBet.isEmpty()) {
            const originalAmount = unmatchedBet.get('original_bet_amount');
            const unmatchedAmount = unmatchedBet.get('unmatched_bet_amount');
            const matchedAmount = operationContent.get('matched_bet_amount');
            const updatedUnmatchedAmount = unmatchedAmount - matchedAmount;
            // Modify unmatched bet
            // Remove it if it reaches 0
            if (updatedUnmatchedAmount <= 0) {
              unmatchedBetsById = unmatchedBetsById.delete(betId);
            } else {
              unmatchedBet = unmatchedBet.set('unmatched_bet_amount', updatedUnmatchedAmount);
              unmatchedBetsById = unmatchedBetsById.set(betId, unmatchedBet);
            }

            // Check if there is existing matchedBet object
            let matchedBet = matchedBetsById.get(betId);
            // If it doesn't exist yet, create new one
            if (!matchedBet || matchedBet.isEmpty()) {
              matchedBet = Immutable.fromJS({
                id: betId,
                category: BetCategories.MATCHED_BET,
                bettor_id: operationContent.get('account_id'),
                betting_market_id: operationContent.get('betting_market_id'),
                back_or_lay: operationContent.get('back_or_lay'),
                backer_multiplier: operationContent.get('backer_multiplier'),
                original_bet_amount: originalAmount,
                matched_bet_amount: matchedAmount
              })
            } else {
              // update it if it exists
              matchedBet = matchedBet.set('matched_bet_amount', matchedAmount);
            }
            // Update matched bets
            matchedBetsById = matchedBetsById.set(betId, matchedBet);
          }
          break;
        }
        case DummyOperationTypes.BETTING_MARKET_RESOLVED: {
          // Remove all related unmatched bets
          const bettingMarketId = operationContent.get('betting_market_id');
          unmatchedBetsById = unmatchedBetsById.filter((unmatchedBet) => {
            return unmatchedBet.get('betting_market_id') !== bettingMarketId;
          });
          // Create resolved bets from related matched bets
          matchedBetsById.forEach((matchedBet) => {
            if (matchedBet.get('betting_market_id') === bettingMarketId) {
              const betId = matchedBet.get('id');
              let resolvedBet = matchedBet;
              resolvedBet = resolvedBet.set('category', BetCategories.RESOLVED_BET);
              // Set resolved time
              const blockNum  = rawTransaction.get('block_num');
              const resolvedTime = moment(BlockchainUtils.calcBlockTime(blockNum, globalObject, dynGlobalObject));
              // Set amount won
              // TODO: since we don't have a way to know which bet side is winning, always assume this bet is winning
              const amountWon = matchedBet.get('matched_bet_amount') * (matchedBet.get('backer_multiplier') - 1);
              resolvedBet = resolvedBet.set('resolved_time', resolvedTime)
                                        .set('amount_won', amountWon);
              resolvedBetsById = resolvedBetsById.set(betId, resolvedBet);
            }
          })
          // Remove resolved bets from matchedbets list
          matchedBetsById = matchedBetsById.filterNot((matchedBet) => {
            return (matchedBet.get('betting_market_id') === bettingMarketId);
          });
          break;
        }
        default: break;
      }
    })

    return {
      unmatchedBetsById,
      matchedBetsById,
      resolvedBetsById
    }

  }


  /**
   * Filter transaction history given the time range
   */
  static filterTransactionHistoryGivenTimeRange(transactionHistory, periodType, customTimeRangeStartDate, customTimeRangeEndDate) {
    const filteredTransactionHistory = transactionHistory.filter((transaction) => {
      let startDate, endDate;
      if (periodType === TimeRangePeriodTypes.CUSTOM) {
        startDate = customTimeRangeStartDate;
        endDate = customTimeRangeEndDate;
      } else {
        const timeRange = DateUtils.getTimeRangeGivenTimeRangePeriodType(periodType);
        startDate = timeRange.startDate;
        endDate = timeRange.endDate
      }
      const time = transaction.get('time');

      return time.valueOf() <= endDate.valueOf() && time.valueOf() >= startDate.valueOf()
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
    const setting = state.getIn(['setting', 'settingByAccountId', accountId]) || state.getIn(['setting', 'defaultSetting']);
    const currencyFormat = setting.get('currencyFormat');
    const lastIrreversibleBlockNum = state.getIn(['app', 'blockchainDynamicGlobalProperty', 'last_irreversible_block_num']);

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
        Amount: CurrencyUtils.getFormattedCurrency(transaction.get('amount'), currencyFormat, BettingModuleUtils.stakePlaces)
      };
    });
  }
}

export default HistoryService;
