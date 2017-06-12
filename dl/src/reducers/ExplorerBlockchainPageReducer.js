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

import Immutable from "immutable";

import {
    EXPLORER_BLOCK_CHAIN_CHANGE_STATISTIC,
    EXPLORER_BLOCK_CHAIN_CHANGE_RECENT_BLOCKS,
    EXPLORER_BLOCK_CHAIN_CHANGE_OPERATION_BLOCKS,
    EXPLORER_BLOCK_CHAIN_SET_DATA_IS_FETCHED
    } from '../constants/ActionTypes';

/**
 *
 * Explorer Blockchain Page Reducer is used to controlling blockchain explorer page
 * Initial State
 *
 * head_block_number - Current block number
 * last_irreversible_block_num -  Last irreversible block number
 * recently_missed_count - recently missed count
 * active_witnesses - [] of witnesses
 * active_committee_members - [] of active_committee_members
 * block_interval - time secs
 * current_supply - Current supply
 * confidential_supply - Confidential supply
 *
 * graphBlockTimes - data for time chart
 * graphBlockTransactions - data for trx chart
 * trxPerSec - trx/sec
 * trxPerBlock - trx/block
 * avgTime - average time
 * latestBlocks - Last received blocks
 * latestTransactions - Recent transactions received
 * operations - Recent transaction-operations
 * coreAsset - asset
 * dataIsFetched - At least once the data were collected
 *
 * @type {{head_block_number: number, last_irreversible_block_num: number, recently_missed_count: number, time: null, active_witnesses: Array, active_committee_members: Array, block_interval: number, current_supply: number, confidential_supply: number, graphBlockTimes: Array, graphBlockTransactions: Array, trxPerSec: number, trxPerBlock: number, avgTime: number, updatedAt: number, latestBlocks: (*), latestTransactions: (*), operations: (*), coreAsset: {}, dataIsFetched: boolean}}
 */
let defaultState = {
    head_block_number: 0,
    last_irreversible_block_num: 0,
    recently_missed_count: 0,
    time: null,
    active_witnesses: [],
    active_committee_members: [],
    block_interval: 0,
    current_supply: 0,
    confidential_supply: 0,

    graphBlockTimes: [],
    graphBlockTransactions: [],
    trxPerSec: 0,
    trxPerBlock: 0,
    avgTime: 0,
    updatedAt: 0,
    latestBlocks: Immutable.List(),
    latestTransactions: Immutable.List(),
    operations: Immutable.List(),
    coreAsset: {},
    dataIsFetched: false
};

export default function (state = defaultState, action) {
    switch (action.type) {
        /**
         * At least once the data were collected
         */
        case EXPLORER_BLOCK_CHAIN_SET_DATA_IS_FETCHED:
            return Object.assign({}, state, {
                dataIsFetched: action.payload.dataIsFetched
            });
        /**
         * Set recent blocks on explore page
         */
        case EXPLORER_BLOCK_CHAIN_CHANGE_RECENT_BLOCKS:
            return Object.assign({}, state, {
                latestBlocks: action.payload.latestBlocks
            });
        /**
         *  Set operation list
         */
        case EXPLORER_BLOCK_CHAIN_CHANGE_OPERATION_BLOCKS:
            return Object.assign({}, state, {
                operations: action.payload.operations
            });

        /**
         * Set statistic page block
         */
        case EXPLORER_BLOCK_CHAIN_CHANGE_STATISTIC:
            return Object.assign({}, state, {
                head_block_number: action.payload.head_block_number,
                last_irreversible_block_num: action.payload.last_irreversible_block_num,
                recently_missed_count: action.payload.recently_missed_count,
                time: action.payload.time,
                active_witnesses: action.payload.active_witnesses,
                active_committee_members: action.payload.active_committee_members,
                block_interval: action.payload.block_interval,
                current_supply: action.payload.current_supply,
                confidential_supply: action.payload.confidential_supply,

                avgTime: action.payload.avgTime,
                graphBlockTimes: action.payload.graphBlockTimes,
                graphBlockTransactions: action.payload.graphBlockTransactions,
                trxPerSec: action.payload.trxPerSec,
                trxPerBlock: action.payload.trxPerBlock,
                updatedAt: action.payload.updatedAt,

                coreAsset: action.payload.coreAsset
            });
        default:
            /**
             * We return the previous state in the default case
             */
            return state
    }

};