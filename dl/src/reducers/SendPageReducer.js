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

import { SEND_PAGE_UPDATE, SEND_PAGE_SET_SYMBOL } from "../constants/ActionTypes";
import Immutable from "immutable";

/**
 * This reducer is used to controlling a Send page
 *
 * Initial State
 *
 * @type {{head_block_number: number, block_interval: number, last_irreversible_block_num: number, recently_missed_count: number, time: null, coreAsset: {}, balance: (Immutable.Map<K, V>|*|Immutable.Map<string, V>), symbols: Array, assets: Array, accountId: null, history: Array, historyAssets: (Immutable.Set<T>|Immutable.Set<any>|*), selectedSymbol}}
 */
let initialState = {
    head_block_number: 0,
    block_interval: 0,
    last_irreversible_block_num: 0,
    recently_missed_count: 0,
    time: null,
    coreAsset: {},
    balance: Immutable.Map(),
    symbols: [],
    assets: [],
    accountId: null,
    history: [],
    historyAssets: Immutable.Set(),
    selectedSymbol: CORE_ASSET
};

export default function (state = initialState, action) {
    switch (action.type) {
        /**
         * Set page data
         */
        case SEND_PAGE_UPDATE:
            return Object.assign({}, state, {
                head_block_number: action.payload.head_block_number,
                block_interval: action.payload.block_interval,
                last_irreversible_block_num: action.payload.last_irreversible_block_num,
                recently_missed_count: action.payload.recently_missed_count,
                time: action.payload.time,
                coreAsset: action.payload.coreAsset,
                balance: action.payload.balance,
                symbols: action.payload.symbols,
                assets: action.payload.assets,
                accountId: action.payload.accountId,
                history: action.payload.history,
                historyAssets: action.payload.historyAssets
            });
        /**
         * Page assets <select> symbol
         */
        case SEND_PAGE_SET_SYMBOL:
            return Object.assign({}, state, {
                selectedSymbol: action.payload
            });
        default:
            /**
             * We return the previous state in the default case
             */
            return state
    }

};
