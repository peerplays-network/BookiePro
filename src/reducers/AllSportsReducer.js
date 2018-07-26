import {ActionTypes, LoadingStatus} from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  loadingStatus: LoadingStatus.DEFAULT,
  error: null
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ALL_SPORTS_SET_LOADING_STATUS: {
      return state.merge({
        loadingStatus: action.loadingStatus
      });
    }

    case ActionTypes.ALL_SPORTS_SET_ERROR: {
      return state.merge({
        error: action.error,
        loadingStatus: LoadingStatus.ERROR
      });
    }

    default:
      return state;
  }
}
