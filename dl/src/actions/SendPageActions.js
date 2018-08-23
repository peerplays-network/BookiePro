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

import { SEND_PAGE_UPDATE, SEND_PAGE_SET_SYMBOL } from "../constants/ActionTypes";
import {ChainTypes, PrivateKey, key, ChainStore, Aes, TransactionHelper, FetchChain} from "peerplaysjs-lib";
import WalletApi from "rpc_api/WalletApi";
import Immutable from "immutable";
import Repository from '../repositories/chain/repository';

import AccountRepository from '../repositories/AccountRepository';

/**
 * get history by account list
 *
 * @param {Object} accountsList
 * @returns {Array}
 */
function getHistory(accountsList) {
    let history = [];
    let seen_ops = new Set();
    for (let account of accountsList) {
        if(account) {
            let h = account.history;
            if (h) history = history.concat(h.filter(op => !seen_ops.has(op.id) && seen_ops.add(op.id)));
        }
    }

    history = history.filter(a => {
        return a.op[0] === 0;
    });

    return history;
}

/**
 * Private Redux Action Creator (SEND_PAGE_UPDATE)
 * set all Send page data
 *
 * @param data
 * @returns {{type, payload: *}}
 */
function updateDataAction(data) {
    return {
        type: SEND_PAGE_UPDATE,
        payload: data
    }
}

class SendPageActions {

    /**
     * get and update send page data
     *
     * @param data
     * @returns {function(*=, *)}
     */
    static update(data) {
        return (dispatch, getState) => {
            return Repository.getAccount(getState().app.account).then(result => {
                let account = result.toJS();

                let assetPromises = [];
                let balancePromises = [];
                for(let assetId in account.balances) {
                    assetPromises.push(Repository.getAsset(assetId));
                    balancePromises.push(Repository.getObject(account.balances[assetId]));
                }

                return Promise.all(assetPromises.concat(balancePromises)).then(results => {
                    let assets = [];
                    let balances = [];

                    results.map((r, i) => i < results.length / 2 ? assets.push(r.toJS()) : balances.push(r.toJS()));

                    let balance = balances.map((item, index) => Object.assign({}, item, {symbol: assets[index].symbol, precision: assets[index].precision}));
                    let history = getHistory([account]);
                    let hAssetIds = Immutable.Set(history.map(item => item.op[1].amount.asset_id))

                    return Promise.all(hAssetIds.map(id => Repository.getAsset(id))).then(results => {

                        dispatch(updateDataAction(Object.assign({}, data, {
                            balance,
                            symbols: assets.map(item => item.symbol),
                            assets,
                            accountId: account.id,
                            history,
                            historyAssets: results.map(ha => ha.toJS())
                        })));
                    })

                })
            })
        }
    }

    /**
     * Get transaction for transfer
     *
     * @param {string} from_account
     * @param {string} to_account
     * @param {string} amount
     * @param {string} memo
     * @param {string} asset
     * @param {string} fee_asset_id
     * @param {string} propose_account
     * @param {boolean} broadcast
     * @param {boolean} encrypt_memo
     * @param {string} optional_nonce
     * @returns {function(*, *)}
     */
    static getTransferTransaction(
        from_account,
        to_account,
        amount,
        memo,
        asset,
        fee_asset_id,
        propose_account = null,
        broadcast = true,
        encrypt_memo = true,
        optional_nonce = null
    ) {

        return (dispatch, getState) => {

            return new Promise((resolve, reject) => {
                // Get the encrypted memo key.
                const encryptedKey = getState().walletData.wallet.encrypted_memo_key;
                const activePrivateKeyBuffer = getState().walletData.aesPrivate.decryptHexToBuffer(encryptedKey);//.toBuffer());
                const activePrivateKey = PrivateKey.fromBuffer(activePrivateKeyBuffer);


                let memo_sender = propose_account || from_account;

                return Promise.all([
                    FetchChain("getAccount", from_account),
                    FetchChain("getAccount", to_account),
                    FetchChain("getAccount", memo_sender),
                    FetchChain("getAccount", propose_account),
                    FetchChain("getAsset", asset),
                    FetchChain("getAsset", fee_asset_id)
                ]).then((res)=> {

                    let [
                        chain_from, chain_to, chain_memo_sender, chain_propose_account,
                        chain_asset, chain_fee_asset
                    ] = res;

                    let memo_from_public, memo_to_public;
                    if( memo && encrypt_memo  ) {

                        memo_from_public = chain_memo_sender.getIn(["options","memo_key"]);

                        // The 1s are base58 for all zeros (null)
                        if( /111111111111111111111/.test(memo_from_public)) {
                            memo_from_public = null;
                        }

                        memo_to_public = chain_to.getIn(["options","memo_key"])
                        if( /111111111111111111111/.test(memo_to_public)) {
                            memo_to_public = null
                        }
                    }

                    let propose_acount_id = propose_account ? chain_propose_account.get("id") : null

                    let memo_from_privkey;
                    if(encrypt_memo && memo ) {
                        memo_from_privkey = activePrivateKey;

                        if(! memo_from_privkey) {
                            throw new Error("Missing private memo key for sender: " + memo_sender)
                        }
                    }

                    let memo_object;
                    if(memo && memo_to_public && memo_from_public) {
                        let nonce = optional_nonce == null ?
                                    TransactionHelper.unique_nonce_uint64() :
                                    optional_nonce

                        memo_object = {
                            from: memo_from_public,
                            to: memo_to_public,
                            nonce,
                            message: (encrypt_memo) ?
                                Aes.encrypt_with_checksum(
                                    memo_from_privkey,
                                    memo_to_public,
                                    nonce,
                                    memo
                                ) :
                                Buffer.isBuffer(memo) ? memo.toString("utf-8") : memo
                        }
                    }
                    // Allow user to choose asset with which to pay fees #356
                    let fee_asset = chain_fee_asset.toJS();

                    // Default to CORE in case of faulty core_exchange_rate
                    if( fee_asset.options.core_exchange_rate.base.asset_id === "1.3.0" &&
                        fee_asset.options.core_exchange_rate.quote.asset_id === "1.3.0" ) {
                        fee_asset_id = "1.3.0";
                    }

                    let wallet_api = new WalletApi();
                    let tr = wallet_api.new_transaction();

                    let transfer_op = tr.get_type_operation('transfer', {
                        fee: {
                            amount: 0,
                            asset_id: fee_asset_id
                        },
                        from: chain_from.get("id"),
                        to: chain_to.get("id"),
                        amount: {
                            amount,
                            asset_id: chain_asset.get("id")
                        },
                        memo: memo_object
                    });

                    if( propose_account ) {
                        let proposal_create_op = tr.get_type_operation('proposal_create', {
                            proposed_ops: [{ op: transfer_op }],
                            fee_paying_account: propose_acount_id
                        });
                        tr.add_operation(proposal_create_op);
                        tr.operations[0][1].expiration_time = parseInt(Date.now()/1000 + 5);

                    } else {
                        tr.add_operation( transfer_op )
                    }
                    return tr.set_required_fees().then(() => resolve(tr));

                }).catch(err => reject(err));


            })
        }
    }


    /**
     * Send money transaction
     *
     * @param tr
     * @returns {function(*, *)}
     */
    static transferTransaction(tr) {
        return (dispatch, getState) => {
            return new Promise((resolve, reject) => {
                let encrypted_key = getState().walletData.wallet.encrypted_brainkey;
                const activePrivateKeyBuffer = getState().walletData.aesPrivate.decryptHexToBuffer(encrypted_key);
                const activePrivateKey = PrivateKey.fromBuffer(activePrivateKeyBuffer);
                AccountRepository.process_transaction(tr, activePrivateKey).then(() => resolve()).catch(err => reject(err));
            })
        }
    }

    /**
     * select asset and set in reducer
     *
     * @param symbol
     * @returns {function(*)}
     */
    static setSelectedSymbol(symbol) {
        return dispatch => {
            dispatch({
                type: SEND_PAGE_SET_SYMBOL,
                payload: symbol
            })
        }
    }
}

export default SendPageActions;
