import { ActionTypes } from '../constants';

class AppActions {
  static setAccount(account) {
    return {
      type: ActionTypes.APP_SET_ACCOUNT,
      account
    }
  }
}

export default AppActions;
