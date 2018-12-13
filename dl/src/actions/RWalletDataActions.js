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