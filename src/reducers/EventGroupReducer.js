import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getEventGroupsLoadingStatus: LoadingStatus.DEFAULT,
  eventGroupsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.EVENT_GROUP_SET_GET_EVENT_GROUPS_LOADING_STATUS: {
      return state.merge({
        getEventGroupsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.EVENT_GROUP_ADD_EVENT_GROUPS: {
      const eventGroupsById = _.keyBy(action.eventGroups, eventGroup => eventGroup.get('id'));
      return state.merge({
        eventGroupsById
      });
    }
    default:
      return state;
  }
}
