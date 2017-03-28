import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import _ from 'lodash';
import Immutable from 'immutable';
import {
  getEventsBySports,
  getBettingMarketGroupsByEvents,
  getBettingMarketsInBettingMarketGroups,
  getBinnedOrderBooksByBettingMarkets,
  groupBinnedOrderBooksByBettingMarketId,
  groupBinnedOrderBooksByEvent
} from './utilities'

/**
 * Private actions
 */
class AllSportsPrivateActions {
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.ALL_SPORTS_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static setDataAction(eventIds, binnedOrderBooksByEvent) {
    return {
      type: ActionTypes.ALL_SPORTS_SET_DATA,
      eventIds,
      binnedOrderBooksByEvent
    }
  }
}

/**
 * Public actions
 */
class AllSportsActions {
  static getData() {
    return (dispatch) => {
      dispatch(AllSportsPrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let events = [];
      let bettingMarketGroups = [];
      // First get list of sports
      FakeApi.getSports().then((sports) => {
        // Store sports inside redux store
        dispatch(SportActions.addSportsAction(sports))
        return getEventsBySports(sports);

      }).then((result) => {
        // Combine the resulting events
        // Save retrieved events for action dispatch later
        events = _.flatMap(result);

        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));
        return getBettingMarketGroupsByEvents(events);

      }).then((result) => {
        // Combine the resulting betting market groups
        bettingMarketGroups = _.flatMap(result);
        // Store betting market groups inside redux store
        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));
        return getBettingMarketsInBettingMarketGroups(bettingMarketGroups)

      }).then((result) => {
        // Combine the resulting betting markets
        const bettingMarkets = _.flatMap(result);
        // Store betting markets inside redux store
        dispatch(BettingMarketActions.addBettingMarketsAction(bettingMarkets));
        return getBinnedOrderBooksByBettingMarkets(bettingMarkets);

      }).then((result) => {
        // Combine the resulting binned order books
        const binnedOrderBooks = groupBinnedOrderBooksByBettingMarketId(_.flatMap(result));

        let binnedOrderBooksByEvent = Immutable.Map();
        events.forEach((event) => {
          binnedOrderBooksByEvent = binnedOrderBooksByEvent.set(
            event.get('id'), groupBinnedOrderBooksByEvent(event, bettingMarketGroups, binnedOrderBooks)
          );
        });

        // Stored all retrieve data in the AllSports state in Redux store
        const eventIds = _.map(events, (event) => event.get('id'));
        dispatch(AllSportsPrivateActions.setDataAction(eventIds, binnedOrderBooksByEvent));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(AllSportsPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      });

    };
  }
}

export default AllSportsActions;
