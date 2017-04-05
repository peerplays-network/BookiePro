import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';
import Immutable from 'immutable';

/**
 * Private actions
 */
class EventPrivateActions {
  static setGetEventsBySportIdsLoadingStatusAction(sportIds, loadingStatus) {
    return {
      type: ActionTypes.EVENT_SET_GET_EVENTS_BY_SPORT_IDS_LOADING_STATUS,
      sportIds,
      loadingStatus
    }
  }

  static setGetEventsByIdsLoadingStatusAction(eventIds, loadingStatus) {
    return {
      type: ActionTypes.EVENT_SET_GET_EVENTS_BY_IDS_LOADING_STATUS,
      eventIds,
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

  static getEventsBySportIds(sportIds) {
    return (dispatch, getState) => {
      sportIds = Immutable.List().concat(sportIds);

      let retrievedEvents = Immutable.List();
      let sportIdsOfEventsToBeRetrieved = Immutable.List();

      // Get eventIdsBySportId
      const eventsById = getState().getIn(['event', 'eventsById']);
      let eventsBySportId = Immutable.Map();
      eventsById.forEach( (event, id) => {
        const sportId = event.get('sport_id');
        eventsBySportId = eventsBySportId.update(sportId, events => {
          if (!events) events = Immutable.List();
          return events.push(event);
        })
      })

      const getEventsBySportIdsLoadingStatus = getState().getIn(['event', 'getEventsBySportIdsLoadingStatus']);
      sportIds.forEach( sportId => {
        if (getEventsBySportIdsLoadingStatus.get(sportId) === LoadingStatus.DONE) {
          if (eventsBySportId.has(sportId)) {
            retrievedEvents = retrievedEvents.concat(eventsBySportId.get(sportId));
          }
        } else {
          sportIdsOfEventsToBeRetrieved = sportIdsOfEventsToBeRetrieved.push(sportId);
        }
      })

      if (sportIdsOfEventsToBeRetrieved.size === 0) {
        // No events to be retrieved
        return Promise.resolve(retrievedEvents);
      } else {
        dispatch(EventPrivateActions.setGetEventsBySportIdsLoadingStatusAction(sportIdsOfEventsToBeRetrieved, LoadingStatus.LOADING));

        // TODO: Replace with actual blockchain call
        return FakeApi.getEventsBySportIds(sportIdsOfEventsToBeRetrieved).then((events) => {
          dispatch(EventActions.addEventsAction(events));
          dispatch(EventPrivateActions.setGetEventsBySportIdsLoadingStatusAction(sportIdsOfEventsToBeRetrieved, LoadingStatus.DONE));
          return retrievedEvents.concat(events);
        });
      }
    };
  }

  static getEventsByIds(eventIds) {
    return (dispatch, getState) => {
      eventIds = Immutable.List().concat(eventIds);

      let retrievedEvents = Immutable.List();
      let idsOfEventsToBeRetrieved = Immutable.List();

      const getEventsByIdsLoadingStatus = getState().getIn(['event', 'getEventsByIdsLoadingStatus']);
      const eventsById = getState().getIn(['event', 'eventsById']);;
      eventIds.forEach( eventId => {
        if (getEventsByIdsLoadingStatus.get(eventId) === LoadingStatus.DONE) {
          if (eventsById.has(eventId)) {
            retrievedEvents = retrievedEvents.concat(eventsById.get(eventId));
          }
        } else {
          idsOfEventsToBeRetrieved = idsOfEventsToBeRetrieved.push(eventId);
        }
      })

      if (idsOfEventsToBeRetrieved.size === 0) {
        // No events to be retrieved
        return Promise.resolve(retrievedEvents);
      } else {
        dispatch(EventPrivateActions.setGetEventsByIdsLoadingStatusAction(idsOfEventsToBeRetrieved, LoadingStatus.LOADING));

        // TODO: Replace with actual blockchain call
        return FakeApi.getEventsByIds(idsOfEventsToBeRetrieved).then((events) => {
          dispatch(EventActions.addEventsAction(events));
          dispatch(EventPrivateActions.setGetEventsByIdsLoadingStatusAction(idsOfEventsToBeRetrieved, LoadingStatus.DONE));
          return retrievedEvents.concat(events);
        });
      }
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
