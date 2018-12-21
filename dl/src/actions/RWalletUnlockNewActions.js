import ActionTypes from '../constants/ActionTypes';

import KeysService from 'services/KeysService';

class RWalletUnlockNewActions {

  /**
   * Action Creator (SHOW_WALLET_PASSWORD_WINDOW)
   * Show|Hide Unlock modal //here we work with promises
   *
   * @param data Object
   * @returns {Function}
   */
  static showWalletPasswordWindow(data) {
    return (dispatch) => {
      dispatch({
        type: ActionTypes.SHOW_WALLET_PASSWORD_WINDOW,
        payload: data
      });
    };
  }


  /**
   * Action Creator (RESET_WALLET_PASSWORD_WINDOW)
   * reset Unlock modal //here we work with promises
   * @returns {Function}
   */
  static resetWalletPasswordWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionTypes.RESET_WALLET_PASSWORD_WINDOW,
        payload: null
      });
    };
  }

  /**
 * Get current Active key from state
 *
 * @returns {Function}
 */
  static getKeyFromState(role) {
    return (dispatch, getState) => {
      return KeysService.getActiveKeyFromState(getState(), dispatch, role);
    };
  }
}

export default RWalletUnlockNewActions;