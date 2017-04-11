import { LoadingStatus, ActionTypes } from '../constants';
import { CommunicationService, KeyGeneratorService, AccountService } from '../services';
import NavigateActions from './NavigateActions';
import AccountActions from './AccountActions';
import AppActions from './AppActions';
import NotificationActions from './NotificationActions';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import log from 'loglevel';

/**
 * Private actions
 */
class LoginPrivateActions {
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.LOGIN_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static setLoginErrorAction(errors) {
    return {
      type: ActionTypes.LOGIN_SET_ERROR,
      errors
    }
  }
}

/**
 * Public actions
 */
class LoginActions {

  /**
   * Log the user in given account name and keys
   * This is internal action that is used for the exposed login and signup function
   */
  static loginWithKeys(accountName, keys) {
    return (dispatch) => {
      return CommunicationService.getFullAccount(accountName).then((fullAccount) => {
        const account = fullAccount.get('account');
        const isAuthenticated = AccountService.authenticateAccount(account, keys);
        if (isAuthenticated) {
          const accountStatistics = fullAccount.get('statistics');
          const availableBalances = fullAccount.get('balances');
          // Save account information
          dispatch(AccountActions.setAccountAction(account));
          // Save account statistic
          dispatch(AccountActions.setStatisticsAction(accountStatistics));
          // Save account available balance
          dispatch(AccountActions.setAvailableBalancesAction(availableBalances));
          // Save keys
          dispatch(AccountActions.setKeys(keys));
          // Set is logged in
          dispatch(AppActions.setIsLoggedInAction(true));
          // Init notification
          dispatch(NotificationActions.initNotification());
        } else {
          throw new Error(I18n.t('login.wrong_username_password'));
        }
      })
    }
  }

  /**
   * Log the user in with account name and password
   */
  static login(accountName, password) {
    return (dispatch) => {
      // Set register status to loading
      dispatch(LoginPrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));
      const keys = KeyGeneratorService.generateKeys(accountName, password);

      return dispatch(LoginActions.loginWithKeys(accountName, keys)).then(() => {
        log.debug('Login succeed.')
        // Set login status to done
        dispatch(LoginPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
        // Navigate to home
        dispatch(NavigateActions.navigateTo('/exchange'));
      }).catch((error) => {
        log.error('Login error', error);
        // Set error
        dispatch(LoginPrivateActions.setLoginErrorAction([I18n.t('login.wrong_username_password')]));
      })
    }
  }
}

export default LoginActions;
