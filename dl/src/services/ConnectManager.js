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

import {ApisInstance} from "peerplaysjs-ws";
import {Apis} from "peerplaysjs-ws";

let instances = {};

class ConnectManager {

    /**
     *
     * @param {string} cs
     * @param {ApisInstance} instance
     */
    static setConnection(cs, instance) {
        instances[cs] = instance;
    }

    /**
     * WebSocket status callback
     * @param {function} callback
     */
    static setDefaultRpcConnectionStatusCallback(callback) {
        return Apis.instance().setRpcConnectionStatusCallback(callback);
    }

    /**
     *
     * @param {String} connectionString
     */
    static setDefaultConnection(connectionString) {
        return Apis.instance(connectionString, true);
    }

    /**
     *
     * @param {String} cs
     * @returns {*}
     */
    static getConnection(cs) {

        if (!instances[cs]) {

            let instance = new ApisInstance();
            instance.connect(cs);

            ConnectManager.setConnection(cs, instance);

        }

        return instances[cs];

    }

}

export default ConnectManager;