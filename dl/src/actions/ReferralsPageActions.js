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
    REFERRALS_SET
} from "../constants/ActionTypes";
import {ChainStore} from "peerplaysjs-lib";
import Repository from "repositories/chain/repository";
import KeysService from "services/KeysService";
import TransactionService from "services/TransactionService";

/**
 * Private Redux Action Creator (REFERRALS_SET)
 *
 * Update controlled account
 *
 * @param data
 * @returns {{type, payload: *}}
 */
function setPageDataAction(data) {
    return {
        type: REFERRALS_SET,
        payload: data
    }
}


let subscribers = {
    referral: null
};

class ReferralsPageActions {

    /**
     * Subscribe to update
     *
     * @returns {function(*=, *=)}
     */
    static subscribe() {

        return (dispatch, getState) => {


            let subscriber = function (dispatch) {
                return () => {
                    dispatch(ReferralsPageActions.setPageData());
                }
            };

            subscribers['referral'] = subscriber(dispatch, getState);

            ChainStore.subscribe(subscribers['referral']);

        }
    }

    /**
     *
     * Unsubscribe from chainstore updates
     *
     * @returns {function()}
     */
    static unSubscribe() {

        return () => {

            ChainStore.unsubscribe(subscribers['referral']);

            delete subscribers['referral'];
        }
    }


    /**
     *
     * Update controlled account
     *
     * @returns {function(*, *)}
     */
    static setPageData() {

        return (dispatch, getState) => {

            let state = getState();

            Repository.getAccount(state.app.accountId).then((account) => {

                dispatch(setPageDataAction({
                    account: account
                }));

            });

        };
    }

    /**
     * Upgrade account
     *
     * @returns {function(*=, *)}
     */
    static onClickUpgradeLifetime() {

        return (dispatch, getState) => {

            let state = getState();

            KeysService.getActiveKeyFromState(state, dispatch).then((privateKey) => {

                TransactionService.upgradeAccount(state.app.accountId, "1.3.0", true, () => {

                    dispatch(ReferralsPageActions.setPageData());

                }).then((trFnc) => {

                    dispatch(trFnc);

                });

            });

        };
    }

}

export default ReferralsPageActions;