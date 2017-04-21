import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import _ from 'lodash';

let initialState = Immutable.fromJS({
  sportName: '',
  eventGroupName: '',
  eventIds: [],
  binnedOrderBooksByEvent: {},
  errorByEventGroupId: {},
  loadingStatusByEventGroupId: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.EVENT_GROUP_PAGE_SET_DATA: {
      return state.merge({
        sportName: action.sportName,
        eventGroupName: action.eventGroupName,
        eventIds: action.eventIds,
        binnedOrderBooksByEvent: action.binnedOrderBooksByEvent
      })
    }
    case ActionTypes.EVENT_GROUP_PAGE_SET_LOADING_STATUS: {
      return state.setIn(['loadingStatusByEventGroupId', action.eventGroupId], action.loadingStatus);
    }
    case ActionTypes.EVENT_GROUP_PAGE_SET_ERROR: {
      let nextState = state;
      nextState = state.setIn(['loadingStatusByEventGroupId', action.eventGroupId], LoadingStatus.ERROR);
      nextState = state.setIn(['errorByEventGroupId', action.eventGroupId], action.error);
      return nextState;
    }

    default:
      return state;
  }
};
