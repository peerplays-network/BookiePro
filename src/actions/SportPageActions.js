import { ActionTypes, LoadingStatus } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import CompetitorActions from './CompetitorActions';
import EventGroupActions from './EventGroupActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import _ from 'lodash';
import Immutable from 'immutable';
import BinnedOrderBookActions from './BinnedOrderBookActions';
import log from 'loglevel';
import {
  groupMoneyLineBinnedOrderBooks
} from './dataUtils';

/**
 * Private actions
 */
class SportPagePrivateActions {
  static setLoadingStatusAction(sportId, loadingStatus) {
    return {
      type: ActionTypes.SPORT_PAGE_SET_LOADING_STATUS,
      sportId,
      loadingStatus
    }
  }

  static setDataAction(eventIds, eventGroupIds, binnedOrderBooksByEvent) {
    return {
      type: ActionTypes.SPORT_PAGE_SET_DATA,
      eventIds,
      eventGroupIds,
      binnedOrderBooksByEvent
    }
  }

  static setErrorAction(sportId, error) {
    return {
      type: ActionTypes.SPORT_PAGE_SET_ERROR,
      sportId,
      error
    }
  }
}

/**
 * Public actions
 */
class SportPageActions {
  static getData(sportId) {
    return (dispatch) => {
      dispatch(SportPagePrivateActions.setLoadingStatusAction(sportId, LoadingStatus.LOADING));

      let retrievedEventGroups = Immutable.List();
      let retrievedEvents = Immutable.List();
      let retrievedBettingMarketGroups = Immutable.List();

      // Get sport detail
      dispatch(SportActions.getSportsByIds([sportId])).then( (sports) => {
        const sport = sports.get(0);
        const eventGroupIds = sport.get('event_group_ids');
        // Get event group
        return dispatch(EventGroupActions.getEventGroupsByIds(eventGroupIds));
      }).then( (eventGroups) => {
        retrievedEventGroups = eventGroups;
        // Get competitiors related to the sports
        return dispatch(CompetitorActions.getCompetitorsBySportIds([sportId]));
      }).then((competitors) => {
        // Get events
        return dispatch(EventActions.getEventsBySportIds([sportId]));
      }).then( (events) => {
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
            event.get('id'), groupMoneyLineBinnedOrderBooks(event, retrievedBettingMarketGroups, binnedOrderBooksByBettingMarketId)
          );
        });

        // Stored all retrieve data in the SportPage state in Redux store
        dispatch(SportPagePrivateActions.setDataAction(
          retrievedEvents.map((event) => event.get('id')),
          retrievedEventGroups.map((eventGroup) => eventGroup.get('id')),
          binnedOrderBooksByEvent
        ));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(SportPagePrivateActions.setLoadingStatusAction(sportId, LoadingStatus.DONE));
      }).catch((error) => {
        // Log and set error
        log.error('Sport page get data error', sportId, error);
        dispatch(SportPagePrivateActions.setErrorAction(sportId, error));
      });
    };
  }
}

export default SportPageActions;
