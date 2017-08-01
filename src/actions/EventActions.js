import { CommunicationService } from '../services';
import { LoadingStatus, ActionTypes } from '../constants';
import { ObjectUtils } from '../utility';
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
      const eventGroupsById = getState().getIn(['eventGroup', 'eventGroupsById']);
      let eventsBySportId = Immutable.Map();
      eventsById.forEach( (event, id) => {
        const eventGroupId = event.get('event_group_id');
        const eventGroup = eventGroupsById.get(eventGroupId);
        const sportId = eventGroup && eventGroup.get('sport_id');
        if (sportId) {
          eventsBySportId = eventsBySportId.update(sportId, events => {
            if (!events) events = Immutable.List();
            return events.push(event);
          })
        }
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
        return CommunicationService.getEventsByIds(idsOfEventsToBeRetrieved).then((events) => {
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
        const team1Name = item.get('name').split(' vs ')[0];
        const team2Name = item.get('name').split(' vs ')[1];
        const keywordLowerCase = keyword.toLowerCase();

        return ( team1Name.toLowerCase().indexOf(keywordLowerCase) >= 0 ||
          team2Name.toLowerCase().indexOf(keywordLowerCase) >= 0 )
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
