import AppActions from './AppActions';
import { RegisterStatus, ActionTypes } from '../constants';
import { AccountService } from '../services';
import { FetchChain } from 'graphenejs-lib';
import NavigateActions from './NavigateActions';

class RegisterActions {

  static setRegisterStatus(status) {
    return {
      type: ActionTypes.REGISTER_SET_STATUS,
      status
    }
  }

  static setRegisterError(error) {
    return {
      type: ActionTypes.REGISTER_SET_ERROR,
      error
    }
  }

  static signup(accountName, password) {

    return (dispatch) => {
      // Set register status to loading
      dispatch(RegisterActions.setRegisterStatus(RegisterStatus.LOADING));

      AccountService.registerThroughFaucet(1, accountName, password).then(() => {
        console.log('Register Success');
        // Get full account
        return FetchChain('getAccount', accountName);
      }).then((account) => {
        console.log('Get Account for Register Success', account);
        // Set register status to done
        dispatch(RegisterActions.setRegisterStatus(RegisterStatus.DONE));
        // Set is logged in
        dispatch(AppActions.setIsLoggedIn(true));
        // Save account information
        dispatch(AppActions.setAccount(account));
        // After some delay navigate to home page
        dispatch(NavigateActions.navigateTo('/home'))
      }).catch((error) => {
        console.log('Register Error', error)
        // Set error
        dispatch(RegisterActions.setRegisterError(error));
      })
    }
  }
}

export default RegisterActions;
