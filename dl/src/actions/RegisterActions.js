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

import RegisterConstants from "../constants/Register";
import LoginService from '../services/LoginService';
import NavigateActions from "./NavigateActions";
import AccountRepository from '../repositories/AccountRepository';
import KeyGeneratorService from "services/KeyGeneratorService";
import ApplicationApi from "../rpc_api/ApplicationApi";
import CONFIG from "../config/main";
import _ from "lodash";

/**
 * Private Redux Action Creator (RegisterConstants.REGISTER_SET_STATUS)
 *
 * @param {String} status
 * @returns {{type, status: *}}
 */
function setRegisterStatusAction(status) {
    return {
        type: RegisterConstants.REGISTER_SET_STATUS,
        status: status
    }
}

/**
 * Private Redux Action Creator (RegisterConstants.REGISTER_SET_ERRORS)
 *
 * @param {Array} errors
 * @returns {{type, errors: []}}
 */
function setCommonErrorsAction(errors) {
    return {
        type: RegisterConstants.REGISTER_SET_ERRORS,
        errors: errors
    }
}

/**
 * Faucet file
 */
const faucets = require('json!common/' + CONFIG.FAUCET_FILE + '.json');

/**
 * Get Faucet Address
 * //TODO:: AccountService.fetchFaucetAddress
 * @param {Number} attempt
 * @param {String} accountName
 * @param {PrivateKey} ownerPrivate
 * @param {PrivateKey} activePrivate
 * @param {PrivateKey} memoPrivate
 * @param referral
 * @returns {Promise}
 */
function fetchFaucetAddress(attempt, accountName, ownerPrivate, activePrivate, memoPrivate, referral) {
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
                return fetchFaucetAddress(attempt, accountName, ownerPrivate,activePrivate, referral).then(res => resolve(res)).catch(err => reject(err));
            }
        })
    })
}

class RegisterActions {

    /**
     *  Register form: Setting "Create account" button state
     *
     * @param {String} status
     * @returns {function(*)}
     */
    static setRegisterStatus(status) {
        return (dispatch) => {
            dispatch(setRegisterStatusAction(status));
        };
    }

    /**
     * Sign Up account in app
     *
     * @param {String} accountName
     * @param {String} password
     * @param {String} registrarAccount
     * @param {String|null} referral
     * @param {Number} referralPercent
     * @returns {function(*=)}
     */
    static register(accountName, password, registrarAccount = null, referral = null, referralPercent = 0) {

        return (dispatch) => {

            let keys = KeyGeneratorService.generateKeys(accountName, password);

            dispatch(setCommonErrorsAction([]));

            if (registrarAccount) {

                let appApi = new ApplicationApi();

                return appApi.create_account(                 
                    keys.owner.toPublicKey().toPublicKeyString(),
                    keys.active.toPublicKey().toPublicKeyString(),
                    accountName,
                    registrarAccount, //registrar_id,
                    registrarAccount, //referrer_id,
                    referralPercent, //referrer_percent,
                    true //broadcast
                ).catch(err => {
                    throw err;
                });
            } else {
                return fetchFaucetAddress(1, accountName, keys.owner, keys.active, keys.memo, referral)
                    .then(result => {
                        if(result.error) {
                            console.warn("CREATE ACCOUNT RESPONSE", result);
                            console.warn("CREATE ACCOUNT ERROR", result.error);
                            throw result.error;
                        }
                        console.log('RESULT', result);
                        return result;
                    }).then(() => {

                        return AccountRepository.fetchFullAccount(accountName).then((result) => {

                            let account = result[1]['account'];

                            return LoginService.systemLogin(account, password, false, dispatch).then(() => {
                                dispatch(NavigateActions.navigateToDashboard());
                                dispatch(RegisterActions.setRegisterStatus('default'));
                            });

                        });

                    }).catch(error => {

                        dispatch(RegisterActions.setRegisterStatus('default'));

                        let errorKeys = Object.keys(error),
                            errors = [];

                        errorKeys.forEach((errorKey) => {
                            errors.push(error[errorKey]);
                        });

                        if (errors.length) {
                            return dispatch(setCommonErrorsAction(errors));
                        }

                        return dispatch(setCommonErrorsAction(['Faucet registration failed']));
                    });
            }

        }

    }

}

export default RegisterActions;