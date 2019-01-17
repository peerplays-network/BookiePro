import {PrivateKey} from 'peerplaysjs-lib';
import RWalletUnlockNewActions from 'actions/RWalletUnlockNewActions';

class KeysService {

  /**
   * Get active key from reducer
   *
   * @param state
   * @param dispatch
   * @returns {Promise}
   */
  static getActiveKeyFromState(state, dispatch, role = 'active') {
    return new Promise((resolve, reject) => {
      if (state.walletData.aesPrivate) {
        let encrypted_key = state.privateKey.keys.get(role).encrypted_key,
          activePrivateKeyBuffer = state.walletData.aesPrivate.decryptHexToBuffer(encrypted_key);

        return resolve(PrivateKey.fromBuffer(activePrivateKeyBuffer));
      } else {
        dispatch(RWalletUnlockNewActions.showWalletPasswordWindow({
          isOpen: true,
          success: (aes) => {
            let encrypted_key = state.privateKey.keys.get(role).encrypted_key,
              activePrivateKeyBuffer = aes.decryptHexToBuffer(encrypted_key);

            return resolve(PrivateKey.fromBuffer(activePrivateKeyBuffer));
          },
          cancel: () => {
            reject();
          }
        }));
      }
    });
  }
}

export default KeysService;