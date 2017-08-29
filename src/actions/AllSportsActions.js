import { LoadingStatus, ActionTypes } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import BinnedOrderBookActions from './BinnedOrderBookActions';
import AppActions from './AppActions';
import _ from 'lodash';
import log from 'loglevel';

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

  static setErrorAction(error) {
    return {
      type: ActionTypes.ALL_SPORTS_SET_ERROR,
      error
    }
  }
}

/**
 * Public actions
 */
class AllSportsActions {
  static getData() {
    return (dispatch, getState) => {
      // If all sports have ever been fetched, no need to fetch it again
      const allSportsLoadingStatus = getState().getIn(['allSports', 'loadingStatus']);
      if (allSportsLoadingStatus === LoadingStatus.DONE) {
        return;
      }

      dispatch(AllSportsPrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let retrievedSportIds;
      // Get sports
      dispatch(SportActions.getAllSports()).then((sports) => {
        retrievedSportIds = sports.map( sport => sport.get('id'));
        // Get events related to the sports
        return dispatch(EventActions.getEventsBySportIds(retrievedSportIds));
      }).then((events) => {
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
        // Get global betting statistic
        return dispatch(AppActions.getGlobalBettingStatistics());
      }).then(() => {
        // Set loading status
        dispatch(AllSportsPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
        log.debug('All Sports get data succeed.');
      }).catch((error) => {
        log.error('All Sports get data error', error);
        dispatch(AllSportsPrivateActions.setErrorAction(error));
      });

    };
  }
}

export default AllSportsActions;
