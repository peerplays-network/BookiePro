import {Apis} from 'peerplaysjs-ws';
import {ChainStore} from 'peerplaysjs-lib';
import iDB from 'idb-instance';
import {listenChainStore} from './ChainStoreService';
import AccountLoginService from './AccountLoginService';
import LoginService from './LoginService';
import WalletService from './WalletService';
import RememberMeService from './RememberMeService';
import SettingsStorageService from './SettingsStorageService';
import ConnectManager from './ConnectManager';
import AppActions from '../actions/AppActions';
import ChainStoreHeartbeater from '../app/ChainStoreHeartbeater';
import WalletDataActions from '../actions/RWalletDataActions';
import PrivateKeyActions from '../actions/RPrivateKeyActions';
import CONFIG from '../config/main';
import {initSettings} from '../actions/RSettingsActions';

class AppService {
  /**
     * Init our app
     * @param store
     */
  static init(store) {
    let beater = new ChainStoreHeartbeater();
    beater.setHeartBeatChainStore(() => {
      store.dispatch(AppActions.setShowCantConnectStatus(true));
    });
    ChainStore.setDispatchFrequency(0);
    store.dispatch(initSettings());
    let connectionString = store.getState().settings.connection;
    ConnectManager.setDefaultRpcConnectionStatusCallback((value) => {
      if (SettingsStorageService.get('changeConnection')) {
        switch(value) {
          case 'error':
            store.dispatch(AppActions.setStatus('reconnect'));
            break;
          case 'open':
            SettingsStorageService.remove('changeConnection');
            store.dispatch(AppActions.setStatus(null));
            break;
          default:
            store.dispatch(AppActions.setStatus(null));
        }
      } else {
        switch(value) {
          case 'error':
            store.dispatch(AppActions.setShowCantConnectStatus(true));
            break;
        }
      }
    });

    ConnectManager.setDefaultConnection(connectionString).init_promise.then(() => {
      let db;

      try {
        db = iDB.init_instance(window.openDatabase
          ? (shimIndexedDB || indexedDB) // TODO: find/declare
          : indexedDB).init_promise;
        db.then(() => {
          store.dispatch(AppActions.setAppLocalDbInit(true));
          return Promise.all([]).then(()=> {
            store.dispatch(AppActions.setAppLocalDbLoad(true));
            ChainStore.init().then(() => {
              listenChainStore(ChainStore, store);

              if (
                RememberMeService.checkRememberMeIsEnable()
                && RememberMeService.checkNeedResetWallet()
              ) {
                store.dispatch(AppActions.logout());
                store.dispatch(AppActions.setAppChainIsInit(true));
              } else {
                AccountLoginService.checkLoginAccount().then((account) => {
                  if (account) {
                    WalletService.checkEnableWallet().then((isEnable) => {
                      if (isEnable) {
                        Promise.all([WalletService.getDBKeys(), WalletService.getDBWallet()])
                          .then(([keys, wallet]) => {
                            if (wallet && keys) {
                              store.dispatch(PrivateKeyActions.setKeys(keys));
                              store.dispatch(WalletDataActions.updateWalletData(wallet));
                              store.dispatch(AppActions.login(account));
                              store.dispatch(AppActions.setAppChainIsInit(true));

                              if (CONFIG.__ELECTRON__) {
                                LoginService.electronLoginByEncryptedKey(store.dispatch);
                              }
                            } else {
                              store.dispatch(AppActions.logout());
                              store.dispatch(AppActions.setAppChainIsInit(true));
                            }
                          });
                      } else {
                        store.dispatch(AppActions.logout());
                        store.dispatch(AppActions.setAppChainIsInit(true));
                      }
                    });
                  } else {
                    console.warn('[APP] ACCOUNT NOT LOGIN', account);

                    if(
                      !store.getState().walletData.wallet &&
                      (
                        !/\/login/.test(window.location.hash) &&
                        !/\/claims\/bts/.test(window.location.hash) &&
                        !/\/sign-up/.test(window.location.hash) &&
                        !/\/about/.test(window.location.hash) &&
                        !/\/explorer/.test(window.location.hash) &&
                        !/\/exchange/.test(window.location.hash)
                      )
                    ) {
                      store.dispatch(AppActions.logout());
                    }

                    store.dispatch(AppActions.setAppChainIsInit(true));
                  }
                });
              }
            }).catch((error) => {
              console.error('----- ChainStore INIT ERROR ----->', error, (new Error()).stack);
              store.dispatch(AppActions.setAppSyncFail(true));
              store.dispatch(AppActions.setShowCantConnectStatus(true));
            });
          });
        });
      } catch(err) {
        console.error('DB init error:', err);
        store.dispatch(AppActions.setAppSyncFail(true));
        store.dispatch(AppActions.setShowCantConnectStatus(true));
      }
    }).catch((error) => {
      console.error('----- App INIT ERROR ----->', error, (new Error()).stack);
    });
  }
}

export default AppService;