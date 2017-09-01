import { ActionTypes, LoadingStatus } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import EventGroupActions from './EventGroupActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import _ from 'lodash';
import BinnedOrderBookActions from './BinnedOrderBookActions';
import log from 'loglevel';

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
    return (dispatch, getState) => {
      // No need to fetch it if it's already fetched
      const sportPageLoadingStatus = getState().getIn(['sportPage', 'loadingStatusBySportId', sportId]);
      if (sportPageLoadingStatus === LoadingStatus.DONE) {
        return;
      }
      dispatch(SportPagePrivateActions.setLoadingStatusAction(sportId, LoadingStatus.LOADING));

      // Get sport detail
      dispatch(SportActions.getSportsByIds([sportId])).then( (sports) => {
        // Get event group
        return dispatch(EventGroupActions.getEventGroupsBySportIds([sportId]));
      }).then( (eventGroups) => {
        // Get events
        const eventGroupIds = eventGroups.map( eventGroup => eventGroup.get('id'));
        return dispatch(EventActions.getEventsByEventGroupIds(eventGroupIds));
      }).then( (events) => {
        // Get betting market groups
        const eventIds = events.map( event => event.get('id'));
        return dispatch(BettingMarketGroupActions.getBettingMarketGroupsByEventIds(eventIds));
      }).then((bettingMarketGroups) => {
        // Get betting markets
        const bettingMarketGroupIds = bettingMarketGroups.map( bettingMarketGroup => bettingMarketGroup.get('id'));
        return dispatch(BettingMarketActions.getBettingMarketsByBettingMarketGroupIds(bettingMarketGroupIds));
      }).then((bettingMarkets) => {
        // Get binned order books
        const bettingMarketIds = bettingMarkets.map( bettingMarket => bettingMarket.get('id'));
        return dispatch(BinnedOrderBookActions.getBinnedOrderBooksByBettingMarketIds(bettingMarketIds));
      }).then((binnedOrderBooksByBettingMarketId) => {
        // Set status
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
