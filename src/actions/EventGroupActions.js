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
        return CommunicationService.getObjectsByIds(idsOfEventGroupsToBeRetrieved).then((eventGroups) => {
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
