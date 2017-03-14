import { ActionTypes } from '../constants';
import { ChainStore } from 'graphenejs-lib';

// Account subscriber
let accountSubscriber;

/**
 * Private actions
 */
class AppPrivateActions {
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
class AppActions {
  static setIsLoggedInAction(isLoggedIn) {
    return {
      type: ActionTypes.APP_SET_IS_LOGGED_IN,
      isLoggedIn
    }
  }

  /**
   * Set the account and subscribe to it
   */
  static setAccount(account) {
    return (dispatch, getState) => {

      // Unsubscribe previous account subscriber
      if (accountSubscriber) {
        ChainStore.unsubscribe(accountSubscriber);
      }
      // Define new account subscriber and subscribe to ChainStore
      accountSubscriber = () => {
        const accountId = account && account.get('id');
        if (accountId) {
          const previousAccount = getState().app.account;
          const updatedAccount = ChainStore.getAccount(accountId);
          // Dispatch updated account
          if (previousAccount && !previousAccount.equals(updatedAccount)) {
            dispatch(AppActions.setAccount(updatedAccount));
          }
        }
      };
      ChainStore.subscribe(accountSubscriber);
      // Set the account
      dispatch(AppPrivateActions.setAccountAction(account));
    }
  }
}

export default AppActions;
