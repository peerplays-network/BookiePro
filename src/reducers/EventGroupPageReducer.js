import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import _ from 'lodash';

let initialState = Immutable.fromJS({
  sportName: '',
  eventGroupName: '',
  eventIds: [],
  binnedOrderBooksByEvent: {},
  error: null,
  loadingStatus: LoadingStatus.DEFAULT
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
    case ActionTypes.EVENT_GROUP_SET_LOADING_STATUS: {
      return state.merge({
        loadingStatus: action.loadingStatus
      })
    }
    case ActionTypes.EVENT_GROUP_SET_ERROR: {
      return state.merge({
        error: action.error,
        loadingStatus: LoadingStatus.ERROR
      })
    }
    default:
      return state;
  }
};
