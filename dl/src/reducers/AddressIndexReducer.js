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
 * Created by shumer on 10/19/16.
 */
import Immutable from "immutable";
import * as Types from '../constants/ActionTypes';

/**
 * Address Index Reducer is used to saving pub keys
 * TODO::rm if is not used
 * Initial state
 * @type {{addresses: (*), saving: boolean, pubkeys: Set}}
 */
const initialState = {
    addresses: Immutable.Map(),
    saving: false,
    pubkeys : new Set()
};

export default (state = initialState, action)=>{
    switch(action.type){
        case Types.SET_ADDRESS_INDEXES:
            return Object.assign({}, state, {
                addresses : action.payload
            });
        case Types.SET_ADDRESS_INDEXES_SAVING_STATUS:
            return Object.assign({}, state, {
                saving : action.payload
            });
        case Types.SET_ADDRESS_INDEXES_PUBKEYS:
            return Object.assign({}, state, {
                pubkeys : action.payload
            });
        default:
            return state;
    }
};