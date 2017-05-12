import Immutable, { Map } from 'immutable';
import { CommunicationService, WalletService } from '../services';
import { LoadingStatus, ActionTypes } from '../constants';
import BettingMarketActions from './BettingMarketActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import EventActions from './EventActions';
import SportActions from './SportActions';
import { TransactionBuilder } from 'graphenejs-lib';
import _ from 'lodash';
import log from 'loglevel';
import DateUtils from '../utility/DateUtils';
import moment from 'moment';
import { CurrencyUtils, BettingModuleUtils } from '../utility';
import { mergeRelationData, mergeBettingMarketGroup } from '../utility/MergeObjectUtils';

const getFormattedDate = DateUtils.getFormattedDate;

/**
 * Private actions
 */
class BetPrivateActions {
  static setGetOngoingBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_GET_ONGOING_BETS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setGetOngoingBetsErrorAction(error) {
    return {
      type: ActionTypes.BET_SET_GET_ONGOING_BETS_ERROR,
      error
    }
  }

  static setGetResolvedBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_GET_RESOLVED_BETS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setGetResolvedBetsErrorAction(error) {
    return {
      type: ActionTypes.BET_SET_GET_RESOLVED_BETS_ERROR,
      error
    }
  }

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

}

/**
 * Public actions
 */
class BetActions {

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

  /**
   * Get ongoing bets (unmatched and matched bets);
   */
  static getOngoingBets() {
    return (dispatch, getState) => {
      // const accountId = getState().getIn(['account', 'account', 'id']);
      //TODO: pick account id from logged in user. Currently hard coded to get the dummy data
      const accountId = '1.2.48';

      // Check if data is already in the redux store, if it has been retrieved, no need to fetch it again from blockchain
      const getOngoingBetsLoadingStatus = getState().getIn(['bet', 'getOngoingBetsLoadingStatus']);
      if (getOngoingBetsLoadingStatus !== LoadingStatus.DONE) {
        // It has been never been retrieved before, fetch from blockchain
        dispatch(BetPrivateActions.setGetOngoingBetsLoadingStatusAction(LoadingStatus.LOADING));
        let retrievedOngoingBets = [];
        return CommunicationService.getOngoingBets(accountId).then((ongoingBets) => {
          retrievedOngoingBets = ongoingBets;
          // Get betting market ids
          let bettingMarketIds = ongoingBets.map(bet => bet.get('betting_market_id')).toSet();
          // Get betting market object
          return dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds));
        }).then((bettingMarkets) => {
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
          // Add ongoing bets to redux store
          dispatch(BetActions.addOrUpdateOngoingBetsAction(retrievedOngoingBets));
          // Set status
          dispatch(BetPrivateActions.setGetOngoingBetsLoadingStatusAction(LoadingStatus.DONE));
          log.debug('Get matched and unmatched bets succeed.');
          return retrievedOngoingBets;
        }).catch((error) => {
          log.error('Fail to get matched and unmatched bets', error);
          // Set error
          dispatch(BetActions.setGetOngoingBetsErrorAction(error));
        });
      } else {
        return Promise.resolve(getState().getIn(['bet', 'unmatchedBetsById'])
                                 .concat(getState().getIn(['bet', 'matchedBetsById'])));
      }
    };
  }

  static getResolvedBets(startTime, stopTime) {
    return (dispatch, getState) => {
      // const accountId = getState().getIn(['account', 'account', 'id']);
      //TODO: pick account id from logged in user. Currently hard coded to get the dummy data
      const accountId = '1.2.48';

      dispatch(BetPrivateActions.setGetResolvedBetsLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      let retrievedResolvedBets = [];
      CommunicationService.getResolvedBets(accountId, startTime, stopTime).then((resolvedBets) => {
        retrievedResolvedBets = resolvedBets;
        // Get betting market ids
        let bettingMarketIds = resolvedBets.map(bet => bet.get('betting_market_id')).toSet();
        // Get betting market object
        return dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds));
      }).then((bettingMarkets) => {
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
        // Add to redux store
        dispatch(BetActions.addOrUpdateResolvedBetsAction(retrievedResolvedBets));
        // Set status
        dispatch(BetPrivateActions.setGetResolvedBetsLoadingStatusAction(LoadingStatus.DONE));
        log.debug('Get resolved bets succeed.');
      }).catch((error) => {
        log.error('Fail to get resolved bets', error);
        // Set error
        dispatch(BetActions.setGetResolvedBetsErrorAction(error));
      });
    };
  }

  /**
   * Get resolved bets to export
   */
  static getResolvedBetsToExport(targetCurrency, columns) {
    return (dispatch, getState) => {
      // const accountId = getState().getIn(['account', 'account', 'id']);
      //TODO: pick account id from logged in user. Currently hard coded to get the dummy data
      const accountId = '1.2.48';

      dispatch(BetPrivateActions.setGetResolvedBetsExportLoadingStatusAction(LoadingStatus.LOADING));
      //Included a 3 second timeout now, just to test the various states of export
      setTimeout(function(){
        // TODO: Replace with actual blockchain call
        let retrievedResolvedBets = [];
        CommunicationService.getResolvedBets(accountId, getState().getIn(['mywager','startDate']), getState().getIn(['mywager','endDate'])).then((resolvedBets) => {
          if(getState().getIn(['bet', 'getResolvedBetsExportLoadingStatus'])===LoadingStatus.DEFAULT)
            return;
          retrievedResolvedBets = resolvedBets;
          // Get betting market ids
          let bettingMarketIds = resolvedBets.map(bet => bet.get('betting_market_id')).toSet();
          // Get betting market object
          return dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds));
        }).then((bettingMarkets) => {
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
          let precision = getState().getIn(['asset', 'assetsById', '1.3.0']).get('precision');
          let exportData = [];
          retrievedResolvedBets.forEach(row =>
          {
            let rowObj = {
              key: row.get('id'),
              id: row.get('id'),
              'betting_market_id': row.get('betting_market_id'),
              'back_or_lay': row.get('back_or_lay'),
              'amount_to_bet': row.get('amount_to_bet'),
              'amount_to_win': row.get('amount_to_win')
            }
            exportData.push(Map(rowObj));
          });

          //merging betting market data for display and betting_market_group_id for reference
          exportData = mergeRelationData(exportData, getState().getIn(['bettingMarket','bettingMarketsById']), 'betting_market_id',
            {betting_market_group_id: 'betting_market_group_id' , payout_condition_string: 'payout_condition_string'});

          //merging betting market group data for display and eventid for reference
          exportData = mergeBettingMarketGroup(exportData,
            getState().getIn(['bettingMarketGroup','bettingMarketGroupsById']), 'betting_market_group_id');

          //merging evemt data for display and sport id for reference
          exportData = mergeRelationData(exportData, getState().getIn(['event','eventsById']), 'event_id',
            {'name': 'event_name' , 'start_time': 'event_time', 'sport_id': 'sport_id'});

          //merging sport data for display
          exportData = mergeRelationData(exportData, getState().getIn(['sport','sportsById']), 'sport_id',
            {'name': 'sport_name'});

          //showing past data as resolvedBets and future data as matchedBets unmatchedBets
          exportData = exportData.filter(row => (moment(row.get('event_time')).isBetween(getState().getIn(['mywager','startDate']), getState().getIn(['mywager','endDate']))))
          //check if this can be improved
          //TODO: use .map() instead of foreach as suggested
          exportData.forEach((row, index) => {
            let rowObj = {
              'event_time': getFormattedDate(row.get('event_time')),
              'type' : (row.get('back_or_lay') + ' | ' + row.get('payout_condition_string') + ' ' + row.get('options') + ' | ' + row.get('market_type_id')),
              'odds' : (row.get('amount_to_win') / row.get('amount_to_bet')).toFixed(2),

              //randomly changed win value to negative for liability display
              'amount_to_bet' : CurrencyUtils.getFormattedCurrency(row.get('amount_to_bet')/ Math.pow(10, precision), targetCurrency, BettingModuleUtils.stakePlaces),
              'amount_to_win' : CurrencyUtils.getFormattedCurrency(row.get('amount_to_win')/ Math.pow(10, precision) * ( Math.floor(Math.random()*2) === 1 ? 1 : -1 ),
                targetCurrency, BettingModuleUtils.exposurePlaces),
            };
            exportData[index] = row.merge(rowObj);
          });
          //Generated Resolved bets export object array using foreach to display properties in particular order in excel.
          //TODO: Need to check if this can be improved
          /*NOTE: Things to be taken care of for Resolved bet export data are listed below:-
            1. Object property name change as per column configuration
            2. Sequence of properties in Object as per column configuration
            3. Removing unwanted columns from export data
          */
          exportData.forEach((row, index) => {
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
