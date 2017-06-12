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

import {setTransaction, clearTransaction} from 'actions/RTransactionConfirmActions';
import {PrivateKey, ChainTypes} from "peerplaysjs-lib";
import WalletApi from "rpc_api/WalletApi";
import AccountRepository from 'repositories/AccountRepository';


let wallet_api = new WalletApi();

class TournamentTransactionService {

    /**
     * Create tournament transaction
     *
     * @param operationJSON
     * @param whiteList
     * @param payer
     * @param asset
     * @param transactionFunctionCallback
     */
    static createTournament(operationJSON, whiteList, payer, asset, transactionFunctionCallback) {

        let tr = wallet_api.new_transaction();

        tr.add_type_operation("tournament_create", operationJSON);

        return tr.set_required_fees().then(() => {
            return setTransaction('tournament_create', {
                operation: operationJSON,
                whiteList: whiteList,
                proposedOperation: '',
                payer: payer,
                asset: asset,
                transactionFunction: TournamentTransactionService.transactionFunction,
                transactionFunctionCallback: transactionFunctionCallback,
                transactionObject: tr,
                functionArguments: tr
            })

        });


    }

    /**
     * Create Join tournament transaction
     *
     * @param operationJSON
     * @param account
     * @param asset
     * @param transactionFunctionCallback
     */
    static joinToTournament(operationJSON, account, asset, transactionFunctionCallback) {

        let tr = wallet_api.new_transaction();

        tr.add_type_operation("tournament_join", operationJSON);

        return tr.set_required_fees(asset.id).then(() => {

            return setTransaction('tournament_join', {
                payer: account,
                player: account,
                asset: asset,
                isConfirm: false,
                operation: operationJSON,
                proposedOperation: '',
                transactionFunction: TournamentTransactionService.transactionFunction,
                transactionFunctionCallback: transactionFunctionCallback,
                transactionObject: tr,
                functionArguments: tr
            });

        });

    }

    /**
     * Common tr function
     * @param tr
     * @returns {function(*, *)}
     */
    static transactionFunction(tr) {

        return (dispatch, getState) => {

            return new Promise((resolve, reject) => {

                let encrypted_key = getState().walletData.wallet.encrypted_brainkey;
                const activePrivateKeyBuffer = getState().walletData.aesPrivate.decryptHexToBuffer(encrypted_key);
                const activePrivateKey = PrivateKey.fromBuffer(activePrivateKeyBuffer);

                AccountRepository.process_transaction(tr, activePrivateKey).then(() => {

                    resolve();
                }).catch(err => reject(err));
            });
        }
    }

}

export default TournamentTransactionService;
