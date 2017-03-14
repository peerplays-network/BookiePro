import FakeApi from '../dummyData/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class EventPrivateActions {
  static addEvents(events) {
    return {
      type: ActionTypes.EVENT_ADD_EVENTS,
      events
    }
  }

  static setLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.EVENT_SET_LOADING_STATUS,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class EventActions {
  static getEvents(sportId) {
    return (dispatch) => {
      dispatch(EventPrivateActions.setLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getEvents(sportId).then((events) => {
        dispatch(EventPrivateActions.setLoadingStatus(LoadingStatus.DONE));
        dispatch(EventPrivateActions.addEvents(events));
      });

    };
  }
}

export default EventActions;
