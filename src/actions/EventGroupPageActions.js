import FakeApi from '../communication/FakeApi';
import { ActionTypes, LoadingStatus } from '../constants';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import _ from 'lodash';
import {
  getBettingMarketGroupsByEvents,
  getBettingMarketsInBettingMarketGroups,
  getBinnedOrderBooksByBettingMarkets,
  groupBinnedOrderBooksByBettingMarketId
} from './utilities'

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
      let events = [];
      FakeApi.getObjects([eventGroupId]).then((retrievedObjects) => {
        // Store the resolved event group object in the outer scope variable
        eventGroup = retrievedObjects[0];

        return FakeApi.getObjects([eventGroup.sport_id]);
      }).then((result) => {
        // Store the resolve sport object in the outer scope variable
        sport = result[0];

        return FakeApi.getEvents(eventGroup.sport_id);
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
        const binnedOrderBooks = groupBinnedOrderBooksByBettingMarketId(_.flatMap(result));

        // Stored all retrieve data in the EventGroupPage state in Redux store
        dispatch(EventGroupPagePrivateActions.setDataAction(
          sport.name,
          eventGroup.name,
          _.map(events, 'id'),    // list of event ids
          binnedOrderBooks
        ));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(EventGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      });
    }
  }
}

export default EventGroupPageActions;
