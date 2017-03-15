import { ActionTypes } from '../constants';

/**
 * Private actions
 */
class AccountPrivateActions {
  // Generate set account action
  static setAccountAction(account) {
    return {
      type: ActionTypes.APP_SET_ACCOUNT,
      account
    }
  }
}

/**
 * Public actions
 */
class AccountActions {
  static setIsLoggedInAction(isLoggedIn) {
    return {
      type: ActionTypes.APP_SET_IS_LOGGED_IN,
      isLoggedIn
    }
  }

}

export default AppActions;
