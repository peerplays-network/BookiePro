import FakeApi from '../communication/FakeApi';
import { ActionTypes, LoadingStatus } from '../constants';
import EventActions from './EventActions';
import EventGroupActions from './EventGroupActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import _ from 'lodash';

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

  static setEventIdsAction(eventIds) {
    return {
      type: ActionTypes.SPORT_PAGE_SET_EVENT_IDS,
      eventIds
    }
  }

  static setEventGroupIdsAction(eventGroupIds) {
    return {
      type: ActionTypes.SPORT_PAGE_SET_EVENT_GROUP_IDS,
      eventGroupIds
    }
  }

  static setBinnedOrderBooksAction(binnedOrderBooks) {
    return {
      type: ActionTypes.SPORT_PAGE_SET_BINNED_ORDER_BOOKS,
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

      FakeApi.getEventGroups(sportId).then((retrievedEventGroups) => {
        // Store event groups inside redux Store
        dispatch(EventGroupActions.addEventGroupsAction(retrievedEventGroups));

        // Store the final event group ids inside SportPage Redux store
        const eventGroupIds = _.map(retrievedEventGroups, 'id');
        dispatch(SportPagePrivateActions.setEventGroupIdsAction(eventGroupIds));

        return FakeApi.getEvents(sportId);
      }).then((result) => {
        let events = [];
        // Combine the resulting events
        _.forEach(result, (retrievedEvents) => {
          events = events.concat(retrievedEvents);
        });
        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));

        // Store the final event ids inside SportPage Redux store
        const eventIds = _.map(events, 'id');
        dispatch(SportPagePrivateActions.setEventIdsAction(eventIds));

        // Create promise to get betting market groups for each event
        let getBettingMarketGroupPromiseArray = [];
        _.forEach(events, (event) => {
          const getBettingMarketGroupPromise = FakeApi.getObjects(event.betting_market_group_ids);
          getBettingMarketGroupPromiseArray.push(getBettingMarketGroupPromise);
        });

        // Call the promise together
        return Promise.all(getBettingMarketGroupPromiseArray);
      }).then((result) => {
        // Combine the resulting betting market groups
        let bettingMarketGroups = [];
        _.forEach(result, (retrievedBettingMarketGroups) => {
          bettingMarketGroups = bettingMarketGroups.concat(retrievedBettingMarketGroups);
        });
        // Store betting market groups inside redux store
        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));

        // Create promise to get betting markets for each group
        let getBettingMarketPromiseArray = [];
        _.forEach(bettingMarketGroups, (group) => {
          const getBettingMarketPromise = FakeApi.getObjects(group.betting_market_ids);
          getBettingMarketPromiseArray.push(getBettingMarketPromise);
        });

        // Call the promises together
        return Promise.all(getBettingMarketPromiseArray)
      }).then((result) => {
        // Combine the result betting markets
        let bettingMarkets = [];
        _.forEach(result, (retrievedBettingMarkets) => {
          bettingMarkets = bettingMarkets.concat(retrievedBettingMarkets);
        });
        // Store betting markets inside redux store
        dispatch(BettingMarketActions.addBettingMarketsAction(bettingMarkets));

        // Create promisr to get Binned Order Books for each market
        let getBinnedOrderBookPromiseArray = [];
        _.forEach(bettingMarkets, (market) => {
          const getBinnedOrderBookPromise = FakeApi.getBinnedOrderBook(market.id, 2);
          getBinnedOrderBookPromiseArray.push(getBinnedOrderBookPromise);
        });

        // Call the promises together
        return Promise.all(getBinnedOrderBookPromiseArray);
      }).then((result) => {
        let binnedOrderBooks = [];
        _.forEach(result, (retrievedOrderBooks) => {
          binnedOrderBooks = binnedOrderBooks.concat(retrievedOrderBooks);
        });

        // Store binned order books inside redux store
        dispatch(SportPagePrivateActions.setBinnedOrderBooksAction(binnedOrderBooks));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(SportPagePrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      });
    };
  }
}

export default SportPageActions;
