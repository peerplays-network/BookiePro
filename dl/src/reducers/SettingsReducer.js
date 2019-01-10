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

import Immutable from "immutable";
import * as Types from '../constants/ActionTypes';
import CONFIG from '../config/main';

import { getViewSettings } from "services/ViewSettingsService";
import { merge } from "lodash";

const CORE_ASSET = CONFIG.CORE_ASSET;
/**
 * Settings reducer is used to controlling Site settings
 *
 * Initial State
 *
 * @type {{locale: string, showSettles: boolean, disableChat: boolean, ownerKeyPermissions: null, connection: *, faucetAddress: *, unit: *, defaults: {locale: [*], unit: [*], preferredBases: [*], topMarkets: [*]}, hiddenAssets: (*)}}
 */

const initialState = {
    /*general*/
    locale: 'en',
    showSettles: false,
    disableChat: false,
    /*permissions*/
    ownerKeyPermissions: null,
    /*API access*/
    connection: BLOCKCHAIN_URL[0],
    faucetAddress: FAUCET_URL[0],
    unit: CORE_ASSET,
    defaults : {
        locale: [
            "en",
            "cn",
            // "fr",
            // "ko",
            // "de",
            // "es",
            // "tr"
        ],
        unit: [
            CORE_ASSET,
            //"SMARTSMART"
            // "CNY",
            //  "PIXEL.BITCOIN"
            // "EUR",
            // "GBP"
        ],
        preferredBases: [CORE_ASSET, "PIXEL.BITCOIN", "PIXEL.STEEM"],
        topMarkets: [
            "PIXEL.BITCOIN", "PIXEL.STEEM", "BTS", "OPEN.ETH", "ICOO", "BTC", "OPEN.LISK",
            "OPEN.STEEM", "OPEN.DAO", "PEERPLAYS", "USD", "CNY", "BTSR", "OBITS",
            "OPEN.DGD", "EUR", "TRADE.BTC", "CASH.BTC", "GOLD", "SILVER"
        ]
    },
    hiddenAssets : Immutable.List([])

};


export default function (state = initialState, action) {
    switch (action.type) {
        /**
         * Set initial settings
         */
        case Types.INIT_SETTINGS:
            return Object.assign({}, state, action.payload.newSettings);
        /**
         * Change settings language
         */
        case Types.SWITCH_LOCALE:
            return Object.assign({}, state, {
                locale: action.payload
            });
        /**
         * show|hide settles
         */
        case Types.CHANGE_SETTLE_STATUS:
            return Object.assign({}, state, {
                showSettles: action.payload
            });
        /**
         * show|hide chat
         */
        case Types.CHANGE_CHAT_STATUS:
            return Object.assign({}, state, {
                disableChat: action.payload
            });
        /**
         * change unit //TODO::rm
         */
        case Types.CHANGE_UNIT:
            return Object.assign({}, state, {
                unit: action.payload
            });
        /**
         * change hidden assets
         */
        case Types.CHANGE_HIDDEN_ASSETS:
            return Object.assign({}, state, {
                hiddenAssets : action.payload
            });
        /**
         * add OwnerKey Permissions TODO::rm
         */
        case Types.ADD_OWNER_KEY:
            return {
              ...state,
              ownerKeyPermissions: state.ownerKeyPermissions ? state.ownerKeyPermissions.concat(action.payload) : action.payload
            };
        default:
            /**
             * We return the previous state in the default case
             */
            return state;
    }

};
