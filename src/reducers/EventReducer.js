import { ActionTypes, LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  eventsById: {},
  getEventsBySportIdsLoadingStatus: {},
  getEventsByEventGroupIdsLoadingStatus: {},
  getEventsByIdsLoadingStatus: {},

  getSearchEventsLoadingStatus: LoadingStatus.DEFAULT,
  searchResult: [],
  searchEventsError: null
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.EVENT_SET_GET_EVENTS_BY_SPORT_IDS_LOADING_STATUS: {
      let getEventsBySportIdsLoadingStatus = Immutable.Map();
      action.sportIds.forEach( sportId => {
        getEventsBySportIdsLoadingStatus = getEventsBySportIdsLoadingStatus.set(sportId, action.loadingStatus);
      })
      return state.mergeIn(['getEventsBySportIdsLoadingStatus'], getEventsBySportIdsLoadingStatus);
    }
    case ActionTypes.EVENT_SET_GET_EVENTS_BY_EVENT_GROUP_IDS_LOADING_STATUS: {
      let getEventsByEventGroupIdsLoadingStatus = Immutable.Map();
      action.eventGroupIds.forEach( eventGroupId => {
        getEventsByEventGroupIdsLoadingStatus = getEventsByEventGroupIdsLoadingStatus.set(eventGroupId, action.loadingStatus);
      })
      return state.mergeIn(['getEventsByEventGroupIdsLoadingStatus'], getEventsByEventGroupIdsLoadingStatus);
    }
    case ActionTypes.EVENT_SET_GET_EVENTS_BY_IDS_LOADING_STATUS: {
      let getEventsByIdsLoadingStatus = Immutable.Map();
      action.eventIds.forEach( eventId => {
        getEventsByIdsLoadingStatus = getEventsByIdsLoadingStatus.set(eventId, action.loadingStatus);
      })
      return state.mergeIn(['getEventsByIdsLoadingStatus'], getEventsByIdsLoadingStatus);
    }

    case ActionTypes.EVENT_SET_SEARCH_EVENTS_LOADING_STATUS: {
      return state.merge({
        getSearchEventsLoadingStatus: action.loadingStatus
      });
    }

    case ActionTypes.EVENT_ADD_OR_UPDATE_EVENTS: {
      let nextState = state;
      action.events.forEach( event => {
        const eventId = event.get('id');
        // Update event ids by ids
        nextState = nextState.setIn(['eventsById', eventId], event);
      })
      return nextState;
    }
    case ActionTypes.EVENT_REMOVE_EVENTS_BY_IDS: {
      let nextState = state;
      action.eventIds.forEach((eventId) => {
        // Remove from eventsById
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
      })
    }
    default:
      return state;
  }
}
