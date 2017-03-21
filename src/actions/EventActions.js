import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class EventPrivateActions {
  static setGetEventsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.EVENT_SET_GET_EVENTS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setSearchEventsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.EVENT_SET_SEARCH_EVENTS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setSearchResultAction(searchResult) {
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
  static addEventsAction(events) {
    return {
      type: ActionTypes.EVENT_ADD_EVENTS,
      events
    }
  }

  static getEvents(sportId) {
    return (dispatch) => {
      dispatch(EventPrivateActions.setGetEventsLoadingStatusAction(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getEvents(sportId).then((events) => {
        dispatch(EventActions.addEventsAction(events));
        dispatch(EventPrivateActions.setGetEventsLoadingStatusAction(LoadingStatus.DONE));
      });

    };
  }

  static searchEvents(keyword) {
    return (dispatch) => {
      dispatch(EventPrivateActions.setSearchEventsLoadingStatusAction(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.searchEvents(keyword).then((result) => {
        dispatch(EventPrivateActions.setSearchResultAction(result));
        dispatch(EventPrivateActions.setSearchEventsLoadingStatusAction(LoadingStatus.DONE));
      });
    }
  }

  static clearSearchResult() {
    return (dispatch) => {
      dispatch(EventPrivateActions.setSearchResultAction([]));
    }
  }
}

export default EventActions;
