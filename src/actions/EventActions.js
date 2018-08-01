import { CommunicationService } from '../services';
import { LoadingStatus, ActionTypes } from '../constants';
import { ObjectUtils } from '../utility';
import Immutable from 'immutable';
import log from 'loglevel';

/**
 * Private actions
 */
class EventPrivateActions {

  static setGetEventsByEventGroupIdsLoadingStatusAction(eventGroupIds, loadingStatus) {
    return {
      type: ActionTypes.EVENT_SET_GET_EVENTS_BY_EVENT_GROUP_IDS_LOADING_STATUS,
      eventGroupIds,
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

  static addPersistedEventsAction(events) {
    return {
      type: ActionTypes.EVENT_ADD_PERSISTED_EVENTS,
      events
    }
  }

  static removeEventsByIdsAction(eventIds) {
    return {
      type: ActionTypes.EVENT_REMOVE_EVENTS_BY_IDS,
      eventIds
    }
  }

  static resetEventStore() {
    return {
      type: ActionTypes.EVENT_RESET_STORE
    }
  }


  /**
   * Get events given array of event group ids (can be immutable)
   */
  static getEventsByEventGroupIds(eventGroupIds) {
    return (dispatch, getState) => {
      let retrievedEvents = Immutable.List();
      let eventGroupIdsOfEventsToBeRetrieved = Immutable.List();

      // Get eventsByEventGroupId
      const eventsById = getState().getIn(['event', 'eventsById']);
      let eventsByEventGroupId = Immutable.Map();
      eventsById.forEach( (event, id) => {
        const eventGroupId = event.get('event_group_id');
        if (eventGroupId) {
          eventsByEventGroupId = eventsByEventGroupId.update(eventGroupId, events => {
            if (!events) events = Immutable.List();
            return events.push(event);
          })
        }
      })

      // Check if the requested data is already inside redux store
      const getEventsByEventGroupIdsLoadingStatus = getState().getIn(['event', 'getEventsByEventGroupIdsLoadingStatus']);
      eventGroupIds.forEach( eventGroupId => {
        if (getEventsByEventGroupIdsLoadingStatus.get(eventGroupId) === LoadingStatus.DONE) {
          if (eventsByEventGroupId.has(eventGroupId)) {
            retrievedEvents = retrievedEvents.concat(eventsByEventGroupId.get(eventGroupId));
          }
        } else {
          eventGroupIdsOfEventsToBeRetrieved = eventGroupIdsOfEventsToBeRetrieved.push(eventGroupId);
        }
      })

      if (eventGroupIdsOfEventsToBeRetrieved.size === 0) {
        // No events to be retrieved from blockchain, return retrieved data from redux store
        return Promise.resolve(retrievedEvents);
      } else {
        // Retrieve data from blockchain
        // Set status
        dispatch(EventPrivateActions.setGetEventsByEventGroupIdsLoadingStatusAction(eventGroupIdsOfEventsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getEventsByEventGroupIds(eventGroupIdsOfEventsToBeRetrieved).then((events) => {
          // Add data to redux store
          dispatch(EventActions.addOrUpdateEventsAction(events));
          // Set status
          dispatch(EventPrivateActions.setGetEventsByEventGroupIdsLoadingStatusAction(eventGroupIdsOfEventsToBeRetrieved, LoadingStatus.DONE));
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
      let eventsById = getState().getIn(['event', 'eventsById']);
      const persistedEventsById = getState().getIn(['event', 'persistedEventsById']);
      eventsById = eventsById.concat(persistedEventsById);
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
        return CommunicationService.getEventsByIds(idsOfEventsToBeRetrieved).then((events) => {
          retrievedEvents = retrievedEvents.concat(events);

          // Check if we have retrieved all events
          if (idsOfEventsToBeRetrieved.size === events.size) {
            // All fetched
            // Add to redux store
            dispatch(EventActions.addOrUpdateEventsAction(events));
            // Set status
            dispatch(EventPrivateActions.setGetEventsByIdsLoadingStatusAction(idsOfEventsToBeRetrieved, LoadingStatus.DONE));
            // Return result
            return retrievedEvents;
          } else {
            // Some of them are not fetched, use persistent api to fetch it
            const retrievedEventIds = events.map(event => event.get('id'));
            const filteredIdsOfEventsToBeRetrieved = idsOfEventsToBeRetrieved.filterNot(id => retrievedEventIds.includes(id));
            return CommunicationService.getPersistedEventsByIds(filteredIdsOfEventsToBeRetrieved).then((persistedEvents) => {
              retrievedEvents = retrievedEvents.concat(persistedEvents);
              // Add to redux store
              dispatch(EventActions.addOrUpdateEventsAction(events));
              dispatch(EventActions.addPersistedEventsAction(persistedEvents));
              // All fetched, set status
              dispatch(EventPrivateActions.setGetEventsByIdsLoadingStatusAction(idsOfEventsToBeRetrieved, LoadingStatus.DONE));
              // Return result
              return retrievedEvents;
            });
          }

        });
      }
    };
  }

  /**
   * Search events given keyword
   */
  static searchEvents(keyword) {
    return (dispatch,getState) => {

      // Set status
      dispatch(EventPrivateActions.setSearchEventsLoadingStatusAction(LoadingStatus.LOADING));

      /**
        Get upcoming events from store [the same events that are passed to SimpleBettingWidget
          while filtering events].
        Search will be performed on these events
      **/
      const eventsById = getState().getIn(['event', 'eventsById']);
      let myEvents = eventsById.toArray().filter((event) => {
        return ObjectUtils.isActiveEvent(event);
      });
      let eventList = Immutable.List(myEvents);

      const filteredResult = eventList.toArray().filter((item) => {
        const teamNameArray = item.get('name').split(' vs ') || item.get('name').split('/') || [];
        const team1Name = teamNameArray[0];
        const team2Name = teamNameArray[1];
        const keywordLowerCase = keyword.toLowerCase();

        return ( ( !(team1Name === undefined) && team1Name.toLowerCase().indexOf(keywordLowerCase) >= 0  ) ||
          ( !(team2Name === undefined) && team2Name.toLowerCase().indexOf(keywordLowerCase) >= 0 ) )
      });

      // Set data to redux store
      dispatch(EventPrivateActions.setSearchResultAction(filteredResult));
      // Set status
      dispatch(EventPrivateActions.setSearchEventsLoadingStatusAction(LoadingStatus.DONE));

      log.debug('Search events succeed.');
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
