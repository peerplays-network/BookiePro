import Immutable from 'immutable';
import { CommunicationService, WalletService } from '../services';
import { LoadingStatus, ActionTypes } from '../constants';
import BettingMarketActions from './BettingMarketActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import EventActions from './EventActions';
import SportActions from './SportActions';
import { TransactionBuilder } from 'graphenejs-lib';
import _ from 'lodash';
import log from 'loglevel';

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
        CommunicationService.getOngoingBets(accountId).then((ongoingBets) => {
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
        }).catch((error) => {
          log.error('Fail to get matched and unmatched bets', error);
          // Set error
          dispatch(BetActions.setGetOngoingBetsErrorAction(error));
        });
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
  static getResolvedBetsToExport(startTime, stopTime) {
    return (dispatch, getState) => {
      // const accountId = getState().getIn(['account', 'account', 'id']);
      //TODO: pick account id from logged in user. Currently hard coded to get the dummy data
      const accountId = '1.2.48';

      dispatch(BetPrivateActions.setGetResolvedBetsExportLoadingStatusAction(LoadingStatus.LOADING));
      //Included a 3 second timeout now, just to test the various states of export
      setTimeout(function(){
        // TODO: Replace with actual blockchain call
        let retrievedResolvedBets = [];
        CommunicationService.getResolvedBets(accountId, startTime, stopTime).then((resolvedBets) => {
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
          // Add to redux store
          dispatch(BetActions.addOrUpdateResolvedBetsExportAction(retrievedResolvedBets));
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
      dispatch(BetPrivateActions.setMakeBetsLoadingStatus(LoadingStatus.LOADING));

      const tr = new TransactionBuilder();
      bets.forEach((bet) => {
        // Create operation for each bet and attach it to the transaction
        const operationParams = {};
        const operationType = 'bet_operation';
        tr.add_type_operation(operationType, operationParams);
      });

      // TODO: replace this with validwallet service process transaction later on
      WalletService.processFakeTransaction(getState(), tr).then(() => {
        log.debug('Make bets succeed.');
        dispatch(BetPrivateActions.setMakeBetsLoadingStatus(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Fail to get make bets', error);
        // Set error
        dispatch(BetActions.setMakeBetsErrorAction(error));
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
        // Create operation for each bet and attach it to the transaction
        const cancelOperationParams = {};
        const cancelOperationType = 'cancel_bet_operation';
        // Add cancel operation
        tr.add_type_operation(cancelOperationType, cancelOperationParams);
        // Add create operation
        const createOperationParams = {};
        const createOperationType = 'bet_operation';
        tr.add_type_operation(createOperationType, createOperationParams);
      });
      dispatch(BetPrivateActions.setEditBetsByIdsLoadingStatusAction(betIds, LoadingStatus.LOADING));
      // TODO: replace this with valid wallet service process transaction later on
      WalletService.processFakeTransaction(getState(), tr).then(() => {
        dispatch(BetPrivateActions.setEditBetsByIdsLoadingStatusAction(betIds, LoadingStatus.LOADING));
      }).catch((error) => {
        log.error('Fail to edit bets', error);
        // Set error
        dispatch(BetActions.setEditBetsErrorByBetIdAction(betIds, error));
      });
    }
  }
}

export default BetActions;
