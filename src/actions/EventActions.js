import { CommunicationService } from '../services';
import { LoadingStatus, ActionTypes } from '../constants';
import Immutable from 'immutable';
import log from 'loglevel';

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

  static setSearchEventsErrorAction(error) {
    return {
      type: ActionTypes.EVENT_SET_SEARCH_EVENTS_ERROR,
      error
    }
  }
}

/**
 * Public actions
 */
class EventActions {
  static addOrUpdateEventsAction(events) {
    return {
      type: ActionTypes.EVENT_ADD_OR_UPDATE_EVENTS,
      events
    }
  }

  static removeEventsByIdsAction(eventIds) {
    return {
      type: ActionTypes.EVENT_REMOVE_EVENTS_BY_IDS,
      eventIds
    }
  }

  /**
   * Get events given array of sport ids (can be immutable)
   */
  static getEventsBySportIds(sportIds) {
    return (dispatch, getState) => {
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

      // Check if the requested data is already inside redux store
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
        // No events to be retrieved from blockchain, return retrieved data from redux store
        return Promise.resolve(retrievedEvents);
      } else {
        // Retrieve data from blockchain
        // Set status
        dispatch(EventPrivateActions.setGetEventsBySportIdsLoadingStatusAction(sportIdsOfEventsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getEventsBySportIds(sportIdsOfEventsToBeRetrieved).then((events) => {
          // Add data to redux store
          dispatch(EventActions.addOrUpdateEventsAction(events));
          // Set status
          dispatch(EventPrivateActions.setGetEventsBySportIdsLoadingStatusAction(sportIdsOfEventsToBeRetrieved, LoadingStatus.DONE));
          const eventIds = events.map( event => event.get('id'));
          dispatch(EventPrivateActions.setGetEventsByIdsLoadingStatusAction(eventIds, LoadingStatus.DONE));
          // Concat with retrieved data from redux store
          return retrievedEvents.concat(events);
        });
      }
    };
  }

  /**
   * Get events given array of ids (can be immutable)
   */
  static getEventsByIds(eventIds) {
    return (dispatch, getState) => {
      let retrievedEvents = Immutable.List();
      let idsOfEventsToBeRetrieved = Immutable.List();

      // Check if the requested data is already inside redux store
      const eventsById = getState().getIn(['event', 'eventsById']);;
      const getEventsByIdsLoadingStatus = getState().getIn(['event', 'getEventsByIdsLoadingStatus']);
      eventIds.forEach( eventId => {
        if (getEventsByIdsLoadingStatus.get(eventId) === LoadingStatus.DONE) {
          if (eventsById.has(eventId)) {
            retrievedEvents = retrievedEvents.push(eventsById.get(eventId));
          }
        } else {
          idsOfEventsToBeRetrieved = idsOfEventsToBeRetrieved.push(eventId);
        }
      })

      if (idsOfEventsToBeRetrieved.size === 0) {
        // No events to be retrieved, return data from redux store
        return Promise.resolve(retrievedEvents);
      } else {
        // Retrieve from blockchain
        // Set status
        dispatch(EventPrivateActions.setGetEventsByIdsLoadingStatusAction(idsOfEventsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getObjectsByIds(idsOfEventsToBeRetrieved).then((events) => {
          // Add to redux store
          dispatch(EventActions.addOrUpdateEventsAction(events));
          // Set status
          dispatch(EventPrivateActions.setGetEventsByIdsLoadingStatusAction(idsOfEventsToBeRetrieved, LoadingStatus.DONE));
          // Concat with retrieved data from redux store
          return retrievedEvents.concat(events);
        });
      }
    };
  }

  /**
   * Search events given keyword
   */
  static searchEvents(keyword) {
    return (dispatch) => {
      // Set status
      dispatch(EventPrivateActions.setSearchEventsLoadingStatusAction(LoadingStatus.LOADING));
      // Ask blockchain
      CommunicationService.searchEvents(keyword).then((result) => {
        // Set data to redux store
        dispatch(EventPrivateActions.setSearchResultAction(result));
        // Set status
        dispatch(EventPrivateActions.setSearchEventsLoadingStatusAction(LoadingStatus.DONE));
        log.debug('Search events succeed.');
      }).catch((error) => {
        log.error('Fail to search events', error);
        dispatch(EventPrivateActions.setSearchEventsErrorAction(error));
      });
    }
  }

  /**
   * Clear search result
   */
  static clearSearchResult() {
    return (dispatch) => {
      dispatch(EventPrivateActions.setSearchResultAction(Immutable.List()));
    }
  }
}

export default EventActions;
