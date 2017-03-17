import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import BinnedOrderBookActions from './BinnedOrderBookActions';
import _ from 'lodash';

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

  static setEventIdsAction(eventIds) {
    return {
      type: ActionTypes.ALL_SPORTS_SET_EVENT_IDS,
      eventIds
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
      // First get list of sports
      FakeApi.getSports().then((sports) => {
        // Store sports inside redux store
        dispatch(SportActions.addSportsAction(sports))

        // Create promise to get events for each sports
        let getEventsPromiseArray = [];
        _.forEach(sports, (sport) => {
          const getEventsPromise = FakeApi.getEvents(sport.id);
          getEventsPromiseArray.push(getEventsPromise);
        });

        // Call the promise together
        return Promise.all(getEventsPromiseArray);
      }).then((result) => {
        // Combine the resulting events
        _.forEach(result, (retrievedEvents) => {
          // This is defined in outer scope
          events = events.concat(retrievedEvents);
        });
        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));

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
          const getBinnedOrderBookPromise = FakeApi.get_binned_order_book(market.id, 2);
          getBinnedOrderBookPromiseArray.push(getBinnedOrderBookPromise);
        })

        // Call the promises together
        return Promise.all(getBinnedOrderBookPromiseArray);
      }).then((result) => {
        let binnedOrderBooks = [];
        _.forEach(result, (retrievedOrderBooks) => {
          binnedOrderBooks = binnedOrderBooks.concat(retrievedOrderBooks);
        })
        // Store binned order books inside redux store
        dispatch(BinnedOrderBookActions.addBinnedOrderBooksAction(binnedOrderBooks));

        // Store the final events id inside Home Redux store
        const eventIds = _.map(events, 'id');
        dispatch(AllSportsPrivateActions.setEventIdsAction(eventIds));
        dispatch(AllSportsPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      });

    };
  }
}

export default AllSportsActions;
