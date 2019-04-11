import Immutable from 'immutable';
import {WalletService, HistoryService, KeyGeneratorService} from '../services';
import {BetTypes, LoadingStatus, ActionTypes, Config} from '../constants';
import BettingMarketActions from './BettingMarketActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import EventActions from './EventActions';
import EventGroupActions from './EventGroupActions';
import SportActions from './SportActions';
import MarketDrawerActions from './MarketDrawerActions';
import {TransactionBuilder} from 'peerplaysjs-lib';
import log from 'loglevel';
import {CurrencyUtils, ObjectUtils} from '../utility';

/**
 * Private actions
 */
class BetPrivateActions {
  static setMakeBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_MAKE_BETS_LOADING_STATUS,
      loadingStatus
    };
  }

  static setMakeBetsErrorAction(error) {
    return {
      type: ActionTypes.BET_SET_MAKE_BETS_ERROR,
      error
    };
  }

  static setCancelBetsByIdsLoadingStatusAction(betIds, loadingStatus) {
    return {
      type: ActionTypes.BET_SET_CANCEL_BETS_BY_IDS_LOADING_STATUS,
      betIds,
      loadingStatus
    };
  }

  static setCancelBetsErrorByBetIdAction(betIds, error) {
    return {
      type: ActionTypes.BET_SET_CANCEL_BETS_ERROR_BY_BET_ID,
      betIds,
      error
    };
  }

  static setEditBetsByIdsLoadingStatusAction(betIds, loadingStatus) {
    return {
      type: ActionTypes.BET_SET_EDIT_BETS_BY_IDS_LOADING_STATUS,
      betIds,
      loadingStatus
    };
  }

  static setEditBetsErrorByBetIdAction(betIds, error) {
    return {
      type: ActionTypes.BET_SET_EDIT_BETS_ERROR_BY_BET_ID,
      betIds,
      error
    };
  }

  static setMyBetsAction(myBets) {
    return {
      type: ActionTypes.BET_SET_MY_BETS,
      myBets
    };
  }

  static updateMyBetsAction(myBets) {
    return {
      type: ActionTypes.BET_UPDATE_MY_BETS,
      myBets
    };
  }
  static setInitMyBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_INIT_MY_BETS_LOADING_STATUS,
      loadingStatus
    };
  }
  static setInitMyBetsErrorAction(error) {
    return {
      type: ActionTypes.BET_INIT_MY_BETS_ERROR,
      error
    };
  }
  static setCheckForNewMyBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_CHECK_FOR_NEW_MY_BETS_LOADING_STATUS,
      loadingStatus
    };
  }
  static setCheckForNewMyBetsErrorAction(error) {
    return {
      type: ActionTypes.BET_CHECK_FOR_NEW_MY_BETS_ERROR,
      error
    };
  }
}

/**
 * Public actions
 */
class BetActions {
  /**
   * Init my bets, i.e. derive unmatchedBets, matchedBets, and resolvedBets from transaction history
   */
  static initMyBets() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);

      if (accountId) {
        // Set status
        dispatch(BetPrivateActions.setInitMyBetsLoadingStatusAction(LoadingStatus.LOADING));

        const rawHistory = getState().getIn(['rawHistory', 'rawHistoryByAccountId', accountId]);
        const myBets = HistoryService.convertRawHistoryToMyBets(getState(), rawHistory);
        // Fetch related betting markets
        let bettingMarketIds = Immutable.List();
        myBets.unmatchedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.push(bet.get('betting_market_id'));
        });
        myBets.matchedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.push(bet.get('betting_market_id'));
        });
        myBets.resolvedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.push(bet.get('betting_market_id'));
        });
        // Unique betting market ids
        bettingMarketIds = bettingMarketIds.toSet().toList();

        return dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds))
          .then((bettingMarkets) => {
            // Get unique betting market group ids
            let bettingMarketGroupIds = bettingMarkets
              .map((bettingMarket) => bettingMarket.get('group_id'))
              .toSet()
              .toList();
            // Get the betting market groups
            return dispatch(
              BettingMarketGroupActions.getBettingMarketGroupsByIds(bettingMarketGroupIds)
            );
          })
          .then((bettingMarketGroups) => {
            // Get unique event ids
            let eventIds = bettingMarketGroups
              .map((bettingMarketGroup) => bettingMarketGroup.get('event_id'))
              .toSet()
              .toList();
            // Get the betting market groups
            return dispatch(EventActions.getEventsByIds(eventIds));
          })
          .then((events) => {
            // Get unique event group ids
            let eventGroupIds = events
              .map((event) => event.get('event_group_id'))
              .toSet()
              .toList();
            // Get the betting market groups
            return dispatch(EventGroupActions.getEventGroupsByIds(eventGroupIds));
          })
          .then((eventGroups) => {
            // Get unique sport ids
            let sportIds = eventGroups
              .map((eventGroup) => eventGroup.get('sport_id'))
              .toSet()
              .toList();
            // Get the betting market groups
            return dispatch(SportActions.getSportsByIds(sportIds));
          })
          .then(() => {
            // Set my bets
            dispatch(BetPrivateActions.setMyBetsAction(myBets));
            // Setstatus
            dispatch(BetPrivateActions.setInitMyBetsLoadingStatusAction(LoadingStatus.DONE));
            log.debug('Init my bets succeed.');
          })
          .catch((error) => {
            log.error('Fail to init my bets', error);
            // Set error
            dispatch(BetPrivateActions.setInitMyBetsErrorAction(error));
          });
      }
    };
  }

  /**
   * Update my bets whenever there is new history
   */
  static checkForNewMyBets(rawHistoryDelta) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);

      if (accountId) {
        // Set status
        dispatch(BetPrivateActions.setCheckForNewMyBetsLoadingStatusAction(LoadingStatus.LOADING));
        const myBets = HistoryService.convertRawHistoryToMyBets(getState(), rawHistoryDelta);

        // Fetch related betting markets
        let bettingMarketIds = Immutable.List();
        myBets.unmatchedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.push(bet.get('betting_market_id'));
        });
        myBets.matchedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.push(bet.get('betting_market_id'));
        });
        myBets.resolvedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.push(bet.get('betting_market_id'));
        });
        // Unique betting market ids
        bettingMarketIds = bettingMarketIds.toSet().toList();

        return dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds))
          .then((bettingMarkets) => {
            // Get unique betting market group ids
            let bettingMarketGroupIds = bettingMarkets
              .map((bettingMarket) => bettingMarket.get('group_id'))
              .toSet()
              .toList();
            // Get the betting market groups
            return dispatch(
              BettingMarketGroupActions.getBettingMarketGroupsByIds(bettingMarketGroupIds)
            );
          })
          .then((bettingMarketGroups) => {
            // Get unique event ids
            let eventIds = bettingMarketGroups
              .map((bettingMarketGroup) => bettingMarketGroup.get('event_id'))
              .toSet()
              .toList();
            // Get the events
            return dispatch(EventActions.getEventsByIds(eventIds));
          })
          .then((events) => {
            // Get unique event group ids
            let eventGroupIds = events
              .map((event) => event.get('event_group_id'))
              .toSet()
              .toList();
            // Get the betting market groups
            return dispatch(EventGroupActions.getEventGroupsByIds(eventGroupIds));
          })
          .then((eventGroups) => {
            // Get unique sport ids
            let sportIds = eventGroups
              .map((eventGroup) => eventGroup.get('sport_id'))
              .toSet()
              .toList();
            // Get the betting market groups
            return dispatch(SportActions.getSportsByIds(sportIds));
          })
          .then(() => {
            // Set my bets
            dispatch(BetPrivateActions.updateMyBetsAction(myBets));
            // Update market drawer open bets
            dispatch(MarketDrawerActions.updateOpenBets());
            dispatch(MarketDrawerActions.hideOverlay());
            // Setstatus
            dispatch(BetPrivateActions.setCheckForNewMyBetsLoadingStatusAction(LoadingStatus.DONE));
            log.debug('Check for new my bets succeed.');
          })
          .catch((error) => {
            log.error('Fail to check for new my bets', error);
            // Set error
            dispatch(BetPrivateActions.setCheckForNewMyBetsErrorAction(error));
          });
      }
    };
  }

  static addOrUpdateOngoingBetsAction(ongoingBets) {
    return {
      type: ActionTypes.BET_ADD_OR_UPDATE_ONGOING_BETS,
      ongoingBets
    };
  }

  static removeOngoingBetsByIdsAction(ongoingBetIds) {
    return {
      type: ActionTypes.BET_REMOVE_ONGOING_BETS,
      ongoingBetIds
    };
  }

  static addOrUpdateResolvedBetsAction(resolvedBets) {
    return {
      type: ActionTypes.BET_ADD_OR_UPDATE_RESOLVED_BETS,
      resolvedBets
    };
  }

  /**
   * Make bets, (bets format in this parameter is not determined yet)
   * Currently, our bet object looks like this
   * {
      "event_id": "1.103.7",
      "odds": "5.70",
      "profit": "4.70000",
      "bet_type": "back",
      "liability": "4.70000",
      "event_name": "Cincinnati Bengals vs New York Jets",
      "betting_market_description": "New York Jets",
      "betting_market_group_description": "Moneyline",
      "stake": "1.000",
      "id": 1501491040222,
      "team": "New York Jets",
      "betting_market_id": "1.105.38"
    }
   */
  static makeBets(bets) {
    return (dispatch, getState) => {
      dispatch(BetPrivateActions.setMakeBetsLoadingStatusAction(LoadingStatus.LOADING));
      const accountId = getState().getIn(['account', 'account', 'id']);

      const tr = new TransactionBuilder();
      bets.forEach((bet) => {
        // Create operation for each bet and attach it to the transaction
        const bettingMarket = getState().getIn([
          'bettingMarket',
          'bettingMarketsById',
          bet.get('betting_market_id')
        ]);
        const bettingMarketGroupId = bettingMarket && bettingMarket.get('group_id');
        const bettingMarketGroup = getState().getIn([
          'bettingMarketGroup',
          'bettingMarketGroupsById',
          bettingMarketGroupId
        ]);
        const betAssetType =
          (bettingMarketGroup && bettingMarketGroup.get('asset_id')) || Config.coreAsset;

        // 2017-11-27 : JIG : BOOK-232 : Betslip says mBTC but is actually denominated in BTC!
        // The variable amountToBet should be sent to the blockchain based
        // on betAssetPrecision. For example, if betAssetPrecision is 5,
        // then the amountToBet should be expressed as bet x 10^5 asset tokens.

        // Make betAssetPrecision a variable so it can be adjusted as needed.
        let betAssetPrecision =
          getState().getIn(['asset', 'assetsById', betAssetType, 'precision']) || 0;

        // We need to adjust the betAssetPrecision if the Better
        // is working with mCoin instead of coin (is, reducet the
        // betAssetPrecision by 1000).

        // Get the currencyFormat from the State object
        const setting =
          getState().getIn(['setting', 'settingByAccountId', accountId]) ||
          getState().getIn(['setting', 'defaultSetting']);
        const currencyFormat = setting.get('currencyFormat');
        const currencyType = CurrencyUtils.getCurrencyType(currencyFormat);

        // If the Better's currency format is set to 'mCoin' ...
        if (currencyType === 'mCoin') {
          // ... reduce the precision by 3.
          betAssetPrecision = Math.max(betAssetPrecision - 3, 0);
        }

        // 2017-11-27 : KLF : BOOK-235
        // Below line has replaced an conditional logic that sets the amountToBet
        //  differently depending on if the bet is a BACK or a LAY. The amount to
        //  bet should be the same regardless of if it is a back or a lay.
        let amountToBet = 0;

        // amountToBet = parseFloat(bet.get('stake')) * Math.pow(10, betAssetPrecision);
        if (bet.get('bet_type') === BetTypes.BACK) {
          amountToBet = (parseFloat(bet.get('stake')) * Math.pow(10, betAssetPrecision)).toFixed(
            betAssetPrecision
          );
        } else if (bet.get('bet_type') === BetTypes.LAY) {
          amountToBet = (
            parseFloat(bet.get('liability')) * Math.pow(10, betAssetPrecision)
          ).toFixed(betAssetPrecision);
        }

        let backerMultiplier = Math.round(parseFloat(bet.get('odds')) * Config.oddsPrecision);

        amountToBet = Math.floor(amountToBet);

        const operationParams = {
          bettor_id: accountId,
          betting_market_id: bet.get('betting_market_id'),
          amount_to_bet: {
            amount: amountToBet,
            asset_id: betAssetType
          },
          backer_multiplier: backerMultiplier,
          amount_reserved_for_fees: Math.floor(amountToBet * 0.01),
          back_or_lay: bet.get('bet_type')
        };
        const operationType = 'bet_place';

        tr.add_type_operation(operationType, operationParams);
      });
      const accountName = getState().getIn(['account', 'account', 'name']);
      const password = getState().getIn(['account', 'password']);
      const keys = KeyGeneratorService.generateKeys(accountName, password);

      WalletService.processTransaction(keys, tr)
        .then(() => {
          log.debug('Make bets succeed.');
          dispatch(BetPrivateActions.setMakeBetsLoadingStatusAction(LoadingStatus.DONE));
        })
        .catch((error) => {
          log.error('Fail to get make bets', error);
          // Set error
          dispatch(BetPrivateActions.setMakeBetsErrorAction(error));
        });
    };
  }

  /**
   * Cancel bets
   * bets - array of blockchain bet objects
   */
  static cancelBets(bets) {
    return (dispatch, getState) => {
      dispatch(MarketDrawerActions.updateOpenBetsLoadingStatus(LoadingStatus.BET_DELETE));
      const bettorId = getState().getIn(['account', 'account', 'id']);
      // Build transaction
      const tr = new TransactionBuilder();
      bets.forEach((bet) => {
        // Create operation for each bet and attach it to the transaction
        const operationParams = {
          bettor_id: bettorId,
          bet_to_cancel: bet.get('original_bet_id')
        };
        const operationType = 'bet_cancel';
        tr.add_type_operation(operationType, operationParams);
      });
      const betIds = bets.map((bet) => bet.get('id'));
      dispatch(
        BetPrivateActions.setCancelBetsByIdsLoadingStatusAction(betIds, LoadingStatus.LOADING)
      );
      const accountName = getState().getIn(['account', 'account', 'name']);
      const password = getState().getIn(['account', 'password']);
      const keys = KeyGeneratorService.generateKeys(accountName, password);
      WalletService.processTransaction(keys, tr)
        .then(() => {
          log.debug('Cancel bets succeed.');
          dispatch(
            BetPrivateActions.setCancelBetsByIdsLoadingStatusAction(betIds, LoadingStatus.DONE)
          );
          dispatch(MarketDrawerActions.hideOverlay());
        })
        .catch((error) => {
          log.error('Fail to cancel bets', error);
          // Set error
          dispatch(BetPrivateActions.setCancelBetsErrorByBetIdAction(betIds, error));
        });
    };
  }

  /**
   * Edit bets
   * bets - array of edited blockchain bet objects
   * e.g.
   * [{
   * "odds": "2.00",
   * "profit": "3.00000",
   * "bet_type": "back",
   * "original_stake": "2.000",
   * "liability": "3.00000",
   * "original_odds": "2.00",
   * "bettor_id": "1.2.28",
   * "betting_market_description": "Dallas Mavericks",
   * "betting_market_group_description": "Moneyline",
   * "stake": "3.000",
   * "updated": true,
   * "id": "1.22.54",
   * "betting_market_id": "1.21.3"
   * }]
   */
  static editBets(bets) {
    return (dispatch, getState) => {
      const tr = new TransactionBuilder();
      bets.forEach((bet) => {
        let stakeDiff=[],
          profitDiff=[],
          liabilityDiff=[],
          oddsDiff=[],
          changeType= BetTypes.INCREMENT;
        // Get the currencyFormat from the State object
        const accountId = getState().getIn(['account', 'account', 'id']);
        const setting =
          getState().getIn(['setting', 'settingByAccountId', accountId]) ||
          getState().getIn(['setting', 'defaultSetting']);
        const currencyFormat = setting.get('currencyFormat');
        const currencyType = CurrencyUtils.getCurrencyType(currencyFormat);
        const isMiliCoin = currencyType === 'mCoin';
        let validStakeDiff = false;
        let backerMultiplier;

        // Exit early if the bet has not been updated
        if (!bet.get('updated')) {
          return;
        }

        // Get the bet differences.
        const stake = bet.get('stake');
        const original_stake = bet.get('original_stake');
        stakeDiff = ObjectUtils.getBetAttrDiff(stake, original_stake);
        stakeDiff.push('stake');

        const profit = bet.get('profit');
        const original_profit = bet.get('original_profit');
        profitDiff = ObjectUtils.getBetAttrDiff(profit, original_profit);
        profitDiff.push('profit');

        const liability = bet.get('liability');
        const original_liability = bet.get('original_liability');
        liabilityDiff = ObjectUtils.getBetAttrDiff(liability, original_liability);
        liabilityDiff.push('liability');

        const odds = bet.get('odds');
        const original_odds = bet.get('original_odds');
        oddsDiff = ObjectUtils.getBetAttrDiff(odds, original_odds);
        oddsDiff.push('odds');

        // Are there any instances of decremental changes?
        // betDiff -> [x][0] = {number} amount
        //            [x][1] = {string} :'increment', 'decrement', or 'none'
        //            [x][2] = {string} field
        const betDiff = [stakeDiff, profitDiff, liabilityDiff, oddsDiff];

        betDiff.map((item) => {
          item[0] = CurrencyUtils.correctFloatingPointPrecision([item[0], item[2]], currencyType);

          if (item[1] === 'decrement') {
            changeType = BetTypes.DECREMENT;
          }

          return item;
        });

        // Followed up with add bet operation with the new parameter
        const bettingMarket = getState().getIn([
          'bettingMarket',
          'bettingMarketsById',
          bet.get('betting_market_id')
        ]);
        const bettingMarketGroupId = bettingMarket && bettingMarket.get('group_id');
        const bettingMarketGroup = getState().getIn([
          'bettingMarketGroup',
          'bettingMarketGroupsById',
          bettingMarketGroupId
        ]);
        const betAssetType =
          (bettingMarketGroup && bettingMarketGroup.get('asset_id')) || Config.coreAsset;

        // 2017-11-27 JIG
        // BOOK-232: Betslip says mBTC but is actually denominated in BTC!
        // The variable amountToBet should be sent to the blockchain based
        // on betAssetPrecision. For example, if betAssetPrecision is 5,
        // then the amountToBet should be expressed as bet x 10^5 asset tokens.

        // Make betAssetPrecision a variable so it can be adjusted as needed.
        let betAssetPrecision =
          getState().getIn(['asset', 'assetsById', betAssetType, 'precision']) || 0;

        // We need to adjust the betAssetPrecision if the Better
        // is working with mBTC instead of BTC (is, reducet the betAssetPrecision by 1000).
        // If the Better's currency format is set to 'mBTC' ...
        if (isMiliCoin) {
          // ... reduce the precision by 3
          betAssetPrecision = Math.max(betAssetPrecision - 3, 0);
        }

        let amountToBet = 0;
        let mathPow = Math.pow(10, betAssetPrecision);

        // Assign relevant values from betDiff array for readability. (the amount value only)
        [stakeDiff, profitDiff, liabilityDiff, oddsDiff] = [
          betDiff[0][0], betDiff[1][0], betDiff[2][0], betDiff[3][0]
        ];

        if (oddsDiff !== 0) {
          changeType = BetTypes.DECREMENT;
        }

        // If there are incremental changes, we will place a new bet built from the increment
        // differences.
        if (changeType === BetTypes.INCREMENT) {
          if (stakeDiff !== 0) { // Has stake changed?
            let allowDecimal = !isMiliCoin;
            
            if (allowDecimal) {
              validStakeDiff = stakeDiff > 0;
            } else {
              validStakeDiff = stakeDiff % 1 === 0;
            }
          }
        }

        backerMultiplier = Math.round(parseFloat(bet.get('odds')) * Config.oddsPrecision);

        // Build a new bet from the diff of which will be placed.
        if (bet.get('bet_type') === BetTypes.BACK) {
          if (validStakeDiff && changeType === BetTypes.INCREMENT) {
            amountToBet = parseFloat(betDiff[0][0]) * mathPow;
          } else {
            changeType = BetTypes.DECREMENT;
            amountToBet = parseFloat(bet.get('stake')) * mathPow;
          }
        } else if (bet.get('bet_type') === BetTypes.LAY) {
          if (changeType === BetTypes.INCREMENT) {
            amountToBet = parseFloat(liabilityDiff) * mathPow;
          } else {
            amountToBet = parseFloat(bet.get('liability')) * mathPow;
          }
          
        }

        amountToBet = Math.floor(amountToBet);

        // If there are decremental changes, we will cancel the bet and place a new bet with the
        // decremental differences.
        if (changeType === BetTypes.DECREMENT) {
          // Add cancel bet operation
          const cancelBetOperationParams = {
            bettor_id: bet.get('bettor_id'),
            bet_to_cancel: bet.get('original_bet_id')
          };
          const cancelBetOperationType = 'bet_cancel';
          tr.add_type_operation(cancelBetOperationType, cancelBetOperationParams);
        }

        const betPlaceOperationParams = {
          bettor_id: bet.get('bettor_id'),
          betting_market_id: bet.get('betting_market_id'),
          amount_to_bet: {
            amount: amountToBet,
            asset_id: betAssetType
          },
          backer_multiplier: backerMultiplier,
          amount_reserved_for_fees: Math.floor(amountToBet * 0.01),
          back_or_lay: bet.get('bet_type')
        };
        const betPlaceOperationType = 'bet_place';
        tr.add_type_operation(betPlaceOperationType, betPlaceOperationParams);
      });

      const betIds = bets.map((bet) => bet.get('id'));
      dispatch(
        BetPrivateActions.setEditBetsByIdsLoadingStatusAction(betIds, LoadingStatus.LOADING)
      );
      // Process transactions
      const accountName = getState().getIn(['account', 'account', 'name']);
      const password = getState().getIn(['account', 'password']);
      const keys = KeyGeneratorService.generateKeys(accountName, password);
      WalletService.processTransaction(keys, tr)
        .then(() => {
          // Update status
          dispatch(
            BetPrivateActions.setEditBetsByIdsLoadingStatusAction(betIds, LoadingStatus.LOADING)
          );
        })
        .catch((error) => {
          log.error('Fail to edit bets', error);
          // Set error
          dispatch(BetPrivateActions.setEditBetsErrorByBetIdAction(betIds, error));
        });
    };
  }
}

export default BetActions;
