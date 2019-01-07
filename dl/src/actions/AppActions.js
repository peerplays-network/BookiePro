import {
  APP_LOCAL_DB_IS_INIT,
  APP_LOCAL_DB_DATA_IS_LOAD,
  APP_CHAIN_IS_INIT,
  APP_SET_SYNC_FAIL,
  APP_LOGIN,
  APP_LOGOUT,
  SET_CURRENT_ACCOUNT,//TODO:: remove
  APP_CURRENT_LOCATION,
  APP_SET_STATUS,
  APP_SET_SHOW_CANT_CONNECT_MODAL
} from '../constants/ActionTypes';

import NavigateActions from './NavigateActions';
import RWalletActions from './RWalletActions';
import RWalletDataActions from './RWalletDataActions';
import PrivateKeyActions from './RPrivateKeyActions';

import StorageService from 'services/StorageService';
import WalletService from 'services/WalletService';
import RememberMeService from 'services/RememberMeService';
import CryptoElectronService from '../services/CryptoElectronService';
import Repository from 'repositories/chain/repository';
import CONFIG from '../config/main';

/**
 *  Private Redux Action Creator (APP_LOGOUT)
 *  User Logout
 *
 * @returns {{type, payload: {isLogin: boolean, account: null, accountId: null}}}
 */
function logoutAction() {
  return {
    type: APP_LOGOUT,
    payload: {
      isLogin: false,
      account: null,
      accountId: null
    }
  };
}

/**
 * Private Redux Action Creator (APP_LOGIN)
 * Account Login in app
 *
 * @param {String} account
 * @param {String} accountId
 * @returns {{type, payload: {isLogin: boolean, account: String, accountId: String}}}
 */
function loginAction(account, accountId) {
  return {
    type: APP_LOGIN,
    payload: {
      isLogin: true,
      account: account,
      accountId: accountId
    }
  };
}

/**
 *  Private Redux Action Creator (APP_LOCAL_DB_IS_INIT)
 *
 * @param {boolean} dbIsInit
 * @returns {{type: (APP_LOCAL_DB_IS_INIT), dbIsInit: boolean}}
 */
function setAppLocalDbInitAction(dbIsInit) {
  return {
    type: APP_LOCAL_DB_IS_INIT,
    dbIsInit: dbIsInit
  };
}

/**
 * Private Redux Action Creator (APP_LOCAL_DB_DATA_IS_LOAD)
 *
 * @param dbDataIsLoad
 * @returns {{type: (APP_LOCAL_DB_DATA_IS_LOAD), dbDataIsLoad: boolean}}
 */
function setAppLocalDbLoadAction(dbDataIsLoad) {
  return {
    type: APP_LOCAL_DB_DATA_IS_LOAD,
    dbDataIsLoad: dbDataIsLoad
  };
}

/**
 * Private Redux Action Creator (APP_CHAIN_IS_INIT)
 *
 * @param {boolean} chainIsInit
 * @returns {{type: (APP_CHAIN_IS_INIT), chainIsInit: boolean}}
 */
function setAppChainIsInitAction(chainIsInit) {
  return {
    type: APP_CHAIN_IS_INIT,
    chainIsInit: chainIsInit
  };
}

/**
 * Private Redux Action Creator (APP_SET_SYNC_FAIL)
 *
 * @param syncIsFail
 * @returns {{type: (APP_SET_SYNC_FAIL), syncIsFail: boolean}}
 */
function setAppSyncFailAction(syncIsFail) {
  return {
    type: APP_SET_SYNC_FAIL,
    syncIsFail: syncIsFail
  };
}

/**
 * Private Redux Action Creator (APP_CURRENT_LOCATION)
 *
 * set current APP-reducer LOCATION FROM PageConstants.js File
 *
 * @param location
 * @returns {{type: (APP_CURRENT_LOCATION), currentLocation: string}}
 */
function setCurrentLocationAction(location) {
  return {
    type: APP_CURRENT_LOCATION,
    payload: {
      currentLocation: location
    }
  };
}

/**
 * Private Redux Action Creator (APP_SET_STATUS)
 *
 * @param {String} status
 * @returns {{type: APP_SET_STATUS, payload: {currentLocation: *}}}
 */
function setStatusAction(status) {
  return {
    type: APP_SET_STATUS,
    payload: {
      status: status
    }
  };
}

/**
 * Private Redux Action Creator (APP_SET_SHOW_CANT_CONNECT_MODAL)
 * Show cant connect modal window or no
 *
 * @param {boolean} show
 * @returns {{type: APP_SET_SHOW_CANT_CONNECT_MODAL, payload: {showCantConnectModal: *}}}
 */
function setShowCantConnectStatusAction(show) {
  return {
    type: APP_SET_SHOW_CANT_CONNECT_MODAL,
    payload: {
      showCantConnectModal: show
    }
  };
}

class AppActions {
  /**
 * Show cant connect modal window or no
 *
 * @param {boolean} show
 * @returns {{type, payload: {showCantConnectModal: *}}}
 */
  static setShowCantConnectStatus(show) {
    return setShowCantConnectStatusAction(show);
  }

  /**
 * Set global app status "reconnect"|null
 * if status "reconnect" - show ReconnectModal
 *
 * @param {string|null} status - null, "reconnect"
 * @returns {{type: APP_SET_STATUS, payload: {currentLocation: *}}}
 */
  static setStatus(status) {
    return setStatusAction(status);
  }

  /**
 * iDB.init_instance() is init
 *
 * @param status boolean
 * @returns {Function}
 */
  static setAppLocalDbInit(status) { //TODO::mv to setStatus
    return (dispatch) => {
      dispatch(setAppLocalDbInitAction(status));
    };
  }

  /**
 * iDB.init_instance() is load
 *
 * @param status boolean
 * @returns {Function}
 */
  static setAppLocalDbLoad(status) { //TODO::mv to setStatus
    return (dispatch) => {
      dispatch(setAppLocalDbLoadAction(status));
    };
  }

  /**
 * ChainStore.init() Success status
 *
 * @param status boolean
 * @returns {Function}
 */
  static setAppChainIsInit(status) { //TODO::mv to setStatus
    return (dispatch) => {
      dispatch(setAppChainIsInitAction(status));
    };
  }

  /**
 * ChainStore.init() failed status
 *
 * @param status boolean
 * @returns {Function}
 */
  static setAppSyncFail(status) { ////TODO::mv to setStatus
    return (dispatch) => {
      dispatch(setAppSyncFailAction(status));
    };
  }

  /**
 * login in app-Reducer
 *
 * @param {Object} account {name: String, id: String}
 * @returns {function(*)}
 */
  static login(account) {
    return (dispatch) => {
      dispatch(loginAction(account.name, account.id));
      //TODO::remove legacy
      dispatch({
        type : SET_CURRENT_ACCOUNT,
        payload : account.name
      });
      //TODO::end remove legacy
      StorageService.set('currentAccount', account.name);
    };
  }

  /**
 * Reducer: SET CURRENT APP-reducer LOCATION FROM PageConstants.js file
 *
 * @param {String} location - PageConstants.js
 * @returns {Function}
 */
  static setCurrentLocation(location) {
    return (dispatch) => {
      dispatch(setCurrentLocationAction(location));
    };
  }

  /**
 *  Reducer: APP Logout action
 *
 * @returns {Function}
 */
  static logout() {
    return (dispatch) => {
      StorageService.remove('currentAccount');
      RememberMeService.resetRememberMe();
      Repository.resetCache();

      if (CONFIG.__ELECTRON__) {
        CryptoElectronService.removeElectronAes();
      }

      dispatch(PrivateKeyActions.setKeys());

      return WalletService.resetDBTables().then(() => {
        dispatch(logoutAction());
        dispatch(RWalletActions.resetWallet());
        dispatch(RWalletDataActions.resetWalletData());
        dispatch(NavigateActions.navigateToSignIn());
      });
    };
  }
}

export default AppActions;