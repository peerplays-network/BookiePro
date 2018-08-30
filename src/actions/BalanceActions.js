import {ActionTypes, LoadingStatus} from '../constants';
import {CommunicationService} from '../services';
import AssetActions from './AssetActions';
import log from 'loglevel';

/**
 * Private actions
 */
class BalancePrivateActions {
  static setGetDepositAddressLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BALANCE_SET_GET_DEPOSIT_ADDRESS_LOADING_STATUS,
      loadingStatus
    };
  }

  static setWithdrawLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BALANCE_SET_WITHDRAW_LOADING_STATUS,
      loadingStatus
    };
  }

  static setGetBalanceLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BALANCE_SET_GET_BALANCE_LOADING_STATUS,
      loadingStatus
    };
  }

  static setWithdrawErrorAction(error) {
    return {
      type: ActionTypes.BALANCE_SET_WITHDRAW_ERROR,
      error
    };
  }

  static setTopMenuWithdrawLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BALANCE_SET_TOPMENU_WITHDRAW_LOADING_STATUS,
      loadingStatus
    };
  }

  static setTopMenuWithdrawErrorAction(error) {
    return {
      type: ActionTypes.BALANCE_SET_TOPMENU_WITHDRAW_ERROR,
      error
    };
  }

  static setGetDepositAddressErrorAction(error) {
    return {
      type: ActionTypes.BALANCE_SET_GET_DEPOSIT_ADDRESS_ERROR,
      error
    };
  }

  static setDepositAddressAction(depositAddress) {
    return {
      type: ActionTypes.BALANCE_SET_DEPOSIT_ADDRESS,
      depositAddress
    };
  }

  static addOrUpdateAvailableBalancesAction(availableBalances) {
    return {
      type: ActionTypes.BALANCE_ADD_OR_UPDATE_AVAILABLE_BALANCES,
      availableBalances
    };
  }
}

/**
 * Public actions
 */
class BalanceActions {
  static removeAvailableBalancesByIdsAction(balanceIds) {
    return {
      type: ActionTypes.BALANCE_REMOVE_AVAILABLE_BALANCES_BY_IDS,
      balanceIds
    };
  }

  static addOrUpdateAvailableBalances(availableBalances) {
    return (dispatch) => {
      const assetIds = availableBalances.map((balance) => balance.get('asset_type'));
      // Get asset objects for each balance
      dispatch(AssetActions.getAssetsByIds(assetIds))
        .then(() => {
          // Save available balances
          dispatch(BalancePrivateActions.addOrUpdateAvailableBalancesAction(availableBalances));
          log.debug('Add available balances succeeds.');
        }).catch((error) => {
          log.error('Fail to add or update available balances', error);
        });
    };
  }

  static getDepositAddress() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);

      dispatch(
        BalancePrivateActions.setGetDepositAddressLoadingStatusAction(LoadingStatus.LOADING)
      );
      CommunicationService.getDepositAddress(accountId)
        .then((depositAddress) => {
          log.debug('Get deposit address succeed.');
          dispatch(BalancePrivateActions.setDepositAddressAction(depositAddress));
          dispatch(
            BalancePrivateActions.setGetDepositAddressLoadingStatusAction(LoadingStatus.DONE)
          );
        }).catch((error) => {
          log.error('Get deposit address error', error);
          //Set password change error
          dispatch(BalancePrivateActions.setGetDepositAddressErrorAction(error));
        });
    };
  }

  static withdraw(withdrawAmt, walletAddress) {
    return (dispatch) => {
      dispatch(BalancePrivateActions.setWithdrawLoadingStatusAction(LoadingStatus.LOADING));
      CommunicationService.withdraw(withdrawAmt, walletAddress)
        .then(() => {
          log.debug('Withdraw succeed.');
          dispatch(BalancePrivateActions.setWithdrawLoadingStatusAction(LoadingStatus.DONE));
        }).catch((error) => {
          log.error('Withdraw error', error);
          //Set password change error
          dispatch(BalancePrivateActions.setWithdrawErrorAction(error));
        });
    };
  }

  //Reset withdraw status to default (my account)
  static resetWithdrawLoadingStatus() {
    return BalancePrivateActions.setWithdrawLoadingStatusAction(LoadingStatus.DEFAULT);
  }

  static topMenuWithdraw(withdrawAmt, walletAddress) {
    return (dispatch) => {
      dispatch(BalancePrivateActions.setTopMenuWithdrawLoadingStatusAction(LoadingStatus.LOADING));
      CommunicationService.withdraw(walletAddress)
        .then(() => {
          log.debug('Withdraw succeed.');
          dispatch(BalancePrivateActions.setTopMenuWithdrawLoadingStatusAction(LoadingStatus.DONE));
        }).catch((error) => {
          log.error('Withdraw error', error);
          //Set password change error
          dispatch(BalancePrivateActions.setTopMenuWithdrawErrorAction(error));
        });
    };
  }

  //Reset withdraw status to default (top menu)
  static resetTopMenuWithdrawLoadingStatus() {
    return BalancePrivateActions.setTopMenuWithdrawLoadingStatusAction(LoadingStatus.DEFAULT);
  }
}

export default BalanceActions;
