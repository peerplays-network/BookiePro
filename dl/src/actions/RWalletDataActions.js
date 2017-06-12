/*
 * Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {
    WD_UPDATE_WALLET,
    WD_SET_AES_PRIVATE,
    WD_RESET
} from "../constants/ActionTypes";

import {remove_from_store, reset_table} from 'idb-instance';
import {ChainStore, PrivateKey, key, Aes, hash} from "peerplaysjs-lib";
import {cloneDeep} from "lodash";
import {Apis, ChainConfig} from "peerplaysjs-ws";

let dictJson;
if (__ELECTRON__) {
    dictJson = require("json!common/dictionary_en.json");
}

export default class WalletDataActions {


    /**
     * Action Creator (WD_RESET)
     * Reset Wallet data reducer
     * @returns {{type, payload: null}}
     */
    static resetWalletData() {
        return {
            type: WD_RESET,
            payload: null,
        }
    }

    /**
     * Action Creator (WD_UPDATE_WALLET)
     * Update Wallet data
     *
     * @param wallet
     * @returns {{type: string, payload: *}}
     */
    static updateWalletData(wallet) {
        return {
            type: WD_UPDATE_WALLET,
            payload: wallet
        }
    }

}
/**
 * Action Creator (WD_SET_AES_PRIVATE)
 * Change wallet AES
 *
 * @param aesPrivate
 * @returns {function(*)}
 */
export function setAesPrivate(aesPrivate) {
    return (dispatch) => {
        dispatch({
            type: WD_SET_AES_PRIVATE,
            payload: aesPrivate
        });
    }
}