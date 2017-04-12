import { ActionTypes, LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  eventIds: [],
  loadingStatus: LoadingStatus.DEFAULT,
  error: null,
  binnedOrderBooksByEvent: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ALL_SPORTS_SET_DATA: {
      return state.merge({
        eventIds: action.eventIds,
        binnedOrderBooksByEvent: action.binnedOrderBooksByEvent
      });
    }
    case ActionTypes.ALL_SPORTS_SET_LOADING_STATUS: {
      return state.merge({
        loadingStatus: action.loadingStatus
      })
    }
    case ActionTypes.ALL_SPORTS_SET_ERROR: {
      return state.merge({
        error: action.error,
        loadingStatus: LoadingStatus.ERROR
      })
    }
    default:
      return state;
  }
};
