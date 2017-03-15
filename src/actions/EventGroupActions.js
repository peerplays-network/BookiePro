import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class EventGroupPrivateActions {
  static setGetEventGroupsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_LOADING_STATUS,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class EventGroupActions {
  static addEventGroupsAction(eventGroups) {
    return {
      type: ActionTypes.EVENT_GROUP_ADD_EVENT_GROUPS,
      eventGroups
    }
  }

  static getEventGroups(sportId) {
    return (dispatch) => {
      dispatch(EventGroupPrivateActions.setGetEventGroupsLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getEventGroups(sportId).then((eventGroups) => {
        dispatch(EventGroupPrivateActions.setGetEventGroupsLoadingStatus(LoadingStatus.DONE));
        dispatch(EventGroupActions.addEventGroupsAction(eventGroups));
      });

    };
  }
}

export default EventGroupActions;
