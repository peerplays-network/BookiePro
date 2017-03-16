import { ActionTypes, LoadingStatus } from '../constants';
import FakeApi from '../communication/FakeApi';

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
}

/**
 * Public actions
 */
class AccountActions {
  static getTransactionHistories(startTime, stopTime) {
    return (dispatch, getState) => {
      const account = getState().app.account;
      const accountId = account && account.get('id');

      dispatch(AccountPrivateActions.setGetTransactionHistoriesLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      FakeApi.getTransactionHistory(accountId, startTime, stopTime).then((transactionHistories) => {
        dispatch(AccountPrivateActions.setGetTransactionHistoriesLoadingStatusAction(LoadingStatus.DONE));
        dispatch(AccountPrivateActions.setTransactionHistoriesAction(transactionHistories));
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
        dispatch(AccountPrivateActions.setGetDepositAddressLoadingStatusAction(LoadingStatus.DONE));
        dispatch(AccountPrivateActions.setDepositAddressAction(depositAddress));
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
