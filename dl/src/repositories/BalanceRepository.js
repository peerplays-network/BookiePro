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

class BalanceRepository {

    static getAccountBalances(accountId, asset_types = ['1.3.0']) {

        return Apis.instance().db_api().exec("get_account_balances", [accountId, asset_types]).then(results => results);

    }

    static getBalanceObjects(addresses) {

        return Apis.instance().db_api().exec("get_balance_objects", [addresses]);

    }
    static getVestedBalances(balance_ids) {

        return Apis.instance().db_api().exec("get_vested_balances", [balance_ids]);
    }
    static getVestingBalances(accountId) {

        return Apis.instance().db_api().exec("get_vesting_balances", [
            accountId
        ]).catch(err => {
            console.log("error:", err);
        });
    }


}

export default BalanceRepository;
