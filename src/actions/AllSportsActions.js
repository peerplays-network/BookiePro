import { LoadingStatus, ActionTypes } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import CompetitorActions from './CompetitorActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import BinnedOrderBookActions from './BinnedOrderBookActions';
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
    return (dispatch) => {
      dispatch(AllSportsPrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let retrievedSportIds;

      // Get sports
      dispatch(SportActions.getAllSports()).then((sports) => {
        retrievedSportIds = sports.map( sport => sport.get('id'));
        // Get competitiors related to the sports
        return dispatch(CompetitorActions.getCompetitorsBySportIds(retrievedSportIds));
      }).then((competitors) => {
        // Get events related to the sports
        return dispatch(EventActions.getActiveEventsBySportIds(retrievedSportIds));
      }).then((events) => {
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
