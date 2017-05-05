import { ActionTypes, LoadingStatus } from '../constants';
import EventActions from './EventActions';
import SportActions from './SportActions';
import EventGroupActions from './EventGroupActions';
import CompetitorActions from './CompetitorActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import BinnedOrderBookActions from './BinnedOrderBookActions';
import _ from 'lodash';
import Immutable from 'immutable';
import log from 'loglevel';
import {
  groupMoneyLineBinnedOrderBooks
} from './dataUtils';

class EventGroupPagePrivateActions {
  static setLoadingStatusAction(eventGroupId, loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_LOADING_STATUS,
      eventGroupId,
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

  static setErrorAction(eventGroupId, error) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_ERROR,
      eventGroupId,
      error
    }
  }

}

class EventGroupPageActions {
  static getData(eventGroupId) {
    return (dispatch) => {
      dispatch(EventGroupPagePrivateActions.setLoadingStatusAction(eventGroupId, LoadingStatus.LOADING));

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
        // Get events
        return dispatch(EventActions.getActiveEventsBySportIds([retrievedSport.get('id')]));
      }).then((events) => {
        retrievedEvents = events;
        // Get all competitors
        const competitorIds = events.flatMap(event => event.get('scores').map(score => score.get('competitor_id')));
        return dispatch(CompetitorActions.getCompetitorsByIds(competitorIds));
      }).then((competitors) => {
        // Get betting market groups
        const bettingMarketGroupIds = retrievedEvents.flatMap( event => event.get('betting_market_group_ids'));
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
            event.get('id'), groupMoneyLineBinnedOrderBooks(event, retrievedBettingMarketGroups, binnedOrderBooksByBettingMarketId)
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
        dispatch(EventGroupPagePrivateActions.setLoadingStatusAction(eventGroupId, LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Event sport page get data error', eventGroupId, error);
        dispatch(EventGroupPagePrivateActions.setErrorAction(eventGroupId, error));
      });
    }
  }
}

export default EventGroupPageActions;
