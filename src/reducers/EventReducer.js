import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getEventsLoadingStatus: LoadingStatus.DEFAULT,
  eventsById: {},
  searchResult: []
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.EVENT_SET_GET_EVENTS_LOADING_STATUS: {
      return state.merge({
        getEventsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.EVENT_ADD_EVENTS: {
      const eventsById = _.keyBy(action.events, event => event.get('id'));
      return state.merge({
        eventsById
      });
    }
    case ActionTypes.EVENT_SET_SEARCH_RESULT: {
      return state.set('searchResult', action.searchResult);
    }
    default:
      return state;
  }
}
