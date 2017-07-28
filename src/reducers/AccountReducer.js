import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  isLoggedIn: false,
  account: {},
  password: null,
  privateKeyWifsByRole: {},
  publicKeyStringsByRole: {},
  statistics: {},
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.ACCOUNT_SET_IS_LOGGED_IN: {
      return state.merge({
        isLoggedIn: action.isLoggedIn
      });
    }
    case ActionTypes.ACCOUNT_SET_ACCOUNT: {
      return state.merge({
        account: action.account
      });
    }
    case ActionTypes.ACCOUNT_SET_PASSWORD: {
      return state.merge({
        password: action.password,
      });
    }
    case ActionTypes.ACCOUNT_SET_STATISTICS: {
      return state.merge({
        statistics: action.statistics
      });
    }
    case ActionTypes.AUTH_RESET_AUTO_LOGIN_INFO: {
      return initialState;
    }
    case ActionTypes.AUTH_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
