import { ActionTypes, LoadingStatus } from '../constants';
import { BlockchainUtils } from '../utility';
import { WalletService, AccountService, KeyGeneratorService, CommunicationService } from '../services';
import { TransactionBuilder, FetchChain } from 'graphenejs-lib';
import NavigateActions from './NavigateActions';
import log from 'loglevel';
import Immutable from 'immutable';
import _ from 'lodash';

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

  static setChangePasswordLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.ACCOUNT_SET_CHANGE_PASSWORD_LOADING_STATUS,
      loadingStatus
    }
  }

  static setChangePasswordErrorsAction(errors) {
    return {
      type: ActionTypes.ACCOUNT_SET_CHANGE_PASSWORD_ERRORS,
      errors
    }
  }

  static setGetBalanceLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.ACCOUNT_SET_GET_BALANCE_LOADING_STATUS,
      loadingStatus
    }
  }

  static setTransactionHistoriesAction(transactionHistories) {
    return {
      type: ActionTypes.ACCOUNT_SET_TRANSACTION_HISTORIES,
      transactionHistories
    }
  }

  static setGetTransactionHistoriesErrorAction(error) {
    return {
      type: ActionTypes.ACCOUNT_SET_GET_TRANSACTION_HISTORIES_ERROR,
      error
    }
  }


  static setWithdrawErrorAction(error) {
    return {
      type: ActionTypes.ACCOUNT_SET_WITHDRAW_ERROR,
      error
    }
  }


  static setGetDepositAddressErrorAction(error) {
    return {
      type: ActionTypes.ACCOUNT_SET_GET_DEPOSIT_ADDRESS_ERROR,
      error
    }
  }

  static setDepositAddressAction(depositAddress) {
    return {
      type: ActionTypes.ACCOUNT_SET_DEPOSIT_ADDRESS,
      depositAddress
    }
  }

  static logoutAction() {
    return {
      type: ActionTypes.ACCOUNT_LOGOUT
    }
  }

  static setKeysAction(privateKeyWifsByRole, publicKeyStringsByRole) {
    return {
      type: ActionTypes.ACCOUNT_SET_KEYS,
      privateKeyWifsByRole,
      publicKeyStringsByRole
    }
  }

  static updateAvailableBalanceAction(availableBalance) {
    return {
      type: ActionTypes.ACCOUNT_UPDATE_AVAILABLE_BALANCE,
      availableBalance,
    }
  }

}

/**
 * Public actions
 */
class AccountActions {

  static removeAvailableBalanceByIdAction(balanceId) {
    return {
      type: ActionTypes.ACCOUNT_REMOVE_AVAILABLE_BALANCE_BY_ID,
      balanceId,
    }
  }

  static resetChangePwdLoadingStatus(){
    return AccountPrivateActions.setChangePasswordLoadingStatusAction(LoadingStatus.DEFAULT);
  }

  static updateAvailableBalance(availableBalance) {
    return (dispatch, getState) => {
      const assetId = availableBalance.get('asset_type');
      const currentBalance = getState().getIn(['account', 'availableBalancesByAssetId', assetId]);
      if (!availableBalance.equals(currentBalance)) {
        dispatch(AccountPrivateActions.updateAvailableBalanceAction(availableBalance));
      }
    }
  }

  static setAvailableBalancesAction(availableBalances) {
    return {
      type: ActionTypes.ACCOUNT_SET_AVAILABLE_BALANCES,
      availableBalances,
    }
  }

  static setInGameBalancesAction(inGameBalances) {
    return {
      type: ActionTypes.ACCOUNT_SET_IN_GAME_BALANCES,
      inGameBalances
    }
  }

  static setStatisticsAction(statistics) {
    return {
      type: ActionTypes.ACCOUNT_SET_STATISTICS,
      statistics
    }
  }

  static setAccountAction(account) {
    return {
      type: ActionTypes.ACCOUNT_SET_ACCOUNT,
      account
    }
  }

  /**
   * Set keys for the account
   */
  static setKeys(keys) {
    return (dispatch) => {
      let privateKeyWifsByRole = Immutable.Map();
      let publicKeyStringsByRole = Immutable.Map();
      _.forEach(keys, (privateKey, role) => {
        privateKeyWifsByRole = privateKeyWifsByRole.set(role, privateKey.toWif());
        publicKeyStringsByRole = publicKeyStringsByRole.set(role, privateKey.toPublicKey().toPublicKeyString());
      });
      dispatch(AccountPrivateActions.setKeysAction(privateKeyWifsByRole, publicKeyStringsByRole));
    }
  }

  /**
   * Get transaction history
   */
  static getTransactionHistories(startTime, stopTime) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);

      dispatch(AccountPrivateActions.setGetTransactionHistoriesLoadingStatusAction(LoadingStatus.LOADING));
      CommunicationService.getTransactionHistories(accountId, startTime, stopTime).then((transactionHistories) => {
        dispatch(AccountPrivateActions.setTransactionHistoriesAction(transactionHistories));
        dispatch(AccountPrivateActions.setGetTransactionHistoriesLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Get transaction histories error', error);
        //Set password change error
        dispatch(AccountPrivateActions.setGetTransactionHistoriesErrorAction(error));
      });
    };
  }

  static getDepositAddress() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);

      dispatch(AccountPrivateActions.setGetDepositAddressLoadingStatusAction(LoadingStatus.LOADING));
      CommunicationService.getDepositAddress(accountId).then((depositAddress) => {
        dispatch(AccountPrivateActions.setDepositAddressAction(depositAddress));
        dispatch(AccountPrivateActions.setGetDepositAddressLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Get deposit address error', error);
        //Set password change error
        dispatch(AccountPrivateActions.setGetDepositAddressErrorAction(error));
      });
    };
  }

  static withdraw(walletAddress) {
    return (dispatch) => {
      dispatch(AccountPrivateActions.setWithdrawLoadingStatusAction(LoadingStatus.LOADING));
      CommunicationService.withdraw(walletAddress).then(() => {
        dispatch(AccountPrivateActions.setWithdrawLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Withdraw error', error);
        //Set password change error
        dispatch(AccountPrivateActions.setWithdrawErrorAction(error));
      });
    };
  }

  static changePassword(oldPassword, newPassword) {
    return (dispatch, getState) => {
      dispatch(AccountPrivateActions.setChangePasswordLoadingStatusAction(LoadingStatus.LOADING));

      const account = getState().getIn(['account', 'account']);
      const oldKeys = KeyGeneratorService.generateKeys(account.get('name'), oldPassword);
      // Generate new public key
      const newKeys = KeyGeneratorService.generateKeys(account.get('name'), newPassword);
      const newOwnerPublicKey = newKeys.owner.toPublicKey().toPublicKeyString();
      const newActivePublicKey = newKeys.active.toPublicKey().toPublicKeyString();
      const newMemoPublicKey = newKeys.memo.toPublicKey().toPublicKeyString();

      Promise.resolve().then(() => {
        // Check if account is authenticated
        const isAuthenticated = AccountService.authenticateAccount(account, oldKeys);
        if (!isAuthenticated) {
          throw new Error('Old Password doesn`t match');
        }
        // Create transaction and add operation
        const tr = new TransactionBuilder();
        const operationParams = {
          fee: {
            amount: 0,
            asset_id: '1.3.0'
          },
          account: account.get('id'),
          owner: Object.assign({}, account.get('owner').toJS(), {key_auths: [[newOwnerPublicKey, 1]]}),
          active:  Object.assign({}, account.get('active').toJS(), {key_auths: [[newActivePublicKey, 1]]}),
          new_options: Object.assign({}, account.get('options').toJS(), {memo_key: newMemoPublicKey})
        };
        tr.add_type_operation('account_update', operationParams);
        // Process transaction
        return WalletService.processTransaction(getState(), tr);
      }).then(() => {
        log.debug('Change Password succeed.');
        // Set keys
        dispatch(AccountActions.setKeys(newKeys));
        //To display the success message
        dispatch(AccountPrivateActions.setChangePasswordLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Change Password error', error);
        //Set password change error
        dispatch(AccountPrivateActions.setChangePasswordErrorsAction([error.message ? error.message : 'Error Occured']));
      });
    };
  }

  static createLimitOrder(sellAssetId, buyAssetId, sellAmount, buyAmount) {
    return (dispatch, getState) => {
      FetchChain('getAsset', [sellAssetId, buyAssetId]).then((result) => {
        const sellAsset = result.get('0'); // Core token
        const buyAsset = result.get('1');
        const sellAssetAmount = sellAmount;
        const buyAssetAmount = buyAmount;
        const accountId = getState().getIn(['account', 'account', 'id']);
        const sellAssetSatoshiAmount = BlockchainUtils.get_satoshi_amount(sellAssetAmount, sellAsset);
        const buyAssetSatoshiAmount = BlockchainUtils.get_satoshi_amount(buyAssetAmount, buyAsset);
        const expiration = new Date();
        expiration.setYear(expiration.getFullYear() + 5);
        const isFillOrKill = false;

        // Create transaction and add operation
        const tr = new TransactionBuilder();
        const operationParams = {
          'seller': accountId,
          'amount_to_sell': {
            'amount': sellAssetSatoshiAmount,
            'asset_id': sellAssetId
          },
          expiration : expiration,
          'min_to_receive': {
            'amount': buyAssetSatoshiAmount,
            'asset_id': buyAssetId
          },
          'fill_or_kill': isFillOrKill
        };
        tr.add_type_operation('limit_order_create', operationParams);
        // Process transaction
        return WalletService.processTransaction(getState(), tr);
      }).then(() => {
        console.log('Create limit order success');
      }).catch((error) => {
        console.error('Create limit order fails', error);
      })
    }
  }

  static logout() {
    return (dispatch) => {
      dispatch(AccountPrivateActions.logoutAction());
      // Navigate to the beginning of the app
      dispatch(NavigateActions.navigateTo('/'));
    }
  }



}

export default AccountActions;
