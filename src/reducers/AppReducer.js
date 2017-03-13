import { ActionTypes } from '../constants';

const initialState = {
  account: null,
  isLoggedIn: false
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.APP_SET_ACCOUNT: {
      const account = action.account;
      return Object.assign({}, state, { account });
    }
    case ActionTypes.APP_SET_IS_LOGGED_IN: {
      const isLoggedIn = action.isLoggedIn;
      return Object.assign({}, state, { isLoggedIn });
    }
    default:
      return state;
  }
}
