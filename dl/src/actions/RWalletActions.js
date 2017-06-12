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

import * as Types from "../constants/ActionTypes";

var lockTimeout;


export default class WalletActions {

    /**
	 * Redux Action Creator (SET_LOCK_STATUS)
	 * lock Wallet
     * @returns {function(*, *)}
     */
	static lockAccount() {
		return (dispatch, getState) => {
			clearTimeout(lockTimeout);

			if(!getState().wallet.locked) {
				dispatch({
					type: Types.SET_LOCK_STATUS,
					payload: true,
				});
			}
		}
	}

    /**
	 * unlock Wallet
	 *
     * @returns {function(*, *)}
     */
	static unlockAccount() {
		return (dispatch, getState) => {
			clearTimeout(lockTimeout);

			lockTimeout = setTimeout(() => {
				dispatch(WalletActions.lockAccount());
			}, getState().settings.walletLockTimeout);

			if(getState().wallet.locked) {
				dispatch({
					type: Types.SET_LOCK_STATUS,
					payload: false,
				});
			}
		}
	}

    /**
	 * reset wallet data(to initial data)
     * @returns {{type, payload: null}}
     */
    static resetWallet() {
        return {
            type: Types.WALLET_RESET,
            payload: null,
        }
	}
}
