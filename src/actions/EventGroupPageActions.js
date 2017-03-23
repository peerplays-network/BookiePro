import FakeApi from '../communication/FakeApi';
import { ActionTypes, LoadingStatus } from '../constants';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import _ from 'lodash';

class EventGroupPagePrivateActions {
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static setDataAction(sportName, eventGroupName, eventIds, binnedOrderBooks) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_DATA,
      sportName,
      eventGroupName,
      eventIds,
      binnedOrderBooks
    }
  }

  static setEventIdsAction(eventIds) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_EVENT_IDS,
      eventIds
    }
  }

}

class EventGroupPageActions {
  static getData(eventGroupId) {
    return (dispatch) => {
      dispatch(EventGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let eventGroup;
      let sport;
      let eventIds = [];
      FakeApi.getObjects([eventGroupId]).then((retrievedObjects) => {
        // Store the resolved event group object in the outer scope variable
        eventGroup = retrievedObjects[0];

        return FakeApi.getObjects([eventGroup.sport_id]);
      }).then((result) => {
        // Store the resolve sport object in the outer scope variable
        sport = result[0];

        return FakeApi.getEvents(eventGroup.sport_id);
      }).then((result) => {
        let events = [];
        // Combine the resulting events
        _.forEach(result, (retrievedEvents) => {
          events = events.concat(retrievedEvents);
        });
        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));

        // Store the final event ids in the outer scope variable
        eventIds = _.map(events, 'id');

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

        // Stored all retrieve data in the EventGroupPage state in Redux store
        dispatch(EventGroupPagePrivateActions.setDataAction(
          sport.name,
          eventGroup.name,
          eventIds,
          binnedOrderBooks
        ));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(EventGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      });
    }
  }
}

export default EventGroupPageActions;
