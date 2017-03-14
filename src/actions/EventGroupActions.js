import FakeApi from '../dummyData/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class EventGroupPrivateActions {
  static addEventGroups(eventGroups) {
    return {
      type: ActionTypes.EVENT_GROUP_ADD_EVENT_GROUPS,
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
  static getEventGroups(sportId) {
    return (dispatch) => {
      dispatch(EventGroupPrivateActions.setLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getEventGroups(sportId).then((eventGroups) => {
        dispatch(EventGroupPrivateActions.setLoadingStatus(LoadingStatus.DONE));
        dispatch(EventGroupPrivateActions.addEventGroups(eventGroups));
      });

    };
  }
}

export default EventGroupActions;
