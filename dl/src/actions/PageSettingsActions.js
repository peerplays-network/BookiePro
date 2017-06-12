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


import {ADD_CONNECTION, REMOVE_CONNECTION} from "../constants/ActionTypes";
import {getViewSettings,setViewSettings} from "services/ViewSettingsService";

/**
 * Settings page Action Creator (ADD_CONNECTION)
 * Add WS connection
 * @param data
 * @returns {Function}
 */
export function addConnection(data){
  let connection = getViewSettings("connection");
  setViewSettings({connection : connection.concat(data)});
    return function (dispatch) {
        dispatch({
            type: ADD_CONNECTION,
            payload: data
        })
    };
}
/**
 * Settings page Action Creator (REMOVE_CONNECTION)
 * Remove WS connection
 * @param data
 * @returns {Function}
 */
export function removeConnection(data) {

  let connection = getViewSettings("connection");
  setViewSettings({connection : connection.filter(item => item != data)});
    return function (dispatch) {
        dispatch({
            type: REMOVE_CONNECTION,
            payload: data
        })
    };
}