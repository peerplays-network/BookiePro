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

import {
    APP_LOCAL_DB_IS_INIT,
    APP_LOCAL_DB_DATA_IS_LOAD,
    APP_CHAIN_IS_INIT,
    APP_SET_SYNC_FAIL,
    APP_LOGIN,
    APP_LOGOUT,
    APP_CURRENT_LOCATION,
    APP_SET_STATUS,
    APP_SET_SHOW_CANT_CONNECT_MODAL
    } from '../constants/ActionTypes';

/**
 * AppReducer is used to controling an application state
 *
 * Initial state
 *
 * @type {{dbIsInit: boolean, dbDataIsLoad: boolean, chainIsInit: boolean, syncIsFail: boolean, isLogin: boolean, account: null, accountId: null, currentLocation: null, status: null, showCantConnectModal: boolean}}
 */
let defaultState = {
    /**
     * iDB.init_instance() is init
     */
    dbIsInit: false,
    /**
     * iDB.init_instance() is load
     */
    dbDataIsLoad: false,//TODO::rm
    /**
     * ChainStore.init() Success status
     */
    chainIsInit: false,
    /**
     * ChainStore.init() failed status
     */
    syncIsFail: false,
    /**
     * Account is login
     */
    isLogin: false,
    /**
     * current account name
     */
    account: null,
    /**
     * current account id
     */
    accountId: null,
    /**
     * current app location(from file LocationConstants);
     */
    currentLocation: null,
    /**
     * global app status "reconnect"|null
     */
    status: null,
    /**
     * Show cant connect modal window or no
     */
    showCantConnectModal: false
};

export default function (state = defaultState, action) {
    switch (action.type) {
        /**
         * Show cant connect modal window or no
         */
        case APP_SET_SHOW_CANT_CONNECT_MODAL:
            return Object.assign({}, state, {
                showCantConnectModal: action.payload.showCantConnectModal
            });
        /**
         * global app status "reconnect"|null
         */
        case APP_SET_STATUS:
            return Object.assign({}, state, {
                status: action.payload.status
            });
        /**
         * iDB.init_instance() is init
         */
        case APP_LOCAL_DB_IS_INIT:
            return Object.assign({}, state, {
                dbIsInit: action.dbIsInit
            });
        /**
         * iDB.init_instance() is load
         */
        case APP_LOCAL_DB_DATA_IS_LOAD://TODO::rm
            return Object.assign({}, state, {
                dbDataIsLoad: action.dbDataIsLoad
            });
        /**
         * ChainStore.init() Success status
         */
        case APP_CHAIN_IS_INIT:
            return Object.assign({}, state, {
                chainIsInit: action.chainIsInit
            });
        /**
         * ChainStore.init() fail status
         */
        case APP_SET_SYNC_FAIL:
            return Object.assign({}, state, {
                syncIsFail: action.syncIsFail
            });
        /**
         * login in app
         */
        case APP_LOGIN:
            return Object.assign({}, state, {
                isLogin: action.payload.isLogin,
                account: action.payload.account,
                accountId: action.payload.accountId
            });
        /**
         * logout from app
         */
        case APP_LOGOUT:
            return Object.assign({}, state, {
                isLogin: action.payload.isLogin,
                account: action.payload.account,
                accountId: action.payload.accountId
            });
        /**
         * SET CURRENT LOCATION FROM PageConstants.js file
         */
        case APP_CURRENT_LOCATION:
            return Object.assign({}, state, {
                currentLocation: action.payload.currentLocation
            });
        default:
            /**
             * We return the previous state in the default case
             */
            return state
    }

};