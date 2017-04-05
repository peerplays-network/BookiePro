import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  eventsById: {},
  getEventsBySportIdsLoadingStatus: {},
  getEventsByIdsLoadingStatus: {},
  searchResult: []
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.EVENT_SET_GET_EVENTS_LOADING_STATUS: {
      return state.merge({
        getEventsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.EVENT_SET_GET_EVENTS_BY_SPORT_IDS_LOADING_STATUS: {
      let getEventsBySportIdsLoadingStatus = Immutable.Map();
      action.sportIds.forEach( sportId => {
        getEventsBySportIdsLoadingStatus = getEventsBySportIdsLoadingStatus.set(sportId, action.loadingStatus);
      })
      return state.mergeIn(['getEventsBySportIdsLoadingStatus'], getEventsBySportIdsLoadingStatus);
    }
    case ActionTypes.EVENT_SET_GET_EVENTS_BY_IDS_LOADING_STATUS: {
      let getEventsByIdsLoadingStatus = Immutable.Map();
      action.eventIds.forEach( eventId => {
        getEventsByIdsLoadingStatus = getEventsByIdsLoadingStatus.set(eventId, action.loadingStatus);
      })
      return state.mergeIn(['getEventsByIdsLoadingStatus'], getEventsByIdsLoadingStatus);
    }
    case ActionTypes.EVENT_ADD_EVENTS: {
      let eventsById = state.get('eventsById');
      action.events.forEach( event => {
        const eventId = event.get('id');
        // Set events by id
        eventsById = eventsById.set(eventId, event);
      });

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
