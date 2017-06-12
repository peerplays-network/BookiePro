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

import AccountRepository from "../repositories/AccountRepository";
const faucets = require('json!common/' + FAUCET_FILE + '.json');

class AccountService {

    /**
     * Select free name
     *
     * @param {string} accountName
     * @param {number} attempts
     */
    static getFreeAccountName(accountName, attempts = 0) {

        let nextAccountName = accountName;

        if (attempts > 0) {
            nextAccountName += ('-' + attempts);
        }

        return AccountRepository.fetchFullAccount(nextAccountName).then((account) => {

            if (!account) {
                return nextAccountName;
            }

            return AccountService.getFreeAccountName(accountName, ++attempts);
        });
    }

    /**
     * Get faucet address
     *
     * @param attempt
     * @param accountName
     * @param ownerPrivate
     * @param activePrivate
     * @param memoPrivate
     * @param referral
     * @returns {Promise}
     */
    static fetchFaucetAddress(attempt, accountName, ownerPrivate, activePrivate, memoPrivate, referral) {
        return new Promise((resolve, reject) => {
            let index = Math.floor(Math.random() * Object.keys(faucets).length);
            let faucetAddress = faucets[index];

            if(window && window.location && window.location.protocol === "https:") {
                faucetAddress = faucetAddress.replace(/http:\/\//, "https://");
            }

            return fetch(faucetAddress, {
                method: 'post',
                mode: 'cors',
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "account": {
                        "name": accountName,
                        "owner_key": ownerPrivate.toPublicKey().toPublicKeyString(),
                        "active_key": activePrivate.toPublicKey().toPublicKeyString(),
                        "memo_key": memoPrivate.toPublicKey().toPublicKeyString(),
                        "refcode": referral,
                        "referrer": window && window.BTSW ? BTSW.referrer : ""
                    }
                })
            }).then(response => {
                let res = response.json();
                resolve(res);
            }).catch(err => {
                if(attempt > 2) {
                    reject(err);
                }
                else {
                    attempt++;
                    return AccountService.fetchFaucetAddress(attempt, accountName, ownerPrivate,activePrivate, referral).then(res => resolve(res)).catch(err => reject(err));
                }
            })
        })
    }

}

export default AccountService;