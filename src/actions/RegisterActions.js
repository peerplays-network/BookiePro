import AppActions from './AppActions';
import { RegisterStatus, ActionTypes } from '../constants';
import { AccountService, KeyGeneratorService} from '../services';
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

      // Generate key pairs from the account name and password
      let keys = KeyGeneratorService.generateKeys(accountName, password);

      AccountService.registerThroughFaucet(1, accountName, keys).then((result) => {
        // Get full account
        return FetchChain('getAccount', accountName);
      }).then((account) => {
        // Set register status to done
        dispatch(RegisterActions.setRegisterStatus(RegisterStatus.DONE));
        // Save account information
        dispatch(AppActions.setAccount(account));
        // After some delay navigate to home page
        setTimeout(() => {
          dispatch(NavigateActions.navigateTo('/home'))
          // Set back register status to default
          dispatch(RegisterActions.setRegisterStatus(RegisterStatus.DEFAULT));
        }, 2000);

      }).catch((error) => {
        // Set error
        dispatch(RegisterActions.setRegisterError(error));
      })
    }
  }
}

export default RegisterActions;
