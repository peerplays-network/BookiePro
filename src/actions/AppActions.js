import { ActionTypes, LoadingStatus } from '../constants';
import { ChainStore } from 'graphenejs-lib';
import FakeApi from '../communication/FakeApi';

// Account subscriber
let accountSubscriber;

/**
 * Private actions
 */
class AppPrivateActions {
  static setAccountAction(account) {
    return {
      type: ActionTypes.APP_SET_ACCOUNT,
      account
    }
  }

  static setGlobalBettingStatisticsAction(globalBettingStatistics) {
    return {
      type: ActionTypes.APP_SET_GLOBAL_BETTING_STATISTICS,
      globalBettingStatistics
    }
  }

  static setGetGlobalBettingStatisticsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.APP_SET_GET_GLOBAL_BETTING_STATISTICS_LOADING_STATUS,
      loadingStatus
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

  static getGlobalBettingStatistics() {
    return (dispatch) => {
      dispatch(AppPrivateActions.setGetGlobalBettingStatisticsLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: replace with actual blockchain call later
      FakeApi.getGlobalBettingStatistics().then((globalBettingStatistics) => {
        dispatch(AppPrivateActions.setGlobalBettingStatisticsAction(globalBettingStatistics));
        dispatch(AppPrivateActions.setGetGlobalBettingStatisticsLoadingStatusAction(LoadingStatus.DONE));
      });
    }
  }
 }

export default AppActions;
