import AppActions from './AppActions';
import { LoadingStatus, ActionTypes } from '../constants';
import { AccountService } from '../services';
import { FetchChain } from 'graphenejs-lib';
import NavigateActions from './NavigateActions';
import { Apis } from "graphenejs-ws";

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

  static setRegisterErrorAction(error = { message: ''}) {
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
        console.log(error);
        console.log('Register Error', error)
        // Set error
        /**
        * AccountService.registerThroughFaucet - Error from this call returns as a promise
        * FetchChain('getAccount', accountName) - Error from call returns as a string
        * Hence, type checking is done and the 'error' state is converted to an object
        */
        if(typeof error === 'string'){
          dispatch(RegisterPrivateActions.setRegisterErrorAction({ message: error }));
        } else if(typeof error === 'object'){
          dispatch(RegisterPrivateActions.setRegisterErrorAction(error));
        }
      })
    }
  }

  /**
   * The Peerplaysblockchain project had this async validation on the account name field
   * to check if the account name is already taken.
   * This code was present in the AccountRepository file. Since we do not have repositary files now,
   * I have included it as an action over here.
  */
  static lookupAccounts(startChar, limit) {
    return Apis.instance().db_api().exec("lookup_accounts", [
      startChar, limit
    ]);
  }
}

export default RegisterActions;
