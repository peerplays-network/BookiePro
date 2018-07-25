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
    SHOW_WALLET_PASSWORD_WINDOW,
    RESET_WALLET_PASSWORD_WINDOW
    } from '../constants/ActionTypes';

import KeysService from "services/KeysService";

class RWalletUnlockNewActions {

    /**
     * Action Creator (SHOW_WALLET_PASSWORD_WINDOW)
     * Show|Hide Unlock modal //here we work with promises
     *
     * @param data Object
     * @returns {Function}
     */
    static showWalletPasswordWindow(data) {
        return (dispatch) => {

            dispatch({
                type: SHOW_WALLET_PASSWORD_WINDOW,
                payload: data
            });

        }
    }


    /**
     * Action Creator (RESET_WALLET_PASSWORD_WINDOW)
     * reset Unlock modal //here we work with promises
     * @returns {Function}
     */
    static resetWalletPasswordWindow() {

        return (dispatch) => {

            dispatch({
                type: RESET_WALLET_PASSWORD_WINDOW,
                payload: null
            });

        }
    }

    /**
     * Get current Active key from state
     *
     * @returns {Function}
     */
    static getKeyFromState(role) {

        return (dispatch, getState) => {

            return KeysService.getActiveKeyFromState(getState(), dispatch, role);

        }
    }

}

export default RWalletUnlockNewActions;