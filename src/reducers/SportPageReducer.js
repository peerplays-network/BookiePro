import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import _ from 'lodash';

let initialState = Immutable.fromJS({
  errorBySportId: {},
  loadingStatusBySportId: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
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
