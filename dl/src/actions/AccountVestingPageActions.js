/*
 * Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {
    SET_ACCOUNT_VESTING_DATA,
    RESET_ACCOUNT_VESTING_DATA
} from "../constants/ActionTypes";

import Repository from 'repositories/chain/repository';
import BalanceRepository from 'repositories/BalanceRepository';
import KeysService from "services/KeysService";
import TransactionService from "services/TransactionService";


/**
 * Private Redux Action Creator (SET_ACCOUNT_VESTING_DATA)
 * Set account vesting list
 *
 * @param data
 * @returns {{type, payload: {balances}}}
 */
function setAccountVestingDataAction(data) {
    return {
        type: SET_ACCOUNT_VESTING_DATA,
        payload: data
    }
}
/**
 * Private Redux Action Creator (RESET_ACCOUNT_VESTING_DATA)
 * Reset page(balance list)
 * @returns {{type, payload: null}}
 */
function resetAccountVestingDataAction() {
    return {
        type: RESET_ACCOUNT_VESTING_DATA,
        payload: null
    }
}

class AccountVestingPageActions {

    /**
     * Set account vesting list
     *
     * @returns {function(*=, *)}
     */
    static fetchData() {
        return (dispatch, getState) => {

            let state = getState(),
                accountId = state.app.accountId;

            Repository.getAccount(accountId).then((account) => {

                if (account && account.get('vesting_balances') && account.get('vesting_balances').size > 0) {

                    BalanceRepository.getVestingBalances(accountId).then((balances) => {

                        let assetsHashIds = Object.create(null),
                            assetsPromises = [];

                        balances.forEach((vb) => {

                            if (!assetsHashIds[vb.balance.asset_id]) {
                                assetsPromises.push(Repository.getAsset(vb.balance.asset_id));
                            }

                        });

                        Promise.all(assetsPromises).then((assets) => {

                            let assetsHash = Object.create(null);

                            assets.forEach((asset) => {
                                if (asset) {
                                    assetsHash[asset.get('id')] = asset;
                                }
                            });


                            balances.forEach((vb) => {
                                vb.balance.asset = assetsHash[vb.balance.asset_id];
                            });

                            dispatch(setAccountVestingDataAction({
                                balances
                            }));

                        });

                    });

                } else {
                    dispatch(resetAccountVestingDataAction());
                }

            })

        };
    }

    /**
     *
     * Claim balances
     *
     * @param {Object} cvb
     * @param {boolean} forceAll
     * @returns {function(*=, *)}
     */
    static claimVestingBalance(cvb, forceAll = false) {

        return (dispatch, getState) => {

            let state = getState(),
                accountId = state.app.accountId;

            KeysService.getActiveKeyFromState(state, dispatch).then(() => {

                TransactionService.claimVestingBalance(accountId, cvb, forceAll, () => {
                    dispatch(AccountVestingPageActions.fetchData());
                }).then((trFnc) => {

                    dispatch(trFnc);

                });

            });

        }

    }
    /**
     * Reset balances
     *
     * @returns {function(*=, *)}
     */
    static resetAccountVestingData() {
        return (dispatch) => {
            dispatch(resetAccountVestingDataAction());
        }
    }
}

export default AccountVestingPageActions;