import {
  WD_UPDATE_WALLET,
  WD_SET_AES_PRIVATE,
  WD_RESET
} from '../constants/ActionTypes';

export default class WalletDataActions {
  /**
   * Action Creator (WD_RESET)
   * Reset Wallet data reducer
   * @returns {{type, payload: null}}
   */
  static resetWalletData() {
    return {
      type: WD_RESET,
      payload: null,
    };
  }

  /**
   * Action Creator (WD_UPDATE_WALLET)
   * Update Wallet data
   *
   * @param wallet
   * @returns {{type: string, payload: *}}
   */
  static updateWalletData(wallet) {
    return {
      type: WD_UPDATE_WALLET,
      payload: wallet
    };
  }
}

/**
 * Action Creator (WD_SET_AES_PRIVATE)
 * Change wallet AES
 *
 * @param aesPrivate
 * @returns {function(*)}
 */
export function setAesPrivate(aesPrivate) {
  return (dispatch) => {
    dispatch({
      type: WD_SET_AES_PRIVATE,
      payload: aesPrivate
    });
  };
}