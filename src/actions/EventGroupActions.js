import { CommunicationService } from '../services';
import { LoadingStatus, ActionTypes } from '../constants';
import Immutable from 'immutable';

/**
 * Private actions
 */
class EventGroupPrivateActions {
  static setGetEventGroupsByIdsLoadingStatusAction(eventGroupIds, loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_BY_IDS_LOADING_STATUS,
      eventGroupIds,
      loadingStatus
    }
  }
  static setGetEventGroupsBySportIdsLoadingStatusAction(sportIds, loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_BY_SPORT_IDS_LOADING_STATUS,
      sportIds,
      loadingStatus
    }
  }

}

/**
 * Public actions
 */
class EventGroupActions {

  static addOrUpdateEventGroupsAction(eventGroups) {
    return {
      type: ActionTypes.EVENT_GROUP_ADD_OR_UPDATE_EVENT_GROUPS,
      eventGroups
    }
  }

  static removeEventGroupsByIdsAction(eventGroupIds) {
    return {
      type: ActionTypes.EVENT_GROUP_REMOVE_EVENT_GROUPS_BY_IDS,
      eventGroupIds
    }
  }

  static resetEventGroupStore() {
    return {
      type: ActionTypes.EVENT_GROUP_RESET_STORE
    }
  }


  /**
   * Get event groups given array of sport ids (can be immutable)
   */
  static getEventGroupsBySportIds(sportIds) {
    return (dispatch, getState) => {
      let retrievedEventGroups = Immutable.List();
      let sportIdsOfEventGroupsToBeRetrieved = Immutable.List();

      // Get eventIdsBySportId
      const eventGroupsById = getState().getIn(['eventGroup', 'eventGroupsById']);
      let eventGroupsBySportId = Immutable.Map();
      eventGroupsById.forEach( (eventGroup, id) => {
        const sportId = eventGroup.get('sport_id');
        eventGroupsBySportId = eventGroupsBySportId.update(sportId, eventGroups => {
          if (!eventGroups) eventGroups = Immutable.List();
          return eventGroups.push(eventGroup);
        })
      })

      // Check if the requested data is already inside redux store
      const getEventGroupsBySportIdsLoadingStatus = getState().getIn(['eventGroup', 'getEventGroupsBySportIdsLoadingStatus']);
      sportIds.forEach( sportId => {
        if (getEventGroupsBySportIdsLoadingStatus.get(sportId) === LoadingStatus.DONE) {
          if (eventGroupsBySportId.has(sportId)) {
            retrievedEventGroups = retrievedEventGroups.concat(eventGroupsBySportId.get(sportId));
          }
        } else {
          sportIdsOfEventGroupsToBeRetrieved = sportIdsOfEventGroupsToBeRetrieved.push(sportId);
        }
      })

      if (sportIdsOfEventGroupsToBeRetrieved.size === 0) {
        // No events to be retrieved from blockchain, return retrieved data from redux store
        return Promise.resolve(retrievedEventGroups);
      } else {
        // Retrieve data from blockchain
        // Set status
        dispatch(EventGroupPrivateActions.setGetEventGroupsBySportIdsLoadingStatusAction(sportIdsOfEventGroupsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getEventGroupsBySportIds(sportIdsOfEventGroupsToBeRetrieved).then((eventGroups) => {
          // Add data to redux store
          dispatch(EventGroupActions.addOrUpdateEventGroupsAction(eventGroups));
          // Set status
          dispatch(EventGroupPrivateActions.setGetEventGroupsBySportIdsLoadingStatusAction(sportIdsOfEventGroupsToBeRetrieved, LoadingStatus.DONE));
          const eventGroupIds = eventGroups.map( eventGroup => eventGroup.get('id'));
          dispatch(EventGroupPrivateActions.setGetEventGroupsByIdsLoadingStatusAction(eventGroupIds, LoadingStatus.DONE));
          // Concat with retrieved data from redux store
          return retrievedEventGroups.concat(eventGroups);
        });
      }
    };
  }

  /**
   * Get event groups given array of their ids (can be immutable)
   */
  static getEventGroupsByIds(eventGroupIds) {
    return (dispatch, getState) => {
      let retrievedEventGroups = Immutable.List();
      let idsOfEventGroupsToBeRetrieved = Immutable.List();

      // Check if the requested data is already inside redux store
      const eventGroupsById = getState().getIn(['eventGroup', 'eventGroupsById']);;
      const getEventGroupsByIdsLoadingStatus = getState().getIn(['eventGroup', 'getEventGroupsByIdsLoadingStatus']);
      eventGroupIds.forEach( eventGroupId => {
        if (getEventGroupsByIdsLoadingStatus.get(eventGroupId) === LoadingStatus.DONE) {
          if (eventGroupsById.has(eventGroupId)) {
            retrievedEventGroups = retrievedEventGroups.push(eventGroupsById.get(eventGroupId));
          }
        } else {
          idsOfEventGroupsToBeRetrieved = idsOfEventGroupsToBeRetrieved.push(eventGroupId);
        }
      })

      if (idsOfEventGroupsToBeRetrieved.size === 0) {
        // No Event Groups to be retrieved, return data from redux store
        return Promise.resolve(retrievedEventGroups);
      } else {
        // Set status
        dispatch(EventGroupPrivateActions.setGetEventGroupsByIdsLoadingStatusAction(idsOfEventGroupsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getEventGroupsByIds(idsOfEventGroupsToBeRetrieved).then((eventGroups) => {
          // Add to redux store
          dispatch(EventGroupActions.addOrUpdateEventGroupsAction(eventGroups));
          // Set status
          dispatch(EventGroupPrivateActions.setGetEventGroupsByIdsLoadingStatusAction(idsOfEventGroupsToBeRetrieved, LoadingStatus.DONE));
          // Concat with the retrieved data and return
          return retrievedEventGroups.concat(eventGroups);
        });
      }
    };
  }
}

export default EventGroupActions;
