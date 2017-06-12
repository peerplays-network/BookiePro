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

import {VOTING_SET_DATA, VOTING_CHANGE_PROXY, VOTING_SET_NEW_WITNESSES, VOTING_UPDATE_WITNESS_TAB} from 'constants/ActionTypes';


/**
 *
 * Voting Reducer is used to controlling tabs on the Voting page
 *
 * Initial State
 *
 * proxy - Voting/Proxy page data
 * witnesses - Voting/Witnesses page data
 * committeeMembers - Voting/Committee Members page(Advisors) data
 * proposals - Voting/Proposal page data
 * @type {{proxy: {knownProxies: Array}, witnesses: {sortBy: string, inverseSort: boolean}, committeeMembers: {}, proposals: {}}}
 */
const initialState = {
    /**
     *
     */
    proxy: {
        knownProxies: []
    },
    /**
     * Voting/witnesses page
     */
    witnesses: {
        sortBy: 'rank',
        inverseSort: true
    },
    /**
     * New witness ids
     */
    newWitnesses: [],
    /**
     * Voting/Committee Members page(Advisors)
     */
    committeeMembers: {},
    /**
     * Proposal page TODO::rm
     */
    proposals: {}
};

export default (state = initialState, action)=>{
    switch(action.type) {
        /**
         * Voting Page
         * Set Voting page data(Pages: proxy, witnesses, committeeMembers, proposals)
         */
        case VOTING_SET_DATA:
            return Object.assign({}, state, {
                proxy: action.payload.proxy,
                witnesses: action.payload.witnesses,
                committeeMembers: action.payload.committeeMembers,
                proposals: action.payload.proposals//TODO::rm
            });
        /**
         * Proxy page
         * Change account proxy
         */
        case VOTING_CHANGE_PROXY:
            return Object.assign({}, state, {
                proxy: {
                    ...state.proxy,
                    name: action.payload.name,
                    id:  action.payload.id
                }
            });
        /**
         * Add new witness
         */
        case VOTING_SET_NEW_WITNESSES:
            return Object.assign({}, state, {
                ...state,
                newWitnesses: action.payload.newWitnesses
            });
        /**
         * Update only a witness page
         */
        case VOTING_UPDATE_WITNESS_TAB:
            return Object.assign({}, state, {
                ...state,
                witnesses: action.payload.witnesses
            });
        default:
            /**
             * We return the previous state in the default case
             */
            return state;
    }
};
