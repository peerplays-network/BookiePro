import { ActionTypes, LoadingStatus } from '../constants';
import FakeApi from '../communication/FakeApi';
import { ChainStore } from 'graphenejs-lib';

// Account subscriber
let accountSubscriber;

/**
 * Private actions
 */
class AccountPrivateActions {

  static setGetTransactionHistoriesLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.ACCOUNT_SET_GET_TRANSACTION_HISTORIES_LOADING_STATUS,
      loadingStatus
    }
  }

  static setGetDepositAddressLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.ACCOUNT_SET_GET_DEPOSIT_ADDRESS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setWithdrawLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.ACCOUNT_SET_WITHDRAW_LOADING_STATUS,
      loadingStatus
    }
  }

  static setTransactionHistoriesAction(transactionHistories) {
    return {
      type: ActionTypes.ACCOUNT_SET_TRANSACTION_HISTORIES,
      transactionHistories
    }
  }

  static setDepositAddressAction(depositAddress) {
    return {
      type: ActionTypes.ACCOUNT_SET_DEPOSIT_ADDRESS,
      depositAddress
    }
  }

  static setAccountAction(account) {
    return {
      type: ActionTypes.ACCOUNT_SET_ACCOUNT,
      account
    }
  }

  static setBalanceAction(availableBalance, inGameBalance) {
    return {
      type: ActionTypes.ACCOUNT_SET_BALANCE,
      availableBalance,
      inGameBalance
    }
  }

  static setGetBalanceLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.ACCOUNT_SET_GET_BALANCE_LOADING_STATUS,
      loadingStatus
    }
  }

  static getBalance(account) {
    return (dispatch) => {
      dispatch(AccountPrivateActions.setGetBalanceLoadingStatusAction(LoadingStatus.LOADING));
      Promise.all([
        FakeApi.getAvailableBalance(account),
        FakeApi.getInGameBalance(account)
      ]).then((result) => {
        dispatch(AccountPrivateActions.setBalanceAction(result[0], result[1]));
        dispatch(AccountPrivateActions.setGetBalanceLoadingStatusAction(LoadingStatus.DONE));
      })
    }
  }
}

/**
 * Public actions
 */
class AccountActions {
  static setKeysAction(keys) {
    return {
      type: ActionTypes.ACCOUNT_SET_KEYS,
      keys
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
            dispatch(AccountActions.setAccount(updatedAccount));
          }
        }
      };
      ChainStore.subscribe(accountSubscriber);
      // Set the account
      dispatch(AccountPrivateActions.setAccountAction(account));
      // Get balance for the account
      dispatch(AccountPrivateActions.getBalance(account))
    }
  }

  static getTransactionHistories(startTime, stopTime) {
    return (dispatch, getState) => {
      const account = getState().app.account;
      const accountId = account && account.get('id');

      dispatch(AccountPrivateActions.setGetTransactionHistoriesLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      FakeApi.getTransactionHistory(accountId, startTime, stopTime).then((transactionHistories) => {
        dispatch(AccountPrivateActions.setTransactionHistoriesAction(transactionHistories));
        dispatch(AccountPrivateActions.setGetTransactionHistoriesLoadingStatusAction(LoadingStatus.DONE));
      });
    };
  }

  static getDepositAddress() {
    return (dispatch, getState) => {
      const account = getState().app.account;
      const accountId = account && account.get('id');

      dispatch(AccountPrivateActions.setGetDepositAddressLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      FakeApi.getDepositAddress(accountId).then((depositAddress) => {
        dispatch(AccountPrivateActions.setDepositAddressAction(depositAddress));
        dispatch(AccountPrivateActions.setGetDepositAddressLoadingStatusAction(LoadingStatus.DONE));
      });
    };
  }

  static withdraw(walletAddress) {
    return (dispatch) => {
      dispatch(AccountPrivateActions.setWithdrawLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      FakeApi.withdraw(walletAddress).then(() => {
        dispatch(AccountPrivateActions.setWithdrawLoadingStatusAction(LoadingStatus.DONE));
      });
    };
  }


}

export default AccountActions;
