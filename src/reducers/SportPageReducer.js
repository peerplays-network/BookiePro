import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import _ from 'lodash';

let initialState = Immutable.fromJS({
  eventIds: [],
  eventGroupIds: [],
  binnedOrderBooksByEvent: {},
  errorBySportId: {},
  loadingStatusBySportId: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SPORT_PAGE_SET_DATA: {
      return state.merge({
        eventIds: action.eventIds,
        eventGroupIds: action.eventGroupIds,
        binnedOrderBooksByEvent: action.binnedOrderBooksByEvent
      });
    }
    case ActionTypes.SPORT_PAGE_SET_LOADING_STATUS: {
      return state.setIn(['loadingStatusBySportId', action.sportId], action.loadingStatus);
    }
    case ActionTypes.SPORT_PAGE_SET_ERROR: {
      let nextState = state;
      nextState = state.setIn(['loadingStatusBySportId', action.sportId], LoadingStatus.ERROR);
      nextState = state.setIn(['errorBySportId', action.sportId], action.error);
      return nextState;
    }
    default:
      return state;
  }
};
