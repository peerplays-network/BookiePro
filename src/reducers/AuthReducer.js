import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  loginLoadingStatus: LoadingStatus.DEFAULT,
  loginErrors: [],
  signupLoadingStatus: LoadingStatus.DEFAULT,
  signupErrors: [],
  changePasswordLoadingStatus: LoadingStatus.DEFAULT,
  changePasswordErrors: [],
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.AUTH_SET_LOGIN_LOADING_STATUS: {
      return state.merge({
        loginLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.AUTH_SET_LOGIN_ERRORS: {
      return state.merge({
        loginErrors: Immutable.fromJS(action.errors),
        loginLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.AUTH_SET_SIGNUP_LOADING_STATUS: {
      return state.merge({
        signupLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.AUTH_SET_SIGNUP_ERRORS: {
      return state.merge({
        signupErrors: Immutable.fromJS(action.errors),
        signupLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.AUTH_SET_CHANGE_PASSWORD_LOADING_STATUS: {
      return state.merge({
        changePasswordLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.AUTH_SET_CHANGE_PASSWORD_ERRORS: {
      return state.merge({
        changePasswordErrors: Immutable.fromJS(action.errors),
        changePasswordLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.AUTH_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
