import * as Types from '../constants/ActionTypes';

var lockTimeout;

export default class WalletActions {
  /**
   * Redux Action Creator (SET_LOCK_STATUS)
   * lock Wallet
     * @returns {function(*, *)}
     */
  static lockAccount() {
    return (dispatch, getState) => {
      clearTimeout(lockTimeout);

      if (!getState().wallet.locked) {
        dispatch({
          type: Types.SET_LOCK_STATUS,
          payload: true,
        });
      }
    };
  }

  /**
   * unlock Wallet
   *
   * @returns {function(*, *)}
   */
  static unlockAccount() {
    return (dispatch, getState) => {
      clearTimeout(lockTimeout);

      lockTimeout = setTimeout(() => {
        dispatch(WalletActions.lockAccount());
      }, getState().settings.walletLockTimeout);

      if(getState().wallet.locked) {
        dispatch({
          type: Types.SET_LOCK_STATUS,
          payload: false,
        });
      }
    };
  }

  /**
   * reset wallet data(to initial data)
  * @returns {{type, payload: null}}
  */
  static resetWallet() {
    return {
      type: Types.WALLET_RESET,
      payload: null,
    };
  }
}
