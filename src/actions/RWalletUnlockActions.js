import ActionTypes from '../constants/ActionTypes';

class RWalletUnlockActions {
  /**
   * Action Creator (SET_POSITION)
   * Show|Hide Unlock modal
   * TODO::rm
   * @param status
   * @returns {function(*, *)}
   */
  static setWalletPosition(status) {
    return (dispatch, getState) => {
      dispatch({
        type: ActionTypes.SET_POSITION,
        payload: status
      });
      return getState().wallet.locked;
    };
  }

  /**
   * Action creator (SET_LOCK_STATUS)
   * Wallet is closed or not
   * @param status
   * @returns {function(*)}
   */
  static setWalletStatus(status) {
    return (dispatch) => {
      return dispatch({
        type: ActionTypes.SET_LOCK_STATUS,
        payload: status
      });
    };
  }
}

export default RWalletUnlockActions;