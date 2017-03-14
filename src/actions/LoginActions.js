import AppActions from './AppActions';
import { LoadingStatus, ActionTypes } from '../constants';
import { AccountService } from '../services';
import { FetchChain } from 'graphenejs-lib';
import NavigateActions from './NavigateActions';

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

  static setLoginErrorAction(error) {
    return {
      type: ActionTypes.LOGIN_SET_ERROR,
      error
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
        console.log('Get Account for Login Success', account);
        const isAuthenticated = AccountService.authenticateAccount(accountName, password, account);
        if (isAuthenticated) {
          // Set login status to done
          dispatch(LoginPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
          // Set is logged in
          dispatch(AppActions.setIsLoggedInAction(true));
          // Save account information
          dispatch(AppActions.setAccount(account));
          // Navigate to home
          dispatch(NavigateActions.navigateTo('/home'))
        } else {
          throw new Error('Password doesn\'t match');
        }
      }).catch((error) => {
        console.log('Login Error', error)
        // Set error
        dispatch(LoginPrivateActions.setLoginErrorAction(error));
      })
    }
  }
}

export default LoginActions;
