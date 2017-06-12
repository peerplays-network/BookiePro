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

import StorageService from "services/StorageService";
import Repository from 'repositories/chain/repository';

class AccountLoginService {

    /**
     * check at the start of the application if the user is logged in
     *
     * @param {string} accountName
     * @returns {Promise}
     */
    static checkLoginAccount(accountName = StorageService.get("currentAccount", null)) {

        return new Promise((resolve) => {

            if (accountName) {

                Repository.getAccount(accountName).then((account) => {

                    if (account) {
                        resolve({
                            id: account.get('id'),
                            name: account.get('name')
                        });
                    } else {
                        resolve(null);
                    }

                }).catch(() => {

                    resolve(null);

                });

            } else {

                resolve(null);

            }

        });

    }
}

export default AccountLoginService;
