import {ActionTypes, LoadingStatus} from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  eventsById: {},
  persistedEventsById: {},
  getEventsByEventGroupIdsLoadingStatus: {},
  getEventsByIdsLoadingStatus: {},
  getSearchEventsLoadingStatus: LoadingStatus.DEFAULT,
  searchResult: [],
  searchEventsError: null
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.EVENT_SET_GET_EVENTS_BY_EVENT_GROUP_IDS_LOADING_STATUS: {
      let getEventsByEventGroupIdsLoadingStatus = Immutable.Map();
      action.eventGroupIds.forEach((eventGroupId) => {
        getEventsByEventGroupIdsLoadingStatus = getEventsByEventGroupIdsLoadingStatus.set(
          eventGroupId,
          action.loadingStatus
        );
      });
      return state.mergeIn(
        ['getEventsByEventGroupIdsLoadingStatus'],
        getEventsByEventGroupIdsLoadingStatus
      );
    }

    case ActionTypes.EVENT_SET_GET_EVENTS_BY_IDS_LOADING_STATUS: {
      let getEventsByIdsLoadingStatus = Immutable.Map();
      action.eventIds.forEach((eventId) => {
        getEventsByIdsLoadingStatus = getEventsByIdsLoadingStatus.set(
          eventId,
          action.loadingStatus
        );
      });
      return state.mergeIn(['getEventsByIdsLoadingStatus'], getEventsByIdsLoadingStatus);
    }

    case ActionTypes.EVENT_SET_SEARCH_EVENTS_LOADING_STATUS: {
      return state.merge({
        getSearchEventsLoadingStatus: action.loadingStatus
      });
    }

    case ActionTypes.EVENT_ADD_OR_UPDATE_EVENTS: {
      let nextState = state;
      action.events.forEach((event) => {
        const eventId = event.get('id');
        // Update event ids by ids
        nextState = nextState.setIn(['eventsById', eventId], event);
      });
      return nextState;
    }

    case ActionTypes.EVENT_ADD_PERSISTED_EVENTS: {
      let nextState = state;
      action.events.forEach((event) => {
        const eventId = event.get('id');
        // Update event ids by ids
        nextState = nextState.setIn(['persistedEventsById', eventId], event);
      });
      return nextState;
    }

    case ActionTypes.EVENT_REMOVE_EVENTS_BY_IDS: {
      let nextState = state;
      action.eventIds.forEach((eventId) => {
        // Since we want to have persistent event list
        // Move event from eventsById to persistedEventsById
        nextState = nextState.setIn(
          ['persistedEventsById', eventId],
          state.getIn(['eventsById', eventId])
        );
        nextState = nextState.deleteIn(['eventsById', eventId]);
      });
      return nextState;
    }

    case ActionTypes.EVENT_SET_SEARCH_RESULT: {
      return state.merge({
        searchResult: action.searchResult
      });
    }

    case ActionTypes.EVENT_SET_SEARCH_EVENTS_ERROR: {
      return state.merge({
        searchEventsError: action.error
      });
    }
    
    case ActionTypes.EVENT_RESET_STORE: {
      return initialState;
    }

    default:
      return state;
  }
}
