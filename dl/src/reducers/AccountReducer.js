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
import merge from 'lodash/object/merge';


/**
 * Account Reducer is used to searching accounts
 *
 * Initial State
 *
 * search - search data
 * currentAccount - current account TODO::rm legacy
 *
 * @type {{search: {searchTerm: string, searchAccounts: Array, coreAsset: {}}, accounts: (Immutable.Set<T>|*|Immutable.Set<any>), subbed: boolean, currentAccount: null, linkedAccounts: (Immutable.Set<T>|*|Immutable.Set<any>), ignoredAccounts: (Immutable.Set<T>|*|Immutable.Set<any>), unFollowedAccounts: (Immutable.Set<T>|*|Immutable.Set<any>)}}
 */
const initialState = {
	search: {
		searchTerm: '',
		searchAccounts: [],
		coreAsset: {}
	},
	currentAccount	: null,
};

class AccountReducerWrapper {

	static accountSearch(state, payload) {
		state = merge({}, state);
		state.search.searchTerm = payload.searchTerm;
		state.search.searchAccounts = payload.accounts;
		state.search.coreAsset = payload.coreAsset;
		return state;
	}
}

export default (state = initialState, action) => {
	switch(action.type) {
        /**
		 * set "In process" search
         */
		case Types.ACCOUNT_SEARCH_REQUESTED:
			return state;
        /**
		 * set search data account
         */
		case Types.ACCOUNT_SEARCH:
			return AccountReducerWrapper.accountSearch(state, action);


		case Types.SET_CURRENT_ACCOUNT:
			return Object.assign({}, state, {
				currentAccount : action.payload
			});

        /**
		 * reset account reducer
         */
		case Types.ACCOUNT_RESET:
			return Object.assign({}, state, initialState);
		default:
			return state
	}
}
