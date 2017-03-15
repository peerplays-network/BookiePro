import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  getEventGroupsLoadingStatus: LoadingStatus.DEFAULT,
  eventGroups: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_LOADING_STATUS: {
      return Object.assign({}, state, {
        getEventGroupsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.EVENT_GROUP_ADD_EVENT_GROUPS: {
      return Object.assign({}, state, {
        eventGroups: _.unionBy(action.eventGroups, state.eventGroups, 'id')
      });
    }
    default:
      return state;
  }
}
