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