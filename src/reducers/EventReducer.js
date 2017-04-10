import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  eventsById: {},
  eventIdsBySportId: {},
  getEventsBySportIdsLoadingStatus: {},
  getEventsByIdsLoadingStatus: {},
  searchResult: []
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
    case ActionTypes.EVENT_SET_GET_EVENTS_BY_IDS_LOADING_STATUS: {
      let getEventsByIdsLoadingStatus = Immutable.Map();
      action.eventIds.forEach( eventId => {
        getEventsByIdsLoadingStatus = getEventsByIdsLoadingStatus.set(eventId, action.loadingStatus);
      })
      return state.mergeIn(['getEventsByIdsLoadingStatus'], getEventsByIdsLoadingStatus);
    }
    case ActionTypes.EVENT_ADD_OR_UPDATE_EVENTS: {
      let nextState = state;
      action.events.forEach( event => {
        const sportId = event.get('sport_id');
        const eventId = event.get('id');
        // Update event ids by ids
        nextState = nextState.setIn(['eventsById', eventId], event);
        // Update eventIds by sport id
        nextState = nextState.updateIn(['eventIdsBySportId', sportId], set => {
          if (!set) set = Immutable.Set();
          return set.add(eventId);
        })
      })
      return nextState;
    }
    case ActionTypes.EVENT_REMOVE_EVENTS_BY_IDS: {
      let nextState = state;
      action.eventIds.forEach((eventId) => {
        // Remove from eventIdsBySportId list
        const event = state.getIn(['eventsById', eventId]);
        const sportId = event && event.get('sport_id');
        if (sportId) {
          nextState = nextState.updateIn(['eventIdsBySportId', 'sportId'], set => {
            if (set) return set.delete(eventId);
          })
        }
        // Remove from eventsById
        nextState = nextState.deleteIn(['eventsById', eventId]);
      });
      return nextState;
    }
    case ActionTypes.EVENT_SET_SEARCH_RESULT: {
      return state.set('searchResult', action.searchResult);
    }
    default:
      return state;
  }
}
