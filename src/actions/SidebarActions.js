import { ActionTypes, LoadingStatus } from '../constants';
import SportActions from './SportActions';
import CompetitorActions from './CompetitorActions';
import EventGroupActions from './EventGroupActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import _ from 'lodash';
import log from 'loglevel';

class SidebarActions{

  static getData() {
    return (dispatch) => {

      // Loading status
      dispatch(SidebarActions.setLoadingStatusAction(LoadingStatus.LOADING));
      let retrievedSportIds;
      // Get sports
      dispatch(SportActions.getAllSports()).then((sports) => {
        retrievedSportIds = sports.map( sport => sport.get('id'));
        const eventGroupIds = sports.flatMap( sport => sport.get('event_group_ids'));
        // Get event groups related to the sports
        return dispatch(EventGroupActions.getEventGroupsByIds(eventGroupIds));
      }).then((eventGroups) => {
        // Get competitiors related to the sports
        return dispatch(CompetitorActions.getCompetitorsBySportIds(retrievedSportIds));
      }).then((competitors) => {
        // Get events related to the sports (because we don't have get event based on event groups)
        return dispatch(EventActions.getActiveEventsBySportIds(retrievedSportIds));
      }).then((events) => {
        // Get betting market groups
        const bettingMarketGroupIds = events.flatMap( event => event.get('betting_market_group_ids'));
        return dispatch(BettingMarketGroupActions.getBettingMarketGroupsByIds(bettingMarketGroupIds));
      }).then((bettingMarketGroups) => {
        // Loading status
        dispatch(SidebarActions.setLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Sidebar get data error', error);
        // Loading status
        dispatch(SidebarActions.setErrorAction(error));
      })

    };
  }

  static setErrorAction(error) {
    return {
      type: ActionTypes.SIDEBAR_SET_ERROR,
      error
    }
  }

  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.SIDEBAR_SET_LOADING_STATUS,
      loadingStatus
    }
  }

}

export default SidebarActions;
