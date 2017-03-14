import FakeApi from '../dummyData/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class EventGroupPrivateActions {
  // Generate set account action
  static setEventGroups(eventGroups) {
    return {
      type: ActionTypes.EVENT_GROUP_SET_EVENT_GROUPS,
      eventGroups
    }
  }

  static setLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_SET_LOADING_STATUS,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class EventGroupActions {
  // Generate set account action
  static getEventGroups(sportId) {
    return (dispatch) => {
      // Simulate getting sport
      dispatch(EventGroupPrivateActions.setLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getEventGroups(sportId).then((eventGroups) => {
        dispatch(EventGroupPrivateActions.setLoadingStatus(LoadingStatus.DONE));
        // Set sport list
        dispatch(EventGroupPrivateActions.setEventGroups(eventGroups));
      });

    };
  }
}

export default EventGroupActions;
