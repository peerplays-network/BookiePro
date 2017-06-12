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
    TRCONFIRM_SET_TRANSACTION,
    TRCONFIRM_CLEAR,
    TRCONFIRM_PROPOSE,
    TRCONFIRM_TRCONFIRMED,
    TRCONFIRM_BROADCASTING,
    TRCONFIRM_BROADCAST_SUCCESS,
    TRCONFIRM_BROADCAST_ERROR
} from '../constants/ActionTypes';


/**
 * Private Redux Action Creator (TRCONFIRM_BROADCASTING)
 * set: transaction in process
 * @returns {function(*)}
 */
function broadcastingAction() {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: TRCONFIRM_BROADCASTING
            });
            resolve();
        })
    }
}
/**
 * Private Redux Action Creator (TRCONFIRM_BROADCAST_SUCCESS)
 * set broadcast SUCCESS
 * @returns {function(*)}
 */
function broadcastSuccessAction() {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: TRCONFIRM_BROADCAST_SUCCESS
            });
            resolve();
        });
    }
}
/**
 * Private Redux Action Creator (TRCONFIRM_BROADCAST_ERROR)
 * set broadcast ERROR
 * @param err
 * @returns {function(*)}
 */
function broadcastErrorAction(err) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: TRCONFIRM_BROADCAST_ERROR,
                payload: err
            });
            resolve();
        });
    }
}
/**
 * Private Redux Action Creator (TRCONFIRM_TRCONFIRMED)
 * The transaction was successful
 * @returns {function(*)}
 */
function transactionConfirmedAction() {
    return dispatch => {
        dispatch({
            type: TRCONFIRM_TRCONFIRMED
        });
    }
}

/**
 * Action creators
 *
 */

/**
 * Redux Action Creator (TRCONFIRM_SET_TRANSACTION)
 * setTransaction for modal window
 *
 * @param name
 * @param data
 * @returns {function(*)}
 */
export function setTransaction(name, data) {
    return dispatch => {
        dispatch({
            type: TRCONFIRM_SET_TRANSACTION,
            payload: { transaction: name, data }
        });
    }
}

/**
 * Reduz Action (TRCONFIRM_CLEAR)
 * clear modal window
 * @returns {function(*)}
 */
export function clearTransaction() {
    return dispatch => {
        dispatch({
            type: TRCONFIRM_CLEAR
        });
    }
}
/**
 * Redux Action Creator (TRCONFIRM_PROPOSE)
 * set propose account
 * @param name
 * @returns {function(*)}
 */
export function setProposeAccount(name) {
    return dispatch => {
        dispatch({
            type: TRCONFIRM_PROPOSE,
            payload: name
        })
    }
}

/**
 * start transaction
 *
 * @param trFunc
 * @param funcArgs
 * @param funcCb
 * @returns {function(*=, *=)}
 */
export function confirmTransaction(trFunc, funcArgs, funcCb) {
    return (dispatch, getState) => {
        dispatch(broadcastingAction()).then(() => {

            dispatch(trFunc(funcArgs)).then(() => {

                //TODO::rm

                if (funcCb) {
                    funcCb();
                }

                dispatch(broadcastSuccessAction()).then(() => {
                    dispatch(transactionConfirmedAction());
                })
            }).catch(error => {
                let stringError = 'Transaction Error';

                if (error && error.message) {
                    let lines = error.message.split('\n');
                    if (lines && lines.length > 1) {
                        stringError = lines[1];
                    }
                }

                if (getState().transactionConfirm.transaction.errorCallback) {
                    getState().transactionConfirm.transaction.errorCallback()
                }

                dispatch(broadcastErrorAction(stringError))
            });
        });
    }

}
