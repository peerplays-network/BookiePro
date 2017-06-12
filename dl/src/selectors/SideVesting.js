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

import { createSelector } from 'reselect'

const getBalancesIds = (state) => state.dashboardPage.vestingBalancesIds;
const getBalances = (state) => state.dashboardPage.vestingBalances;

export const getTotalVestingBalances = createSelector(
    [ getBalancesIds, getBalances ],
    (balanceIds, balances) => {

        let totalAmount = 0,
            totalClaimable = 0;

        balanceIds.forEach((balanceId) => {

            let balance = balances.get(balanceId),
                balanceAmount = balance.getIn(['balance', 'amount']),
                vestingPeriod = balance.getIn(['policy', 1, 'vesting_seconds']),
                earned = balance.getIn(['policy', 1, 'coin_seconds_earned']),
                availablePercent = earned / (vestingPeriod * balanceAmount),
                claim = balanceAmount * availablePercent;

            totalAmount += balanceAmount;
            totalClaimable += claim;

        });

        return {
            totalAmount: totalAmount,
            totalClaimable: totalClaimable
        };

    }
);