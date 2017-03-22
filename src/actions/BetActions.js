import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';
import BettingMarketActions from './BettingMarketActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import EventActions from './EventActions';
import SportActions from './SportActions';
import { TransactionBuilder } from 'graphenejs-lib';
import _ from 'lodash';

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

  static setGetResolvedBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_GET_RESOLVED_BETS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setMakeBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_MAKE_BETS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setCancelBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_CANCEL_BETS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setEditBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_EDIT_BETS_LOADING_STATUS,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class BetActions {
  static addOngoingBetsAction(ongoingBets) {
    return {
      type: ActionTypes.BET_ADD_ONGOING_BETS,
      ongoingBets
    }
  }

  static addResolvedBetsAction(resolvedBets) {
    return {
      type: ActionTypes.BET_ADD_RESOLVED_BETS,
      resolvedBets
    }
  }

  static getOngoingBets() {
    return (dispatch, getState) => {
      // const account = getState().account.account;
      // const accountId = account && account.get('id');
      const accountId = '1.2.48';

      dispatch(BetPrivateActions.setGetOngoingBetsLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      let ongoingBets = [];
      FakeApi.getOngoingBets(accountId).then((retrievedBets) => {
        ongoingBets = retrievedBets;

        // Get betting market ids
        let bettingMarketIds = _.chain(ongoingBets).map((bet) => {
          return bet.betting_market_id
        }).uniq().value();

        // Get betting market object
        return FakeApi.getObjects(bettingMarketIds);
      }).then((bettingMarkets) => {
        // Store betting market groups inside redux store
        dispatch(BettingMarketActions.addBettingMarketsAction(bettingMarkets));

        // Get unique betting market group ids
        let bettingMarketGroupIds = _.chain(bettingMarkets).map((bettingMarket) => {
          return bettingMarket.betting_market_group_id
        }).uniq().value();

        // Get the betting market groups
        return FakeApi.getObjects(bettingMarketGroupIds);
      }).then((bettingMarketGroups) => {
        // Store betting market groups inside redux store
        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));

        // Get unique event ids
        let eventIds = _.chain(bettingMarketGroups).map((bettingMarketGroup) => {
          return bettingMarketGroup.event_id
        }).uniq().value();

        // Get the betting market groups
        return FakeApi.getObjects(eventIds);
      }).then((events) => {
        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));

        // Get unique sport ids
        let sportIds = _.chain(events).map((event) => {
          return event.sport_id
        }).uniq().value();

        // Get the sports
        return FakeApi.getObjects(sportIds);
      }).then((sports) => {
        // Store sports inside redux store
        dispatch(SportActions.addSportsAction(sports));

        // Add ongoing bets to redux store
        dispatch(BetActions.addOngoingBetsAction(ongoingBets));
        dispatch(BetPrivateActions.setGetOngoingBetsLoadingStatusAction(LoadingStatus.DONE));
      });
    };
  }

  static getResolvedBets(startTime, stopTime) {
    return (dispatch, getState) => {
      const account = getState().account.account;
      const accountId = account && account.get('id');

      dispatch(BetPrivateActions.setGetResolvedBetsLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      FakeApi.getResolvedBets(accountId, startTime, stopTime).then((bets) => {
        dispatch(BetActions.addResolvedBetsAction(bets));
        dispatch(BetPrivateActions.setGetResolvedBetsLoadingStatusAction(LoadingStatus.DONE));
      });

    };
  }

  static makeBets(bets) {
    return (dispatch) => {
      dispatch(BetPrivateActions.setMakeBetsLoadingStatus(LoadingStatus.LOADING));

      const tr = new TransactionBuilder();
      _.forEach(bets, (bet) => {
        // Create operation for each bet and attach it to the transaction
        const operationParams = {};
        const operationType = 'bet_operation';
        tr.add_type_operation(operationType, operationParams);
      });

      // TODO: replace this with wallet service process transaction later on
      FakeApi.processTransaction(tr).then(() => {
        dispatch(BetPrivateActions.setMakeBetsLoadingStatus(LoadingStatus.DONE));
      });
    }
  }

  static cancelBets(bets) {
    return (dispatch) => {
      dispatch(BetPrivateActions.setCancelBetsLoadingStatus(LoadingStatus.LOADING));

      const tr = new TransactionBuilder();
      _.forEach(bets, (bet) => {
        // Create operation for each bet and attach it to the transaction
        const operationParams = {};
        const operationType = 'cancel_bet_operation';
        tr.add_type_operation(operationType, operationParams);
      });

      // TODO: replace this with wallet service process transaction later on
      FakeApi.processTransaction(tr).then(() => {
        dispatch(BetPrivateActions.setCancelBetsLoadingStatus(LoadingStatus.DONE));
      });
    }
  }

  static editBets(bets) {
    return (dispatch) => {
      dispatch(BetPrivateActions.setEditBetsLoadingStatus(LoadingStatus.LOADING));

      const tr = new TransactionBuilder();
      _.forEach(bets, (bet) => {
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

      // TODO: replace this with wallet service process transaction later on
      FakeApi.processTransaction(tr).then(() => {
        dispatch(BetPrivateActions.setEditBetsLoadingStatus(LoadingStatus.DONE));
      });
    }
  }
}

export default BetActions;
