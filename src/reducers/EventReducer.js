import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  getEventsLoadingStatus: LoadingStatus.DEFAULT,
  events: [],
  searchResult: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.EVENT_SET_GET_EVENTS_LOADING_STATUS: {
      return Object.assign({}, state, {
        getEventsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.EVENT_ADD_EVENTS: {
      return Object.assign({}, state, {
        events: _.unionBy(action.events, state.events, 'id')
      });
    }
    case ActionTypes.EVENT_SET_SEARCH_RESULT: {
      return Object.assign({}, state, {
        searchResult: action.searchResult
      });
    }
    default:
      return state;
  }
}
