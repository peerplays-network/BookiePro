import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getEventGroupsByIdsLoadingStatus: {},
  getEventGroupsBySportIdsLoadingStatus: {},
  eventGroupsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_BY_IDS_LOADING_STATUS: {
      let getEventGroupsByIdsLoadingStatus = Immutable.Map();
      action.eventGroupIds.forEach( (eventGroupId) => {
        getEventGroupsByIdsLoadingStatus = getEventGroupsByIdsLoadingStatus.set(eventGroupId, action.loadingStatus);
      })
      return state.mergeIn(['getEventGroupsByIdsLoadingStatus'], getEventGroupsByIdsLoadingStatus);
    }
    case ActionTypes.EVENT_GROUP_ADD_OR_UPDATE_EVENT_GROUPS: {
      let eventGroupsById = Immutable.Map();
      action.eventGroups.forEach( (eventGroup) => {
        eventGroupsById = eventGroupsById.set(eventGroup.get('id'), eventGroup);
      });
      return state.mergeIn(['eventGroupsById'], eventGroupsById );
    }
    case ActionTypes.EVENT_GROUP_REMOVE_EVENT_GROUPS_BY_IDS: {
      let nextState = state;
      action.eventGroupIds.forEach((eventGroupId) => {
        nextState = nextState.deleteIn(['eventGroupsById', eventGroupId]);
        nextState = nextState.deleteIn(['getEventGroupsByIdsLoadingStatus', eventGroupId]);
      })
      return nextState;
    }
    case ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_BY_SPORT_IDS_LOADING_STATUS: {
      let getEventGroupsBySportIdsLoadingStatus = Immutable.Map();
      action.sportIds.forEach( sportId => {
        getEventGroupsBySportIdsLoadingStatus = getEventGroupsBySportIdsLoadingStatus.set(sportId, action.loadingStatus);
      })
      return state.mergeIn(['getEventGroupsBySportIdsLoadingStatus'], getEventGroupsBySportIdsLoadingStatus);
    }
    case ActionTypes.EVENT_GROUP_RESET_STORE: {
      return initialState;
    }
    default:
      return state;
  }
}
