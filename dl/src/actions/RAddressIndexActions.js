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

import iDB from "../idb-instance";
import * as Types from "../constants/ActionTypes";
import {key} from "peerplaysjs-lib";

let timeout;


export default class AddressIndexActions {

    /**
     * add pub key
     *
     * @param publicKey
     * @returns {function(*=, *)}
     */
    static add(publicKey) {
        let self = this;

        return (dispatch, getState)=> {
            dispatch(self.load()).then(() => {
                let dirty = false,
                    {pubkeys, saving, addresses} = getState().addressIndex;

                if (pubkeys.has(publicKey)){
                    return;
                }

                let pubKeys = new Set();

                pubkeys.forEach(v => {
                    pubKeys.add(v);
                });

                pubKeys.add(publicKey);

                dispatch({
                    type : Types.SET_ADDRESS_INDEXES_PUBKEYS,
                    payload : pubKeys,
                });

                if (saving){
                    return;
                }

                dispatch({
                    type: Types.SET_ADDRESS_INDEXES_SAVING_STATUS,
                    payload: true,
                });

                // Gather all 5 legacy address formats (see key.addresses)
                var address_strings = key.addresses(publicKey);

                for(let address of address_strings) {
                    addresses.set(address, publicKey);
                    dirty = true
                }

                if( dirty ) {
                    dispatch({
                        type : Types.SET_ADDRESS_INDEXES,
                        payload : addresses,
                    });

                    clearTimeout(timeout);

                    timeout = setTimeout(()=> {
                        dispatch({
                            type: Types.SET_ADDRESS_INDEXES_SAVING_STATUS,
                            payload: false,
                        });

                        return iDB.root.setProperty("AddressIndex", addresses.toObject())
                    }, 100)
                } else {
                    dispatch({
                        type: Types.SET_ADDRESS_INDEXES_SAVING_STATUS,
                        payload: false,
                    });
                }
            }).catch(e => {
                throw e;
            })
        };
    }

}