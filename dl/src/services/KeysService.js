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

import {PrivateKey} from "peerplaysjs-lib";
import RWalletUnlockNewActions from "actions/RWalletUnlockNewActions";

class KeysService {

    /**
     * Get active key from reducer
     *
     * @param state
     * @param dispatch
     * @returns {Promise}
     */
    static getActiveKeyFromState(state, dispatch) {

        return new Promise((resolve, reject) => {

            if (state.walletData.aesPrivate) {

                let encrypted_key = state.walletData.wallet.encrypted_brainkey,
                    activePrivateKeyBuffer = state.walletData.aesPrivate.decryptHexToBuffer(encrypted_key);

                return resolve(PrivateKey.fromBuffer(activePrivateKeyBuffer));

            } else {

                dispatch(RWalletUnlockNewActions.showWalletPasswordWindow({
                    isOpen: true,
                    success: (aes) => {
                        let encrypted_key = state.walletData.wallet.encrypted_brainkey,
                            activePrivateKeyBuffer = aes.decryptHexToBuffer(encrypted_key);

                        return resolve(PrivateKey.fromBuffer(activePrivateKeyBuffer));
                    },
                    cancel: () => {
                        reject();
                    }
                }));
            }

        });
    }

}

export default KeysService;