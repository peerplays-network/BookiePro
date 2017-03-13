import AppActions from './AppActions';
import { LoginStatus, ActionTypes } from '../constants';
import { AccountService } from '../services';
import { FetchChain } from 'graphenejs-lib';
import NavigateActions from './NavigateActions';

class LoginActions {

  static setLoginStatus(status) {
    return {
      type: ActionTypes.LOGIN_SET_STATUS,
      status
    }
  }

  static setLoginError(error) {
    return {
      type: ActionTypes.LOGIN_SET_ERROR,
      error
    }
  }

  static login(accountName, password) {

    return (dispatch) => {
      // Set register status to loading
      dispatch(LoginActions.setLoginStatus(LoginStatus.LOADING));

      FetchChain('getAccount', accountName).then((account) => {
        console.log('Get Account for Login Success', account);
        const isAuthenticated = AccountService.authenticateAccount(accountName, password, account);
        if (isAuthenticated) {
          // Set login status to done
          dispatch(LoginActions.setLoginStatus(LoginStatus.DONE));
          // Set is logged in
          dispatch(AppActions.setIsLoggedIn(true));
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
        dispatch(LoginActions.setLoginError(error));
      })
    }
  }
}

export default LoginActions;
