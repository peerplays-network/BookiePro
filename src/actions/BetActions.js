import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';
import BettingMarketActions from './BettingMarketActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import EventActions from './EventActions';
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
      const account = getState().account.account;
      const accountId = account && account.get('id');

      dispatch(BetPrivateActions.setGetOngoingBetsLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      let ongoingBets = [];
      FakeApi.getOngoingBets(accountId).then((retrievedBets) => {
        ongoingBets = retrievedBets;
        console.log('ongoingBets', ongoingBets);

        // Get betting market ids
        let bettingMarketIds = _.chain(ongoingBets).map((bet) => {
          return bet.betting_market_id
        }).uniq().value();

        // Get betting market object
        console.log('bettingMarketIds', bettingMarketIds);
        return FakeApi.getObjects(bettingMarketIds);
      }).then((bettingMarkets) => {
        console.log('bettingMarkets', bettingMarkets);
        // Store betting market groups inside redux store
        dispatch(BettingMarketActions.addBettingMarketsAction(bettingMarkets));

        // Get unique betting market group ids
        let bettingMarketGroupIds = _.chain(bettingMarkets).map((bettingMarket) => {
          return bettingMarket.betting_market_group_id
        }).uniq().value();

        // Get the betting market groups
        console.log('bettingMarketGroupIds', bettingMarketGroupIds);
        return FakeApi.getObjects(bettingMarketGroupIds);
      }).then((bettingMarketGroups) => {
        // Store betting market groups inside redux store
        console.log('bettingMarketGroups', bettingMarketGroups);
        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));

        // Get unique event ids
        let eventIds = _.chain(bettingMarketGroups).map((bettingMarketGroup) => {
          return bettingMarketGroup.event_id
        }).uniq().value();

        console.log('eventIds', eventIds);
        // Get the betting market groups
        return FakeApi.getObjects(eventIds);
      }).then((events) => {
        console.log('events', events);
        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));

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
}

export default BetActions;
