import {WD_UPDATE_WALLET} from '../constants/ActionTypes';
import PrivateKeyActions from '../actions/RPrivateKeyActions';
import AppActions from '../actions/AppActions';
import WalletService from './WalletService';
import RememberMeService from './RememberMeService';
import CryptoService from './CryptoService';
import CryptoElectronService from './CryptoElectronService';
import CONFIG from '../config/main';
import {setWalletStatus} from '../actions/RWalletUnlockActions';
import {setAesPrivate} from '../actions/RWalletDataActions';

class LoginService {
  /**
   * Login user in system by BTS Sharedrop (create wallet by account, set iDB keys)
   * @param {Object} account
   * @param {string} privateKeyWif
   * @param dispatch
   */
  static systemLoginByPrivateKey(account, privateKeyWif, dispatch) {
    return WalletService.createWalletByPrivateKey(account, privateKeyWif).then((wallet) => {
      return WalletService.getDBKeys().then((keys) => {
        dispatch({
          type: WD_UPDATE_WALLET,
          payload: wallet
        });

        dispatch(PrivateKeyActions.setKeys(keys));
        dispatch(AppActions.login({
          id: account.id,
          name: account.name
        }));

        if (CONFIG.__ELECTRON__) {
          LoginService.electronLoginByPassword(privateKeyWif, wallet.encryption_key, dispatch);
        }
      });
    });
  }

  /**
   * Login user in system(create wallet by account, set iDB keys)
   * @param {string} accountId
   * @param {string} accountName
   * @param {string} password
   * @param {boolean} rememberMe
   * @param dispatch
   */
  static systemLogin(account, password, rememberMe, dispatch) {
    return WalletService.createWalletByAccount(account, password).then((wallet) => {
      return WalletService.getDBKeys().then((keys) => {
        dispatch({
          type: WD_UPDATE_WALLET,
          payload: wallet
        });

        dispatch(PrivateKeyActions.setKeys(keys));
        dispatch(AppActions.login({
          id: account.id,
          name: account.name
        }));

        if (CONFIG.__ELECTRON__) {
          LoginService.electronLoginByPassword(password, wallet.encryption_key, dispatch);
        }

        if (RememberMeService.checkRememberMeIsEnable()) {
          if (rememberMe) {
            RememberMeService.resetRememberMe();
          } else {
            RememberMeService.setRememberMe(wallet.public_name);
          }
        }
      });
    });
  }

  /**
   * Electron additional login with save AES-encryption
   *
   * @param {string} password
   * @param {string} encryption_key
   * @param dispatch
   */
  static electronLoginByPassword(password, encryption_key, dispatch) {
    let aes_private = CryptoService.getAesPrivate(password, encryption_key);
    CryptoElectronService.saveElectronEncryption(password, encryption_key);
    dispatch(setWalletStatus(false));
    dispatch(setAesPrivate(aes_private));
  }

  /**
   * Login by saved AES-encryption
   * @param dispatch
   */
  static electronLoginByEncryptedKey(dispatch) {
    let aes_private = CryptoElectronService.getElectronAes();

    if (aes_private) {
      dispatch(setWalletStatus(false));
      dispatch(setAesPrivate(aes_private));
    }
  }
}

export default LoginService;