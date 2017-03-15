import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';

let initialState = {
  loadingStatus: LoadingStatus.DEFAULT,
  status: LoadingStatus.DEFAULT,
  errors: [],
  accountForLogin: null
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.LOGIN_SET_LOADING_STATUS: {
      const loadingStatus = action.loadingStatus;
      return Object.assign({}, state, { status:loadingStatus });
    }
    case ActionTypes.LOGIN_SET_ACCOUNT_FOR_LOGIN:
      return Object.assign({}, state, {
        accountForLogin: action.accountForLogin
      });
    case ActionTypes.LOGIN_SET_ERROR: {
      return Object.assign({}, state, {
        errors: action.errors,
        status: LoadingStatus.DEFAULT
      });
    }
    default:
      return state;
  }
}
