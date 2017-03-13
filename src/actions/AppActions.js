import { ActionTypes } from '../constants';
import { ChainStore } from 'graphenejs-lib';

let accountSubscriber;

class AppActions {
  static setIsLoggedIn(isLoggedIn) {
    return {
      type: ActionTypes.APP_SET_IS_LOGGED_IN,
      isLoggedIn
    }
  }

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
          if (!previousAccount || !previousAccount.equals(updatedAccount)) {
            dispatch(AppActions.setAccount(updatedAccount));
          }
        }
      };
      ChainStore.subscribe(accountSubscriber);

      return {
        type: ActionTypes.APP_SET_ACCOUNT,
        account
      }
    }

  }
}

export default AppActions;
