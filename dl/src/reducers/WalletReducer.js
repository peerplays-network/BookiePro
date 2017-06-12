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

import * as Types from '../constants/ActionTypes';

/**
 * Wallet Reducer is used to unlocking and locking the Modal window
 *
 * Initial State
 *
 * locked - Wallet is closed or not
 * isOpen - Show|Hide Unlock modal
 * success - Unlock modal: success Promise
 * cancel - Unlock modal: cancel Promise
 * @type {{locked: boolean, isOpen: boolean, success: null|Promise, cancel: null|Promise}}
 */
const initialState = {
	locked: true,
	isOpen: false,
    success: null,
    cancel: null
};

export default function (state = initialState, action){
	switch(action.type) {
        /**
		 *
         */
		case Types.SET_LOCK_STATUS:
			return Object.assign({}, state, {
				locked : action.payload
			});
        /**
		 * Show|Hide Unlock modal
         */
		case Types.SET_POSITION:
			return Object.assign({}, state, {
				isOpen : action.payload
			});
        /**
		 * reset wallet data
         */
		case Types.WALLET_RESET:
			return Object.assign({}, state, initialState);



    /**
     * New
     */

        /**
		 * Show|Hide Unlock modal //here we work with promises
         */
        case Types.SHOW_WALLET_PASSWORD_WINDOW:
            return Object.assign({}, state, {
                isOpen : action.payload.isOpen,
                success: action.payload.success,
                cancel: action.payload.cancel
            });

        /**
		 * reset Unlock modal //here we work with promises
         */
        case Types.RESET_WALLET_PASSWORD_WINDOW:
            return Object.assign({}, state, {
                isOpen : false,
                success: null,
                cancel: null
            });

		default:
            /**
             * We return the previous state in the default case
             */
			return state;
	}
}
