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

import RegisterConstants from "../constants/Register";

/**
 *
 * RegisterReducer is used to controlling registration in an application
 *
 * Initial State
 * status - Register form: Button state
 * errors - Common validation errors
 *
 * @type {{status: string, errors: Array}}
 */
let defaultState = {
    status: 'default',
    errors: []
};

export default function (state = defaultState, action) {
    switch (action.type) {
        /**
         * Register form: Setting button state
         */
        case RegisterConstants.REGISTER_SET_STATUS:
            return Object.assign({}, state, {
                status: action.status
            });
        /**
         * Register form: Setting Common validation errors
         */
        case RegisterConstants.REGISTER_SET_ERRORS:
            return Object.assign({}, state, {
                errors: action.errors
            });
        default:
            return state
    }

};