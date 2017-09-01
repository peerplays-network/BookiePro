import { ActionTypes, LoadingStatus } from '../constants';
import SportActions from './SportActions';
import EventGroupActions from './EventGroupActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import _ from 'lodash';
import log from 'loglevel';

class SidebarActions {

  static getData() {
    return (dispatch) => {

      // Loading status
      dispatch(SidebarActions.setLoadingStatusAction(LoadingStatus.LOADING));
      // Get sports
      dispatch(SportActions.getAllSports()).then((sports) => {
        const sportIds = sports.map( sport => sport.get('id'));
        // Get event groups related to the sports
        return dispatch(EventGroupActions.getEventGroupsBySportIds(sportIds));
      }).then((eventGroups) => {
        const eventGroupIds = eventGroups.map( eventGroup => eventGroup.get('id'));
        // Get events related to the sports (because we don't have get event based on event groups)
        return dispatch(EventActions.getEventsByEventGroupIds(eventGroupIds));
      }).then((events) => {
        // Get betting market groups
        const eventIds = events.map( event => event.get('id'));
        return dispatch(BettingMarketGroupActions.getBettingMarketGroupsByEventIds(eventIds));
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
