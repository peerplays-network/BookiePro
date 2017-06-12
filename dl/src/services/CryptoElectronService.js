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

import {Aes} from "peerplaysjs-lib";
import SettingsStorageService from "./SettingsStorageService";

const ELECTRON_ENCRYPTION_KEY = 'electron_encryption';

/**
 * Service for saving AES-encryption to the storage
 */
class CryptoElectronService {

    /**
     * Save ELECTRON AES-encryption
     * @param password
     * @param encryption_key
     */
    static saveElectronEncryption(password, encryption_key) {

        let password_aes = Aes.fromSeed(password),
            encryption = password_aes.decryptHexToBuffer(encryption_key).toString('hex');

        SettingsStorageService.set(ELECTRON_ENCRYPTION_KEY, encryption);

    }

    /**
     * Get ELECTRON AES-encryption
     *
     * @returns {*}
     */
    static getElectronAes() {
        let electron_encryption = SettingsStorageService.get(ELECTRON_ENCRYPTION_KEY);

        if (!electron_encryption) {
            return null;
        }

        return Aes.fromSeed(new Buffer(electron_encryption, 'hex'));
    }

    /**
     * Remove ELECTRON AES-encryption
     */
    static removeElectronAes() {
        SettingsStorageService.remove(ELECTRON_ENCRYPTION_KEY);
    }

}

export default CryptoElectronService;