import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';
import Immutable from 'immutable';

/**
 * Private actions
 */
class EventGroupPrivateActions {
  static setGetEventGroupsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_LOADING_STATUS,
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
  static addEventGroupsAction(eventGroups) {
    return {
      type: ActionTypes.EVENT_GROUP_ADD_EVENT_GROUPS,
      eventGroups
    }
  }

  static getEventGroups(sportId) {
    return (dispatch) => {
      dispatch(EventGroupPrivateActions.setGetEventGroupsLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getEventGroups(sportId).then((eventGroups) => {
        dispatch(EventGroupActions.addEventGroupsAction(eventGroups));
        dispatch(EventGroupPrivateActions.setGetEventGroupsLoadingStatus(LoadingStatus.DONE));
      });

    };
  }

  static getEventGroupsBySportIds(sportIds) {
    return (dispatch, getState) => {
      sportIds = Immutable.List().concat(sportIds);

      let retrievedEventGroups = Immutable.List();
      let sportIdsOfEventGroupsToBeRetrieved = Immutable.List();

      // Get eventIdsBySportId
      const eventGroupsById = getState().getIn(['eventGroup', 'eventGroupsById']);
      let eventGroupsBySportId = Immutable.Map();
      eventGroupsById.forEach( (event, id) => {
        const sportId = event.get('sport_id');
        eventGroupsBySportId = eventGroupsBySportId.update(sportId, eventGroups => {
          if (!eventGroups) eventGroups = Immutable.List();
          return eventGroups.push(event);
        })
      })

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
        // No eventGroups to be retrieved
        return Promise.resolve(retrievedEventGroups);
      } else {
        dispatch(EventGroupPrivateActions.setGetEventGroupsBySportIdsLoadingStatusAction(sportIdsOfEventGroupsToBeRetrieved, LoadingStatus.LOADING));

        // TODO: Replace with actual blockchain call
        return FakeApi.getEventGroupsBySportIds(sportIdsOfEventGroupsToBeRetrieved).then((eventGroups) => {
          dispatch(EventGroupActions.addEventGroupsAction(eventGroups));
          dispatch(EventGroupPrivateActions.setGetEventGroupsBySportIdsLoadingStatusAction(sportIdsOfEventGroupsToBeRetrieved, LoadingStatus.DONE));
          const eventGroupIds = eventGroups.map( eventGroup => eventGroup.get('id'));
          dispatch(EventGroupPrivateActions.setGetEventGroupsByIdsLoadingStatusAction(eventGroupIds, LoadingStatus.DONE));
          return retrievedEventGroups.concat(eventGroups);
        });
      }


    };
  }

  static getEventGroupsByIds(eventGroupIds) {
    return (dispatch, getState) => {
      eventGroupIds = Immutable.List().concat(eventGroupIds);

      let retrievedEventGroups = Immutable.List();
      let idsOfEventGroupsToBeRetrieved = Immutable.List();

      const getEventGroupsByIdsLoadingStatus = getState().getIn(['eventGroup', 'getEventGroupsByIdsLoadingStatus']);
      const eventGroupsById = getState().getIn(['eventGroup', 'eventGroupsById']);;
      eventGroupIds.forEach( eventGroupId => {
        if (getEventGroupsByIdsLoadingStatus.get(eventGroupId) === LoadingStatus.DONE) {
          if (eventGroupsById.has(eventGroupId)) {
            retrievedEventGroups = retrievedEventGroups.concat(eventGroupsById.get(eventGroupId));
          }
        } else {
          idsOfEventGroupsToBeRetrieved = idsOfEventGroupsToBeRetrieved.push(eventGroupId);
        }
      })

      if (idsOfEventGroupsToBeRetrieved.size === 0) {
        // No eventGroups to be retrieved
        return Promise.resolve(retrievedEventGroups);
      } else {
        dispatch(EventGroupPrivateActions.setGetEventGroupsByIdsLoadingStatusAction(idsOfEventGroupsToBeRetrieved, LoadingStatus.LOADING));

        // TODO: Replace with actual blockchain call
        return FakeApi.getEventGroupsByIds(idsOfEventGroupsToBeRetrieved).then((eventGroups) => {
          dispatch(EventGroupActions.addEventGroupsAction(eventGroups));
          dispatch(EventGroupPrivateActions.setGetEventGroupsByIdsLoadingStatusAction(idsOfEventGroupsToBeRetrieved, LoadingStatus.DONE));
          return retrievedEventGroups.concat(eventGroups);
        });
      }
    };
  }
}

export default EventGroupActions;
