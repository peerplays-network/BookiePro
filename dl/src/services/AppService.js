/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import {Apis} from "peerplaysjs-ws";
import {ChainStore} from "peerplaysjs-lib";
import iDB from "idb-instance";

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
                        store.dispatch(AppActions.setStatus("reconnect"));
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

                db = iDB.init_instance(window.openDatabase ? (shimIndexedDB || indexedDB) : indexedDB).init_promise;

                db.then(() => {

                    store.dispatch(AppActions.setAppLocalDbInit(true));

                    return Promise.all([]).then(()=> {

                        store.dispatch(AppActions.setAppLocalDbLoad(true));

                        ChainStore.init()
                            .then(() => {

                                listenChainStore(ChainStore, store);

                                if (RememberMeService.checkRememberMeIsEnable() && RememberMeService.checkNeedResetWallet()) {

                                    store.dispatch(AppActions.logout());
                                    store.dispatch(AppActions.setAppChainIsInit(true));

                                } else {

                                    AccountLoginService.checkLoginAccount().then((account) => {

                                        if (account) {

                                            WalletService.checkEnableWallet().then((isEnable) => {

                                                if (isEnable) {

                                                    Promise.all([WalletService.getDBKeys(), WalletService.getDBWallet()]).then(([keys, wallet]) => {

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

                                            if(!store.getState().walletData.wallet &&
                                                (!/\/login/.test(window.location.hash) &&
                                                !/\/claims\/bts/.test(window.location.hash) &&
                                                !/\/sign-up/.test(window.location.hash) &&
                                                !/\/about/.test(window.location.hash) &&
                                                !/\/explorer/.test(window.location.hash) &&
                                                !/\/exchange/.test(window.location.hash))) {

                                                store.dispatch(AppActions.logout());

                                            }
                                            store.dispatch(AppActions.setAppChainIsInit(true));
                                        }

                                    })

                                }

                            }).catch(error => {
                                console.error("----- ChainStore INIT ERROR ----->", error, (new Error).stack);
                                store.dispatch(AppActions.setAppSyncFail(true));
                                store.dispatch(AppActions.setShowCantConnectStatus(true));

                            });

                    });
                });

            } catch(err) {
                console.error("DB init error:", err);
                store.dispatch(AppActions.setAppSyncFail(true));
                store.dispatch(AppActions.setShowCantConnectStatus(true));
            }

        }).catch(error => {
            console.error("----- App INIT ERROR ----->", error, (new Error).stack);
        });

    }

}

export default AppService;