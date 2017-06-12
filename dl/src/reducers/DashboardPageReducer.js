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

import {
    DASHBOARD_CHANGE_SIDE,
    DASHBOARD_SET_BALANCES,
    DASHBOARD_UPDATE,
    DASHBOARD_TOGGLE_SHOW_HIDDEN_ASSETS,
    DASHBOARD_SET_RECENT_ACTIVITY,
    DASHBOARD_SET_OPEN_ORDERS,
    DASHBOARD_SET_SIDE_VESTING_BALANCES,
    DASHBOARD_SET_SIDE_MEMBER
    } from '../constants/ActionTypes';


/**
 * Dashboard Reducer is used to controlling dashboard page
 *
 * Initial state
 *
 * @type {{precision: number, decimals: number, coreSymbol, assetSymbol, coreToken: (*), fiat: (*), cryptoTokens: (*), smartCoins: (*), otherAssets: (*), showHiddenAssets: boolean, recentActivity: Array, openOrders: Array, headBlockNumber: null, blockInterval: null, availableBalances: {}, vestingBalancesIds: Array, vestingBalances: (*), vestingAsset: null, memberAccount: null}}
 */
let defaultState = {

    /**
     * Dashboard Data
     */
    precision: 4,
    decimals: 4,

    coreSymbol: CORE_ASSET,
    assetSymbol: CORE_ASSET,

    coreToken: Immutable.List(),
    fiat: Immutable.List(),
    cryptoTokens: Immutable.List(),
    smartCoins: Immutable.List(),
    otherAssets: Immutable.List(),

    showHiddenAssets: false,

    recentActivity: [],
    openOrders: [],
    headBlockNumber: null,
    blockInterval: null,

    availableBalances: {},

    /**
     * Vesting balance Side
     */
    vestingBalancesIds: [],
    vestingBalances: Immutable.Map(),
    vestingAsset: null,

    /**
     * Member account
     */
    memberAccount: null
};

export default function (state = defaultState, action) {
    switch (action.type) {
        /**
         * Dashboard Side: set vesting balances
         */
        case DASHBOARD_SET_SIDE_VESTING_BALANCES:
            return {
                ...state,
                vestingBalancesIds: action.payload.vestingBalancesIds,
                vestingBalances: action.payload.vestingBalances,
                vestingAsset: action.payload.vestingAsset
            };
        /**
         * Dashboard Side: set controlled member account
         *
         *  For this account we control the change of type
         */
        case DASHBOARD_SET_SIDE_MEMBER:
            return {
                ...state,
                memberAccount: action.payload.memberAccount
            };
        /**
         *  Dashboard Side: Set available balances
         */
        case DASHBOARD_CHANGE_SIDE:
            return Object.assign({}, state, {
                availableBalances: action.payload.availableBalances
            });

        /**
         * set data for balances
         */
        case DASHBOARD_SET_BALANCES:
            return Object.assign({}, state, {
                coreToken: action.payload.coreToken,
                fiat: action.payload.fiat,
                cryptoTokens: action.payload.cryptoTokens,
                smartCoins: action.payload.smartCoins,
                otherAssets: action.payload.otherAssets,
                lastBlock: action.payload.lastBlock,

                coreSymbol: action.payload.coreSymbol,
                assetSymbol: action.payload.assetSymbol,
                decimals: action.payload.decimals,
                precision: action.payload.precision
            });

        case DASHBOARD_UPDATE:
            return Object.assign({}, state, action.payload);
        /**
         * Show hidden assets button status
         */
        case DASHBOARD_TOGGLE_SHOW_HIDDEN_ASSETS:
            return Object.assign({}, state, {
                showHiddenAssets: action.payload.showHiddenAssets
            });
        /**
         * Set recent activity page data
         */
        case DASHBOARD_SET_RECENT_ACTIVITY:
            return Object.assign({}, state, {
                recentActivity: action.payload.recentActivity,
                headBlockNumber: action.payload.headBlockNumber,
                blockInterval: action.payload.blockInterval
            });
        /**
         * Set open orders list
         */
        case DASHBOARD_SET_OPEN_ORDERS:
            return Object.assign({}, state, {
                openOrders: action.payload.openOrders
            });
        default:
            /**
             * We return the previous state in the default case
             */
            return state
    }

};
