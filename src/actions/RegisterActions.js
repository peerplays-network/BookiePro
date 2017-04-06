import AppActions from './AppActions';
import AccountActions from './AccountActions';
import LoginActions from './LoginActions';
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
      errors
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
        // Log the user in
        return dispatch(LoginActions.loginWithKeys(accountName, keys));
      }).then(() => {
        // Set register status to done
        dispatch(RegisterPrivateActions.setLoadingStatusAction(LoadingStatus.DONE));

        // After some delay navigate to home page
        dispatch(NavigateActions.navigateTo('/deposit'));
      }).catch((error) => {
        // Set error
        dispatch(RegisterPrivateActions.setRegisterErrorAction([error.message ? error.message : 'Error Occured']))
      })
    }
  }
}

export default RegisterActions;
