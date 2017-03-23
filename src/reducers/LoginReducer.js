import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  loadingStatus: LoadingStatus.DEFAULT,
  errors: []
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.LOGIN_SET_LOADING_STATUS: {
      return state.set('loadingStatus', action.loadingStatus);
    }
    case ActionTypes.LOGIN_SET_ERROR: {
      return state.merge({
        errors: Immutable.fromJS(action.errors),
        status: LoadingStatus.DEFAULT
      });
    }
    case ActionTypes.ACCOUNT_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
