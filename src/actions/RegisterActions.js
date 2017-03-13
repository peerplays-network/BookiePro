import AppActions from './AppActions';
import { LoadingStatus, ActionTypes } from '../constants';
import { AccountService } from '../services';
import { FetchChain } from 'graphenejs-lib';
import NavigateActions from './NavigateActions';

/**
 * Private actions
 */
class RegisterPrivateActions {
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.REGISTER_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static setRegisterErrorAction(error) {
    return {
      type: ActionTypes.REGISTER_SET_ERROR,
      error
    }
  }
}

/**
 * Public actions
 */
class RegisterActions {

  static signup(accountName, password) {

    return (dispatch) => {
      // Set register status to loading
      dispatch(RegisterPrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      AccountService.registerThroughFaucet(1, accountName, password).then(() => {
        console.log('Register Success');
        // Get full account
        return FetchChain('getAccount', accountName);
      }).then((account) => {
        console.log('Get Account for Register Success', account);
        // Set register status to done
        dispatch(RegisterPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
        // Set is logged in
        dispatch(AppActions.setIsLoggedInAction(true));
        // Save account information
        dispatch(AppActions.setAccount(account));
        // After some delay navigate to home page
        dispatch(NavigateActions.navigateTo('/home'))
      }).catch((error) => {
        console.log('Register Error', error)
        // Set error
        dispatch(RegisterPrivateActions.setRegisterErrorAction(error));
      })
    }
  }
}

export default RegisterActions;
