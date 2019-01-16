import LoginPageConstants from '../constants/LoginPage';

/**
 * Login Page Reducer is used to controlling login in an application
 * Initial State
 * status - Login form: Button state
 * errors - Login form: Common validation errors
 * accountForLogin - Login form: If the account exists and it's valid, then we work with it
 * @type {{status: string, errors: Array, accountForLogin: null}}
 */
let defaultState = {
  status: 'default',
  errors: [],
  accountForLogin: null
};

export default function (state = defaultState, action) {
  switch (action.type) {
    /**
     * Login form: Setting button state
     */
    case LoginPageConstants.LOGIN_SET_STATUS:
      return Object.assign({}, state, {
        status: action.status
      });
      /**
       * Login form: Set up a login account
       */
    case LoginPageConstants.LOGIN_SET_ACCOUNT_FOR_LOGIN:
      return Object.assign({}, state, {
        accountForLogin: action.accountForLogin
      });
      /**
       * Login form: Setting Common validation errors
       */
    case LoginPageConstants.LOGIN_SET_LOGIN_ERRORS:
      return Object.assign({}, state, {
        errors: action.errors
      });
    default:
      /**
       * We return the previous state in the default case
       */
      return state;
  }
}