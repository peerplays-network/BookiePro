import Immutable, { Map } from 'immutable';
import { WalletService, HistoryService } from '../services';
import { LoadingStatus, ActionTypes } from '../constants';
import BettingMarketActions from './BettingMarketActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import EventActions from './EventActions';
import SportActions from './SportActions';
import CompetitorActions from './CompetitorActions';
import { TransactionBuilder } from 'graphenejs-lib';
import _ from 'lodash';
import log from 'loglevel';
import DateUtils from '../utility/DateUtils';
import moment from 'moment';
import { CurrencyUtils, BettingModuleUtils } from '../utility';
import { mergeRelationData, mergeBettingMarketGroup } from '../utility/MergeObjectUtils';
import { getStake } from '../selectors/MyWagerSelector';

const getFormattedDate = DateUtils.getFormattedDate;

/**
 * Private actions
 */
class BetPrivateActions {

  static setMakeBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_MAKE_BETS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setMakeBetsErrorAction(error) {
    return {
      type: ActionTypes.BET_SET_MAKE_BETS_ERROR,
      error
    }
  }

  static setCancelBetsByIdsLoadingStatusAction(betIds, loadingStatus) {
    return {
      type: ActionTypes.BET_SET_CANCEL_BETS_BY_IDS_LOADING_STATUS,
      betIds,
      loadingStatus
    }
  }

  static setCancelBetsErrorByBetIdAction(betIds, error) {
    return {
      type: ActionTypes.BET_SET_CANCEL_BETS_ERROR_BY_BET_ID,
      betIds,
      error
    }
  }

  static setEditBetsByIdsLoadingStatusAction(betIds, loadingStatus) {
    return {
      type: ActionTypes.BET_SET_EDIT_BETS_BY_IDS_LOADING_STATUS,
      betIds,
      loadingStatus
    }
  }

  static setEditBetsErrorByBetIdAction(betIds, error) {
    return {
      type: ActionTypes.BET_SET_EDIT_BETS_ERROR_BY_BET_ID,
      betIds,
      error
    }
  }

  static setGetResolvedBetsExportLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_GET_RESOLVED_BETS_EXPORT_LOADING_STATUS,
      loadingStatus
    }
  }

  static setGetResolvedBetsExportErrorAction(error) {
    return {
      type: ActionTypes.BET_SET_GET_RESOLVED_BETS_EXPORT_ERROR,
      error
    }
  }

  static clearResolvedBetsExportAction() {
    return {
      type: ActionTypes.BET_CLEAR_RESOLVED_BETS_EXPORT
    }
  }

  static setMyBetsAction(myBets) {
    return {
      type: ActionTypes.BET_SET_MY_BETS,
      myBets
    }
  }

  static updateMyBetsAction(myBets) {
    return {
      type: ActionTypes.BET_UPDATE_MY_BETS,
      myBets
    }
  }
  static setInitMyBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_INIT_MY_BETS_LOADING_STATUS,
      loadingStatus
    }
  }
  static setInitMyBetsErrorAction(error) {
    return {
      type: ActionTypes.BET_INIT_MY_BETS_ERROR,
      error
    }
  }
  static setCheckForNewMyBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_CHECK_FOR_NEW_MY_BETS_LOADING_STATUS,
      loadingStatus
    }
  }
  static setCheckForNewMyBetsErrorAction(error) {
    return {
      type: ActionTypes.BET_CHECK_FOR_NEW_MY_BETS_ERROR,
      error
    }
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

        // Fetch related betting markets (use set to make the list unique)
        let bettingMarketIds = Immutable.Set();
        myBets.unmatchedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.add(bet.get('betting_market_id'));
        })
        myBets.matchedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.add(bet.get('betting_market_id'));
        })
        myBets.resolvedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.add(bet.get('betting_market_id'));
        })

        dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds)).then((bettingMarkets) => {
          // Get unique betting market group ids
          let bettingMarketGroupIds = bettingMarkets.map(bettingMarket => bettingMarket.get('betting_market_group_id')).toSet();
          // Get the betting market groups
          return dispatch(BettingMarketGroupActions.getBettingMarketGroupsByIds(bettingMarketGroupIds));
        }).then((bettingMarketGroups) => {
          // Get unique event ids
          let eventIds = bettingMarketGroups.map(bettingMarketGroup => bettingMarketGroup.get('event_id')).toSet();
          // Get the betting market groups
          return dispatch(EventActions.getEventsByIds(eventIds));
        }).then((events) => {
          // Get unique sport ids
          let sportIds = events.map(event => event.get('sport_id')).toSet();
          // Get the betting market groups
          return dispatch(SportActions.getSportsByIds(sportIds));
        }).then((sports) => {
          // Set my bets
          dispatch(BetPrivateActions.setMyBetsAction(myBets));
          // Setstatus
          dispatch(BetPrivateActions.setInitMyBetsLoadingStatusAction(LoadingStatus.DONE));
          log.debug('Init my bets succeed.');
        }).catch((error) => {
          log.error('Fail to init my bets', error);
          // Set error
          dispatch(BetActions.setInitMyBetsErrorAction(error));
        });
      }
    }
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
        const myBets = HistoryService.convertRawHistoryToMyBets(getState(),
                                                                rawHistoryDelta);

        // Fetch related betting markets (use set to make the list unique)
        let bettingMarketIds = Immutable.Set();
        myBets.unmatchedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.add(bet.get('betting_market_id'));
        })
        myBets.matchedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.add(bet.get('betting_market_id'));
        })
        myBets.resolvedBetsById.forEach((bet) => {
          bettingMarketIds = bettingMarketIds.add(bet.get('betting_market_id'));
        })

        dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds)).then((bettingMarkets) => {
          // Get unique betting market group ids
          let bettingMarketGroupIds = bettingMarkets.map(bettingMarket => bettingMarket.get('betting_market_group_id')).toSet();
          // Get the betting market groups
          return dispatch(BettingMarketGroupActions.getBettingMarketGroupsByIds(bettingMarketGroupIds));
        }).then((bettingMarketGroups) => {
          // Get unique event ids
          let eventIds = bettingMarketGroups.map(bettingMarketGroup => bettingMarketGroup.get('event_id')).toSet();
          // Get the events
          return dispatch(EventActions.getEventsByIds(eventIds));
        }).then((events) => {
          // Get unique sport ids
          let sportIds = events.map(event => event.get('sport_id')).toSet();
          let competitorIds = Immutable.Set();
          events.forEach((event) => {
            const scores = event.get('scores') || Immutable.List();
            scores.forEach((score) => {
              const competitorId = score.get('competitor_id')
              competitorIds = competitorIds.add(competitorId);
            })
          });
          // Get related data
          return Promise.all([
            dispatch(CompetitorActions.getCompetitorsByIds(competitorIds)),
            dispatch(SportActions.getSportsByIds(sportIds)),
          ]);
        }).then(() => {
          // Set my bets
          dispatch(BetPrivateActions.updateMyBetsAction(myBets));
          // Setstatus
          dispatch(BetPrivateActions.setCheckForNewMyBetsLoadingStatusAction(LoadingStatus.DONE));
          log.debug('Check for new my bets succeed.');
        }).catch((error) => {
          log.error('Fail to check for new my bets', error);
          // Set error
          dispatch(BetPrivateActions.setCheckForNewMyBetsErrorAction(error));
        });
      }
    }
  }

  static addOrUpdateOngoingBetsAction(ongoingBets) {
    return {
      type: ActionTypes.BET_ADD_OR_UPDATE_ONGOING_BETS,
      ongoingBets
    }
  }

  static removeOngoingBetsByIdsAction(ongoingBetIds) {
    return {
      type: ActionTypes.BET_REMOVE_ONGOING_BETS,
      ongoingBetIds
    }
  }

  static addOrUpdateResolvedBetsAction(resolvedBets) {
    return {
      type: ActionTypes.BET_ADD_OR_UPDATE_RESOLVED_BETS,
      resolvedBets
    }
  }

  static addOrUpdateResolvedBetsExportAction(resolvedBetsExport) {
    return {
      type: ActionTypes.BET_ADD_OR_UPDATE_RESOLVED_BETS_EXPORT,
      resolvedBetsExport
    }
  }

  //Reset Resolved bets export status to default when the export is cancelled
  static resetResolvedBetsExportLoadingStatus(){
    return BetPrivateActions.setGetResolvedBetsExportLoadingStatusAction(LoadingStatus.DEFAULT);
  }

  //Clear Resolved Bets export data after download to clean up memory
  static clearResolvedBetsExport(){
    return BetPrivateActions.clearResolvedBetsExportAction();
  }

  static getResolvedBetsToExport(targetCurrency, columns) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        dispatch(BetPrivateActions.setGetResolvedBetsExportLoadingStatusAction(LoadingStatus.LOADING));
        //Included a 3 second timeout now, just to test the various states of export
        setTimeout(function(){
          // TODO: Replace with actual blockchain call
          let retrievedResolvedBets = getState().getIn(['bet', 'resolvedBetsById'])
            .filter(row => (moment(row.get('resolved_time')).isBetween(getState().getIn(['mywager','startDate']), getState().getIn(['mywager','endDate']))));
          if(getState().getIn(['bet', 'getResolvedBetsExportLoadingStatus'])===LoadingStatus.DEFAULT)
            return;
          // Get betting market ids
          let bettingMarketIds = retrievedResolvedBets.map(bet => bet.get('betting_market_id')).toSet();

          dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds)).then((bettingMarkets) => {
            // Get unique betting market group ids
            let bettingMarketGroupIds = bettingMarkets.map(bettingMarket => bettingMarket.get('betting_market_group_id')).toSet();
            // Get the betting market groups
            return dispatch(BettingMarketGroupActions.getBettingMarketGroupsByIds(bettingMarketGroupIds));
          }).then((bettingMarketGroups) => {
            // Get unique event ids
            let eventIds = bettingMarketGroups.map(bettingMarketGroup => bettingMarketGroup.get('event_id')).toSet();
            // Get the betting market groups
            return dispatch(EventActions.getEventsByIds(eventIds));
          }).then((events) => {
            // Get unique sport ids
            let sportIds = events.map(event => event.get('sport_id')).toSet();
            // Get the betting market groups
            return dispatch(SportActions.getSportsByIds(sportIds));
          }).then((sports) => {
            let precision = getState().getIn(['asset', 'assetsById', '1.3.0', 'precision']);
            let exportData = [];
            retrievedResolvedBets.forEach(row =>
            {
              if(moment(row.get('resolved_time')).isBetween(getState().getIn(['mywager','startDate']), getState().getIn(['mywager','endDate']))){
                let rowObj = {
                  key: row.get('id'),
                  id: row.get('id'),
                  'betting_market_id': row.get('betting_market_id'),
                  'back_or_lay': row.get('back_or_lay'),
                  'stake': CurrencyUtils.getFormattedCurrency(getStake('resolvedBets', row)/ Math.pow(10, precision), targetCurrency, BettingModuleUtils.stakePlaces),
                  'odds': row.get('backer_multiplier'),
                  'profit_liability': CurrencyUtils.getFormattedCurrency(row.get('amount_won')/ Math.pow(10, precision), targetCurrency, BettingModuleUtils.exposurePlaces),
                  'resolved_time': getFormattedDate(row.get('resolved_time'))
                }
                exportData.push(Map(rowObj));
              }
            });

            //merging betting market data for display and betting_market_group_id for reference
            exportData = mergeRelationData(exportData, getState().getIn(['bettingMarket','bettingMarketsById']), 'betting_market_id',
              {betting_market_group_id: 'betting_market_group_id' , payout_condition_string: 'payout_condition_string'});

            //merging betting market group data for display and eventid for reference
            exportData = mergeBettingMarketGroup(exportData,
              getState().getIn(['bettingMarketGroup','bettingMarketGroupsById']), 'betting_market_group_id');

            //merging evemt data for display and sport id for reference
            exportData = mergeRelationData(exportData, getState().getIn(['event','eventsById']), 'event_id',
              {'name': 'event_name' , 'sport_id': 'sport_id'});

            //merging sport data for display
            exportData = mergeRelationData(exportData, getState().getIn(['sport','sportsById']), 'sport_id',
              {'name': 'sport_name'});

            //Generated Resolved bets export object array using foreach to display properties in particular order in excel.
            //TODO: Need to check if this can be improved
            /*NOTE: Things to be taken care of for Resolved bet export data are listed below:-
              1. Object property name change as per column configuration
              2. Sequence of properties in Object as per column configuration
              3. Removing unwanted columns from export data
            */
            exportData.forEach((row, index) => {
              row = row.merge({
                'type' : (row.get('back_or_lay') + ' | ' + row.get('payout_condition_string') + ' ' + row.get('options') + ' | ' + row.get('market_type_id')),
              });
              let formattedRow = {};
              for (var i = 0; i < columns.length; i++) {
                formattedRow[columns[i].title] = row.get(columns[i].key);
              }
              exportData[index] = formattedRow;
            });

            // Add to redux store
            dispatch(BetActions.addOrUpdateResolvedBetsExportAction(exportData));
            // Set Resolved Bets Export Loadings tatus
            dispatch(BetPrivateActions.setGetResolvedBetsExportLoadingStatusAction(LoadingStatus.DONE));
            log.debug('Get resolved bets export succeed.');
          }).catch((error) => {
            log.error('Fail to get resolved bets export', error);
            // Set error
            dispatch(BetActions.setGetResolvedBetsExportErrorAction(error));
          });
        }, 3000);
      };
    }

  }

  /**
   * Make bets, (bets format in this parameter is not determined yet)
   */
  static makeBets(bets) {
    return (dispatch, getState) => {
      dispatch(BetPrivateActions.setMakeBetsLoadingStatusAction(LoadingStatus.LOADING));

      const tr = new TransactionBuilder();
      bets.forEach((bet) => {
        // NOTE: Temporarily disabled until we have the real blockchain ready
        console.warn('warning   BetActions.makeBets is currently disabled.');
        // Create operation for each bet and attach it to the transaction
        //const operationParams = {};
        //const operationType = 'bet_operation';
        //tr.add_type_operation(operationType, operationParams);
      });

      // TODO: replace this with validwallet service process transaction later on
      WalletService.processFakeTransaction(getState(), tr).then(() => {
        log.debug('Make bets succeed.');
        dispatch(BetPrivateActions.setMakeBetsLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Fail to get make bets', error);
        // Set error
        dispatch(BetPrivateActions.setMakeBetsErrorAction(error));
      });
    }
  }

  /**
   * Cancel bets
   * bets - array of blockchain bet objects
   */
  static cancelBets(bets) {
    return (dispatch, getState) => {
      let betIds = Immutable.List();
      // Build transaction
      const tr = new TransactionBuilder();
      bets.forEach((bet) => {
        betIds = betIds.push(bet.get('id'));
        //NOTE:commented as transaction add operation not doing anything
        console.warn('warning   BetActions.cancelBets is currently disabled.');
        // Create operation for each bet and attach it to the transaction
        // const operationParams = {};
        // const operationType = 'cancel_bet_operation';
        // tr.add_type_operation(operationType, operationParams);
      });

      dispatch(BetPrivateActions.setCancelBetsByIdsLoadingStatusAction(betIds, LoadingStatus.LOADING));
      // TODO: replace this with valid wallet service process transaction later on
      WalletService.processFakeTransaction(getState(), tr).then(() => {
        log.debug('Cancel bets succeed.');
        dispatch(BetPrivateActions.setCancelBetsByIdsLoadingStatusAction(betIds,LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Fail to cancel bets', error);
        // Set error
        dispatch(BetActions.setCancelBetsErrorByBetIdAction(betIds, error));
      });
    }
  }

  /**
   * Edit bets
   * bets - array of edited blockchain bet objects
   */
  static editBets(bets) {
    return (dispatch, getState) => {
      let betIds = Immutable.List();
      const tr = new TransactionBuilder();
      bets.forEach((bet) => {
        betIds = betIds.push(bet.get('id'));
        // NOTE: This will be commented out until we have the actual Blockchain
        console.warn('warning   BetActions.editBets is currently disabled.');
        // Create operation for each bet and attach it to the transaction
        //const cancelOperationParams = {};
        //const cancelOperationType = 'cancel_bet_operation';
        // Add cancel operation
        //tr.add_type_operation(cancelOperationType, cancelOperationParams);
        // Add create operation
        //const createOperationParams = {};
        //const createOperationType = 'bet_operation';
        //tr.add_type_operation(createOperationType, createOperationParams);
      });
      dispatch(BetPrivateActions.setEditBetsByIdsLoadingStatusAction(betIds, LoadingStatus.LOADING));
      // TODO: replace this with valid wallet service process transaction later on
      WalletService.processFakeTransaction(getState(), tr).then(() => {
        dispatch(BetPrivateActions.setEditBetsByIdsLoadingStatusAction(betIds, LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Fail to edit bets', error);
        // Set error
        dispatch(BetPrivateActions.setEditBetsErrorByBetIdAction(betIds, error));
      });
    }
  }
}

export default BetActions;
