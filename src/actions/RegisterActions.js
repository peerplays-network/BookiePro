import AppActions from './AppActions';
import AccountActions from './AccountActions';
import { LoadingStatus, ActionTypes } from '../constants';
import { AccountService, KeyGeneratorService } from '../services';
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

  static setRegisterErrorAction(errors) {
    return {
      type: ActionTypes.REGISTER_SET_ERROR,
      errors:errors
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

      const keys = KeyGeneratorService.generateKeys(accountName, password);
      AccountService.registerThroughFaucet(1, accountName, keys).then(() => {
        // Get full account
        return FetchChain('getAccount', accountName);
      }).then((account) => {
        // Save account information
        dispatch(AppActions.setAccount(account));

        // Save keys
        dispatch(AccountActions.setKeysAction(keys));

        // Set is logged in
        dispatch(AppActions.setIsLoggedInAction(true));

        // Set register status to done
        dispatch(RegisterPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));

        // After some delay navigate to home page
        dispatch(NavigateActions.navigateTo('/exchange'));
        
      }).catch((error) => {
        // Set error
        /**
        * AccountService.registerThroughFaucet - Error from this call returns as a promise
        * FetchChain('getAccount', accountName) - Error from call returns as a string
        * Hence, type checking is done and the 'error' state is converted to an array containing the errors
        */
        dispatch(RegisterPrivateActions.setRegisterErrorAction([typeof error === 'string'? error
              : typeof error === 'object' && error.message ? error.message : 'Error Occured']))
      })
    }
  }
}

export default RegisterActions;
