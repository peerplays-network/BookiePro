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
    ADD_CONNECTION,
    REMOVE_CONNECTION,
    SETTINGS_CLAIM_SET_BALANCES_DATA,
    SETTINGS_CLAIM_SET_KEY_ERROR,
    SETTINGS_CLAIM_RESET,
    SETTINGS_CLAIM_RESET_BALANCES,
    SETTINGS_CLAIM_SET_PRIVATE_KEY
} from '../constants/ActionTypes';

import {getViewSettings, setViewSettings} from "services/ViewSettingsService";
import Immutable from "immutable";

let activeSetting = getViewSettings('activeSetting') ? getViewSettings('activeSetting') : 'general';
let connection = getViewSettings('connection') ? getViewSettings('connection') : [BLOCKCHAIN_URL];

/**
 *  Page Settings Reducer is used to controlling Settings page tabs
 *
 * Initial State
 *
 * @type {{activeSetting: string, connection: [*], menuEntries: [*], settingEntries: {general: [*], access: [*]}, defaults: {showSettles: [*], disableChat: [*], connection: *, faucetAddress: *}, claim_error: null, claim_privateKey: null, claim_balances: (*)}}
 */
const initialState = {

    /* Active menu item (Sub menu)*/

    activeSetting: activeSetting,
    /**
     * Current connection
     */
    connection: connection,

    /**
     * Tabs
     */
    menuEntries: [
        "general",
        "password",
        "permissions",
        "API access"
    ],
    settingEntries: {
        general: ["locale", "showSettles", "disableChat"],
        access: ["connection", "faucetAddress"]
    },
    /**
     * Default settings
     */
    defaults: {
        showSettles: [
            {translate: "yes"},
            {translate: "no"}
        ],
        disableChat: [
            {translate: "yes"},
            {translate: "no"}
        ],
        connection: BLOCKCHAIN_URL,
        faucetAddress: FAUCET_URL,

    },

    /**
     * Claim page(sharedrop page)
     */
    claim_error: null,
    claim_privateKey: null,
    claim_balances: Immutable.List()

};

export default function (state = initialState, action) {

    switch (action.type) {

        case ADD_CONNECTION:
            return Object.assign({}, state, {
                connection : state.connection.concat(action.payload)
            });
        case REMOVE_CONNECTION:
            return Object.assign({}, state, {
                connection : state.connection.filter(e => e != action.payload)
            });


        /**
         * Sharedrop page claim
         */

        /**
         * set common key error(field Owner Key)
         */
        case SETTINGS_CLAIM_SET_KEY_ERROR:
            return Object.assign({}, state, {
                claim_error: action.payload.claim_error
            });

        /**
         * reset page
         */
        case SETTINGS_CLAIM_RESET:
            return Object.assign({}, state, {
                claim_error: null,
                claim_privateKey: null,
                claim_balances: Immutable.List()
            });
        /**
         * reset balances list only(without owner key)
         */
        case SETTINGS_CLAIM_RESET_BALANCES:
            return Object.assign({}, state, {
                claim_balances: Immutable.List()
            });
        /**
         * Set key with which we will work
         */
        case SETTINGS_CLAIM_SET_PRIVATE_KEY:
            return Object.assign({}, state, {
                claim_privateKey: action.payload.claim_privateKey
            });
        /**
         * set claim balances list
         */
        case SETTINGS_CLAIM_SET_BALANCES_DATA:
            return Object.assign({}, state, {
                claim_balances: action.payload.claim_balances
            });
        default:
            /**
             * We return the previous state in the default case
             */
            return state
    }

};
