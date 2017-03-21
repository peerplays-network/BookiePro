import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';

let initialState = {
  loadingStatus: LoadingStatus.DEFAULT,
  status: LoadingStatus.DEFAULT,
  errors: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.LOGIN_SET_LOADING_STATUS: {
      const loadingStatus = action.loadingStatus;
      return Object.assign({}, state, { status:loadingStatus });
    }
    case ActionTypes.LOGIN_SET_ERROR: {
      return Object.assign({}, state, {
        errors: action.errors,
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
