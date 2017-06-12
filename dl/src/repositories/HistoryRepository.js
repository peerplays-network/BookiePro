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

import {Apis} from "peerplaysjs-ws";
import WalletApi from "rpc_api/WalletApi";

class HistoryRepository {

    static fetchMarketHistory(coreId, quoteId, tm, startDateShort, endDateShort) {


        return Apis.instance().history_api().exec("get_market_history", [
            coreId, quoteId, tm, startDateShort, endDateShort
        ]).catch(function (error) {
            console.log('HistoryRepository: fetchMarketHistory', error);
        });

    }

    static fetchFillOrderHistory(coreId, quoteId, param) {

        return Apis.instance().history_api().exec("get_fill_order_history", [
            coreId, quoteId, param
        ]).catch(function (error) {
            console.log('HistoryRepository: fetchFillOrderHistory', error);
        });

    }
    static fetchBuckets() {
        return Apis.instance().history_api().exec("get_market_history_buckets", []);
    }

    static fetchAccountHistory(accountId, mostRecent = '1.11.0', limit = 100) {
        return Apis.instance().history_api().exec("get_account_history",[ accountId, mostRecent, limit, '1.11.0']).catch(error => {
            console.log('HistoryRepository: fetchRecentHistory', error);
        });

    }
}

export default HistoryRepository;
