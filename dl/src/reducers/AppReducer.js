import {ActionTypes} from '../constants/ActionTypes';

/**
 * AppReducer is used to controling an application state
 *
 * Initial state
 *
 * @type {{dbIsInit: boolean, dbDataIsLoad: boolean, chainIsInit: boolean, syncIsFail: boolean, isLogin: boolean, account: null, accountId: null, currentLocation: null, status: null, showCantConnectModal: boolean}}
 */
let defaultState = {
  // iDB.init_instance() is init
  dbIsInit: false,
  // iDB.init_instance() is load
  dbDataIsLoad: false, //TODO::rm
  // ChainStore.init() Success status
  chainIsInit: false,
  // ChainStore.init() failed status
  syncIsFail: false,
  // Account is login
  isLogin: false,
  // current account name
  account: null,
  // current account id
  accountId: null,
  // current app location(from file LocationConstants);
  currentLocation: null,
  // global app status "reconnect"|null
  status: null,
  // Show cant connect modal window or no
  showCantConnectModal: false
};

export default function (state = defaultState, action) {
  switch (action.type) {
    // Show cant connect modal window or no
    case ActionTypes.APP_SET_SHOW_CANT_CONNECT_MODAL:
      return Object.assign({}, state, {
        showCantConnectModal: action.payload.showCantConnectModal
      });
      // global app status "reconnect"|null
    case ActionTypes.APP_SET_STATUS:
      return Object.assign({}, state, {
        status: action.payload.status
      });
      // iDB.init_instance() is init
    case ActionTypes.APP_LOCAL_DB_IS_INIT:
      return Object.assign({}, state, {
        dbIsInit: action.dbIsInit
      });
      // iDB.init_instance() is load
    case ActionTypes.APP_LOCAL_DB_DATA_IS_LOAD: //TODO::rm
      return Object.assign({}, state, {
        dbDataIsLoad: action.dbDataIsLoad
      });
      // ChainStore.init() Success status
    case ActionTypes.APP_CHAIN_IS_INIT:
      return Object.assign({}, state, {
        chainIsInit: action.chainIsInit
      });
      // ChainStore.init() fail status
    case ActionTypes.APP_SET_SYNC_FAIL:
      return Object.assign({}, state, {
        syncIsFail: action.syncIsFail
      });
      // login in app
    case ActionTypes.APP_LOGIN:
      return Object.assign({}, state, {
        isLogin: action.payload.isLogin,
        account: action.payload.account,
        accountId: action.payload.accountId
      });
      // logout from app
    case ActionTypes.APP_LOGOUT:
      return Object.assign({}, state, {
        isLogin: action.payload.isLogin,
        account: action.payload.account,
        accountId: action.payload.accountId
      });
      // SET CURRENT LOCATION FROM PageConstants.js file
    case ActionTypes.APP_CURRENT_LOCATION:
      return Object.assign({}, state, {
        currentLocation: action.payload.currentLocation
      });
    default:
      // We return the previous state in the default case
      return state;
  }
}