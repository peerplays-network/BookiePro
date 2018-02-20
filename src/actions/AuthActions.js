import { LoadingStatus, ActionTypes, Config } from '../constants';
import { CommunicationService, KeyGeneratorService, AccountService, WalletService } from '../services';
import NavigateActions from './NavigateActions';
import AccountActions from './AccountActions';
import SettingActions from './SettingActions';
import BalanceActions from './BalanceActions';
import RawHistoryActions from './RawHistoryActions';
import AppActions from './AppActions';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import log from 'loglevel';
import { TransactionBuilder } from 'peerplaysjs-lib';

/**
 * Private actions
 */
class AuthPrivateActions {
  static resetAutoLoginInfoAction() {
    return {
      type: ActionTypes.AUTH_RESET_AUTO_LOGIN_INFO
    }
  }
  static logoutAction(accountId) {
    return {
      type: ActionTypes.AUTH_LOGOUT,
      accountId
    }
  }

  static setLoginLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.AUTH_SET_LOGIN_LOADING_STATUS,
      loadingStatus
    }
  }

  static setLoginErrorsAction(errors) {
    return {
      type: ActionTypes.AUTH_SET_LOGIN_ERRORS,
      errors
    }
  }

  static setAutoLoginLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.AUTH_SET_AUTO_LOGIN_LOADING_STATUS,
      loadingStatus
    }
  }

  static setAutoLoginErrorsAction(errors) {
    return {
      type: ActionTypes.AUTH_SET_AUTO_LOGIN_ERRORS,
      errors
    }
  }

  static setSignupLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.AUTH_SET_SIGNUP_LOADING_STATUS,
      loadingStatus
    }
  }

  static setSignupErrorsAction(errors) {
    return {
      type: ActionTypes.AUTH_SET_SIGNUP_ERRORS,
      errors
    }
  }

  static setChangePasswordLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.AUTH_SET_CHANGE_PASSWORD_LOADING_STATUS,
      loadingStatus
    }
  }

  static setChangePasswordErrorsAction(errors) {
    return {
      type: ActionTypes.AUTH_SET_CHANGE_PASSWORD_ERRORS,
      errors
    }
  }

  /**
   * Log the user in given account name and password
   * This is internal action that is used for the exposed login and signup function
   */
  static processLogin(accountName, password) {
    return (dispatch) => {
      return CommunicationService.getFullAccount(accountName).then((fullAccount) => {
        const account = fullAccount && fullAccount.get('account');
        const keys = KeyGeneratorService.generateKeys(accountName, password);
        const isAuthenticated = AccountService.authenticateAccount(account, keys);
        if (isAuthenticated) {
          const accountStatistics = fullAccount.get('statistics');
          const availableBalances = fullAccount.get('balances');
          // Save account information
          dispatch(AccountActions.setAccountAction(account));
          // Save password
          dispatch(AccountActions.setPasswordAction(password));
          // Save account statistic
          dispatch(AccountActions.setStatistics(accountStatistics));
          // Save account available balance
          dispatch(BalanceActions.addOrUpdateAvailableBalances(availableBalances));
          // Set initial setting (in case this is first time login)
          dispatch(SettingActions.setInitialSetting());
          // Set is logged in
          dispatch(AccountActions.setIsLoggedInAction(true));
          // Init history
          dispatch(RawHistoryActions.initRawHistory());
        } else {
          throw new Error(I18n.t('login.wrong_username_password'));
        }
      })
    }
  }

}

/**
 * Public actions
 */
class AuthActions {
  /**
   * Auto login
   */
  static autoLogin() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if(!accountId){
        // No auto login information
        log.info('No auto login information');
        // Dispatch logout action to clear data
        dispatch(AuthPrivateActions.logoutAction(accountId));
        // Navigate to the login page of the app
        dispatch(NavigateActions.navigateTo('/login'));
        log.debug('Logout user succeed.');
        
        return Promise.reject();
      } else{
        if (accountId){
            // Dispatch logout action to clear data
          dispatch(AuthPrivateActions.logoutAction(accountId));
          // Navigate to the login page of the app
          dispatch(NavigateActions.navigateTo('/login'));
          log.debug('Logout user succeed.');
          return Promise.reject();
        }else {
          log.error('No user is logged in');
          return Promise.reject();
        }
        
      }
    }
  }
  /**
   * Log the user in with account name and password
   */
  static login(accountName, password) {
    return (dispatch) => {
      // Set register status to loading
      dispatch(AuthPrivateActions.setLoginLoadingStatusAction(LoadingStatus.LOADING));
      return dispatch(AuthPrivateActions.processLogin(accountName, password)).then(() => {
        log.debug('Login succeed.')
        // Navigate to home page
        dispatch(NavigateActions.navigateTo('/exchange'));
        // Set login status to done
        dispatch(AuthPrivateActions.setLoginLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Login error', error);
        // Set error
        dispatch(AuthPrivateActions.setLoginErrorsAction([I18n.t('login.wrong_username_password')]));
      })
    }
  }

  static signup(accountName, password) {
    return (dispatch) => {

      // Set register status to loading
      dispatch(AuthPrivateActions.setSignupLoadingStatusAction(LoadingStatus.LOADING));

      const keys = KeyGeneratorService.generateKeys(accountName, password);
      // Determine which way to register
      let register;
      if (Config.registerThroughRegistrar) {
        register = AccountService.registerThroughRegistrar(accountName, keys);
      } else {
        register = AccountService.registerThroughFaucet(1, accountName, keys);
      }
      register.then(() => {
        // Log the user in
        return dispatch(AuthPrivateActions.processLogin(accountName, password));
      }).then(() => {
        log.debug('Signup succeed.');
        // Navigate to home page
        dispatch(NavigateActions.navigateTo('/deposit'));
        // Set register status to done
        dispatch(AuthPrivateActions.setSignupLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Signup Error', error);
        // Set error
        dispatch(AuthPrivateActions.setSignupErrorsAction([error.message ? error.message : 'Error Occured']))
      })
    }
  }

  static resetChangePwdLoadingStatus(){
    return AuthPrivateActions.setChangePasswordLoadingStatusAction(LoadingStatus.DEFAULT);
  }

  static changePassword(oldPassword, newPassword) {
    return (dispatch, getState) => {
      dispatch(AuthPrivateActions.setChangePasswordLoadingStatusAction(LoadingStatus.LOADING));

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
          throw new Error(I18n.t('changePassword.old_password_does_not_match'));
        }
        // Create transaction and add operation
        const tr = new TransactionBuilder();
        const operationParams = {
          fee: {
            amount: 0,
            asset_id: Config.coreAsset
          },
          account: account.get('id'),
          owner: Object.assign({}, account.get('owner').toJS(), {key_auths: [[newOwnerPublicKey, 1]]}),
          active:  Object.assign({}, account.get('active').toJS(), {key_auths: [[newActivePublicKey, 1]]}),
          new_options: Object.assign({}, account.get('options').toJS(), {memo_key: newMemoPublicKey})
        };
        tr.add_type_operation('account_update', operationParams);
        // Process transaction
        return WalletService.processTransaction(oldKeys, tr);
      }).then(() => {
        log.debug('Change Password succeed.');
        // Set new password
        dispatch(AccountActions.setPasswordAction(newPassword));
        //To display the success message
        dispatch(AuthPrivateActions.setChangePasswordLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Change Password error', error);
        //Set password change error
        dispatch(AuthPrivateActions.setChangePasswordErrorsAction([error.message ? error.message : 'Error Occured']));
      });
    };
  }

  /**
   * Logout the user, show popup dialog if needed
   */
  static logoutAndShowPopupIfNeeded() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        const isSkipLogoutPopup = getState().getIn(['setting', 'settingByAccountId', accountId, 'isSkipLogoutPopup']);
        if (isSkipLogoutPopup) {
          // Skip logout popup, directly confirm logout
          dispatch(AuthActions.confirmLogout(isSkipLogoutPopup));
        } else {
          // Show logout popup
          dispatch(AppActions.showLogoutPopupAction(true))
        }
      } else {
        log.error('No user is logged in');
      }
    }
  }

  /**
   * Confirm logging out the user (use this to confirm logout for the logout popup modal)
   */
  static confirmLogout(skipLogoutPopupNextTime) {
    return (dispatch, getState) => {
      // Mark skip logout popup
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        // Close popup
        dispatch(AppActions.showLogoutPopupAction(false))
        // Save in redux
        dispatch(SettingActions.markSkipLogoutPopupAction(accountId, skipLogoutPopupNextTime));
        // Dispatch logout action to clear data
        dispatch(AuthPrivateActions.logoutAction(accountId));
        // Navigate to the login page of the app
        dispatch(NavigateActions.navigateTo('/login'));
        log.debug('Logout user succeed.');
      } else {
        log.error('No user is logged in');
      }
    }
  }

  //Clear any sign up related error from store
  static clearSignupError(){
    return (dispatch) => {
      dispatch(AuthPrivateActions.setSignupErrorsAction([]));
    }
  }

}

export default AuthActions;
