import { LoadingStatus, ActionTypes } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import BinnedOrderBookActions from './BinnedOrderBookActions';
import _ from 'lodash';
import Immutable from 'immutable';
import {
  groupMoneyLineBinnedOrderBooks
} from './dataUtils';

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

      let retrievedEvents;
      let retrievedBettingMarketGroups;

      // Get sports
      dispatch(SportActions.getAllSports()).then((sports) => {
        const sportIds = sports.map( sport => sport.get('id'));
        // Get events related to the sports
        return dispatch(EventActions.getEventsBySportIds(sportIds));
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
            event.get('id'), groupMoneyLineBinnedOrderBooks(event, retrievedBettingMarketGroups, binnedOrderBooksByBettingMarketId)
          );
        });

        // Stored all retrieve data in the AllSports state in Redux store
        const eventIds = retrievedEvents.map((event) => event.get('id'));
        dispatch(AllSportsPrivateActions.setDataAction(eventIds, binnedOrderBooksByEvent));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(AllSportsPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      });

    };
  }
}

export default AllSportsActions;
