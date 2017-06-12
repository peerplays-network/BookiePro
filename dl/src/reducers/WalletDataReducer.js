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

/**
 * Created by shumer on 10/7/16.
 */
import * as Types from '../constants/ActionTypes';

/**
 * Wallet Data Reducer is used to storing wallet data
 *
 * Initial State
 *
 * wallet - our wallet
 * aesPrivate - Wallet AES
 * @type {{wallet: null, aesPrivate: null}}
 */
const initialState = {
    wallet : null,
    aesPrivate : null,
};

export default (state = initialState, action) => {
    switch(action.type) {
        /**
         * Update wallet data
         */
        case Types.WD_UPDATE_WALLET:
            return Object.assign({}, state, {
                wallet : action.payload
            });
        /**
         * RPS Game: Update Reveal moves
         */
        case Types.WD_UPDATE_REVEAL_MOVES_WALLET:

            return {
                ...state,
                wallet: {
                    ...state.wallet,
                    reveal_moves: action.payload
                }
            };

        /**
         * Change wallet AES
         */
        case Types.WD_SET_AES_PRIVATE:
            return Object.assign({}, state, {
                aesPrivate: action.payload
            });
        /**
         * Reset Wallet data reducer
         */
        case Types.WD_RESET:
            return Object.assign({}, state, initialState);
        default:
            /**
             * We return the previous state in the default case
             */
            return state
    }

}