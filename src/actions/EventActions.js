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

  static setGetEventsLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.EVENT_SET_GET_EVENTS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setSearchEventsLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.EVENT_SET_SEARCH_EVENTS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setSearchResult(searchResult) {
    return {
      type: ActionTypes.EVENT_SET_SEARCH_RESULT,
      searchResult
    }
  }
}

/**
 * Public actions
 */
class EventActions {
  static getEvents(sportId) {
    return (dispatch) => {
      dispatch(EventPrivateActions.setGetEventsLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getEvents(sportId).then((events) => {
        dispatch(EventPrivateActions.setGetEventsLoadingStatus(LoadingStatus.DONE));
        dispatch(EventPrivateActions.addEvents(events));
      });

    };
  }

  static searchEvents(keyword) {
    return (dispatch) => {
      dispatch(EventPrivateActions.setSearchEventsLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.searchEvents(keyword).then((result) => {
        dispatch(EventPrivateActions.setSearchEventsLoadingStatus(LoadingStatus.DONE));
        dispatch(EventPrivateActions.setSearchResult(result));
      });
    }
  }

  static clearSearchResult() {
    return (dispatch) => {
      dispatch(EventPrivateActions.setSearchResult([]));
    }
  }
}

export default EventActions;
