import AppActions from './AppActions';
import { LoginStatus, ActionTypes } from '../constants';
import { AccountService } from '../services';
import { FetchChain } from 'graphenejs-lib';
import NavigateActions from './NavigateActions';

/**
 * Private actions
 */
class LoginPrivateActions {
  static setLoginStatusAction(status) {
    return {
      type: ActionTypes.LOGIN_SET_STATUS,
      status
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
      dispatch(LoginPrivateActions.setLoginStatusAction(LoginStatus.LOADING));

      FetchChain('getAccount', accountName).then((account) => {
        console.log('Get Account for Login Success', account);
        const isAuthenticated = AccountService.authenticateAccount(accountName, password, account);
        if (isAuthenticated) {
          // Set login status to done
          dispatch(LoginPrivateActions.setLoginStatusAction(LoginStatus.DONE));
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
