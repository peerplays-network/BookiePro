import { ActionTypes, LoadingStatus } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import CompetitorActions from './CompetitorActions';
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
        const sport = sports.get(0);
        const eventGroupIds = sport.get('event_group_ids');
        // Get event group
        return dispatch(EventGroupActions.getEventGroupsByIds(eventGroupIds));
      }).then( (eventGroups) => {
        // Get competitiors related to the sports
        return dispatch(CompetitorActions.getCompetitorsBySportIds([sportId]));
      }).then((competitors) => {
        // Get events
        return dispatch(EventActions.getActiveEventsBySportIds([sportId]));
      }).then( (events) => {
        // Get betting market groups
        const bettingMarketGroupIds = events.flatMap( event => event.get('betting_market_group_ids'));
        return dispatch(BettingMarketGroupActions.getBettingMarketGroupsByIds(bettingMarketGroupIds));
      }).then((bettingMarketGroups) => {
        // Get betting markets
        const bettingMarketIds = bettingMarketGroups.flatMap( bettingMarketGroup => bettingMarketGroup.get('betting_market_ids'));
        return dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds));
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
