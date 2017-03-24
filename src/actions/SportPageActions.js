import FakeApi from '../communication/FakeApi';
import { ActionTypes, LoadingStatus } from '../constants';
import EventActions from './EventActions';
import EventGroupActions from './EventGroupActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import _ from 'lodash';
import {
  getBettingMarketGroupsByEvents,
  getBettingMarketsInBettingMarketGroups,
  getBinnedOrderBooksByBettingMarkets
} from './utilities'

/**
 * Private actions
 */
class SportPagePrivateActions {
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.SPORT_PAGE_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static setDataAction(eventIds, eventGroupIds, binnedOrderBooks) {
    return {
      type: ActionTypes.SPORT_PAGE_SET_DATA,
      eventIds,
      eventGroupIds,
      binnedOrderBooks
    }
  }
}

/**
 * Public actions
 */
class SportPageActions {
  static getData(sportId) {
    return (dispatch) => {
      dispatch(SportPagePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let eventGroups = [];
      let events = [];
      FakeApi.getEventGroups(sportId).then((result) => {
        eventGroups = result;
        // Store event groups inside redux Store
        dispatch(EventGroupActions.addEventGroupsAction(eventGroups));
        return FakeApi.getEvents(sportId);

      }).then((result) => {
        events = _.flatMap(result);
        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));
        return getBettingMarketGroupsByEvents(events);

      }).then((result) => {
        // Combine the resulting betting market groups
        let bettingMarketGroups = _.flatMap(result);
        // Store betting market groups inside redux store
        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));
        return getBettingMarketsInBettingMarketGroups(bettingMarketGroups);

      }).then((result) => {
        // Combine the result betting markets
        let bettingMarkets = _.flatMap(result);
        // Store betting markets inside redux store
        dispatch(BettingMarketActions.addBettingMarketsAction(bettingMarkets));
        return getBinnedOrderBooksByBettingMarkets(bettingMarkets);

      }).then((result) => {
        let binnedOrderBooks = _.flatMap(result);

        // Stored all retrieve data in the SportPage state in Redux store
        dispatch(SportPagePrivateActions.setDataAction(
          _.map(events, 'id'),
          _.map(eventGroups, 'id'),
          binnedOrderBooks
        ));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(SportPagePrivateActions.setLoadingStatusAction(LoadingStatus.DONE));

      });
    };
  }
}

export default SportPageActions;
