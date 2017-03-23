import AppActions from './AppActions';
import AccountActions from './AccountActions';
import { LoadingStatus, ActionTypes } from '../constants';
import { AccountService, KeyGeneratorService } from '../services';
import { FetchChain } from 'graphenejs-lib';
import NavigateActions from './NavigateActions';
var I18n = require('react-redux-i18n').I18n;

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
      errors:errors
    }
  }
}

/**
 * Public actions
 */
class LoginActions {
  static login(accountName, password) {
    return (dispatch) => {
      // Set register status to loading
      dispatch(LoginPrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      FetchChain('getAccount', accountName).then((account) => {
        const keys = KeyGeneratorService.generateKeys(accountName, password);
        const isAuthenticated = AccountService.authenticateAccount(account, keys);
        if (isAuthenticated) {
          // Save account information
          dispatch(AccountActions.setAccount(account));
          // Save keys
          dispatch(AccountActions.setKeysAction(keys));
          // Set is logged in
          dispatch(AppActions.setIsLoggedInAction(true));
          // Set login status to done
          dispatch(LoginPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
          // Navigate to home
          dispatch(NavigateActions.navigateTo('/exchange'))
        } else {
          //set error on password mismatch
          dispatch(LoginPrivateActions.setLoginErrorAction([I18n.t('login.wrong_username_password')]));
        }
      }).catch((error) => {
        // Set error
        dispatch(LoginPrivateActions.setLoginErrorAction([I18n.t('login.wrong_username_password')]));
      })
    }
  }
}

export default LoginActions;
