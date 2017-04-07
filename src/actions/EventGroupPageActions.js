import { ActionTypes, LoadingStatus } from '../constants';
import EventActions from './EventActions';
import SportActions from './SportActions';
import EventGroupActions from './EventGroupActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import BinnedOrderBookActions from './BinnedOrderBookActions';
import _ from 'lodash';
import Immutable from 'immutable';
import {
  getBinnedOrderBooksByBettingMarkets,
  groupBinnedOrderBooksByBettingMarketId,
  groupBinnedOrderBooksByEvent
} from './utilities'

class EventGroupPagePrivateActions {
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static setDataAction(sportName, eventGroupName, eventIds, binnedOrderBooksByEvent) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_DATA,
      sportName,
      eventGroupName,
      eventIds,
      binnedOrderBooksByEvent
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

      let retrievedEventGroup;
      let retrievedSport;
      let retrievedEvents = Immutable.List();
      let retrievedBettingMarketGroups = Immutable.List();

      // Get event group
      dispatch(EventGroupActions.getEventGroupsByIds([eventGroupId])).then( eventGroups => {
        retrievedEventGroup = eventGroups.get(0);
        const sportId = retrievedEventGroup.get('sport_id');
        // Get sport
        return dispatch(SportActions.getSportsByIds([sportId]));
      }).then((sports) => {
        retrievedSport = sports.get(0);
        const sportId = retrievedSport.get('id');
        // Get events
        return dispatch(EventActions.getEventsBySportIds([sportId]))
      }).then((events) => {
        retrievedEvents = events;
        // Get betting market groups
        const bettingMarketGroupIds = events.flatMap( event => event.get('betting_market_group_ids'));
        return dispatch(BettingMarketGroupActions.getBettingMarketGroupsByIds(bettingMarketGroupIds));
      }).then((bettingMarketGroups) => {
        retrievedBettingMarketGroups = bettingMarketGroups;
        // Get betting markets
        const bettingMarketIds = bettingMarketGroups.flatMap( bettingMarketGroup => bettingMarketGroup.get('betting_market_ids'));
        return dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds));
      }).then((bettingMarkets) => {
        // Get binned order books
        const bettingMarketIds = bettingMarkets.map( bettingMarket => bettingMarket.get('id'));
        return dispatch(BinnedOrderBookActions.getBinnedOrderBooksByBettingMarketIds(bettingMarketIds));
      }).then((binnedOrderBooksByBettingMarketId) => {
        // Sort binned order book by event
        let binnedOrderBooksByEvent = Immutable.Map();
        retrievedEvents.forEach((event) => {
          binnedOrderBooksByEvent = binnedOrderBooksByEvent.set(
            event.get('id'), groupBinnedOrderBooksByEvent(event, retrievedBettingMarketGroups, binnedOrderBooksByBettingMarketId)
          );
        });

        // Stored all retrieve data in the EventGroupPage state in Redux store
        dispatch(EventGroupPagePrivateActions.setDataAction(
          retrievedSport.get('name'),
          retrievedEventGroup.get('name'),
          retrievedEvents.map((event) => event.get('id')),    // list of event ids
          binnedOrderBooksByEvent
        ));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(EventGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      });
    }
  }
}

export default EventGroupPageActions;
