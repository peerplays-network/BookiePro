import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getEventGroupsLoadingStatus: LoadingStatus.DEFAULT,
  getEventGroupsBySportIdsLoadingStatus: {},
  getEventGroupsByIdsLoadingStatus: {},
  eventGroupsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_LOADING_STATUS: {
      return state.merge({
        getEventGroupsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_BY_SPORT_IDS_LOADING_STATUS: {
      let getEventGroupsBySportIdsLoadingStatus = Immutable.Map();
      action.sportIds.forEach( sportId => {
        getEventGroupsBySportIdsLoadingStatus = getEventGroupsBySportIdsLoadingStatus.set(sportId, action.loadingStatus);
      })
      return state.mergeIn(['getEventGroupsBySportIdsLoadingStatus'], getEventGroupsBySportIdsLoadingStatus);
    }
    case ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_BY_IDS_LOADING_STATUS: {
      let getEventGroupsByIdsLoadingStatus = Immutable.Map();
      action.eventGroupIds.forEach( eventGroupId => {
        getEventGroupsByIdsLoadingStatus = getEventGroupsByIdsLoadingStatus.set(eventGroupId, action.loadingStatus);
      })
      return state.mergeIn(['getEventGroupsByIdsLoadingStatus'], getEventGroupsByIdsLoadingStatus);
    }
    case ActionTypes.EVENT_GROUP_ADD_EVENT_GROUPS: {
      let eventGroupsById = state.get('eventGroupsById');
      action.eventGroups.forEach( eventGroup => {
        const eventGroupId = eventGroup.get('id');
        // Set events by id
        eventGroupsById = eventGroupsById.set(eventGroupId, eventGroup);
      });

      return state.merge({
        eventGroupsById
      });
    }
    default:
      return state;
  }
}
