import {
    WD_UPDATE_WALLET,
    WD_SET_AES_PRIVATE,
    SET_LOCK_STATUS
} from "../constants/ActionTypes";
import {ChainStore, PrivateKey, key, Aes, hash} from "peerplaysjs-lib";
import {WalletTcomb} from "../stores/tcomb_structs";
import iDB from "idb-instance";
import {Apis, ChainConfig} from "peerplaysjs-ws";

import WalletService from 'services/WalletService';
import KeyGeneratorService from "../services/KeyGeneratorService";

import PrivateKeyActions from "actions/RPrivateKeyActions";

import AccountRepository from 'repositories/AccountRepository';

class ChangePasswordActions {

    /**
     * Generate new wallet after change password
     *
     * @param {string} newPassword
     * @param {string} oldPassword
     * @returns {function(*, *)}
     */
    static generateWallet(newPassword, oldPassword) {
        return (dispatch, getState) => {
            return new Promise( (resolve) => {

                const ownerKey = getState().privateKey.keys.get('owner');

                if (!ownerKey) {
                    return false;
                }

                const oldPasswordAes = Aes.fromSeed( oldPassword );
                const oldEncryptionBuffer = oldPasswordAes.decryptHexToBuffer(getState().walletData.wallet.encryption_key);
                const oldAesPrivate = Aes.fromSeed( oldEncryptionBuffer );

                const oldOwnerPrivateKeyEncrypted = getState().privateKey.keys.get('owner').encrypted_key;
                const oldOwnerPrivateKeyBuffer = oldAesPrivate.decryptHexToBuffer(oldOwnerPrivateKeyEncrypted);
                const oldOwnerPrivateKey = PrivateKey.fromBuffer(oldOwnerPrivateKeyBuffer);
                const pldOwnerPublicKey = oldOwnerPrivateKey.toPublicKey().toPublicKeyString();

                const encryptedKey = getState().walletData.wallet.encrypted_brainkey;
                const oldActivePrivateKeyBuffer = oldAesPrivate.decryptHexToBuffer(encryptedKey);//.toBuffer());
                const oldActivePrivateKey = PrivateKey.fromBuffer(oldActivePrivateKeyBuffer);

                //new wallet settings, owner encrypted and active keys

                // const brainKey =  key.normalize_brainKey(getState().account.currentAccount);
                const passwordAes = Aes.fromSeed( newPassword );
                const encryptionBuffer = key.get_random_key().toBuffer();
                const encryptionKey = passwordAes.encryptToHex( encryptionBuffer );
                const aesPrivate = Aes.fromSeed( encryptionBuffer );

                let keys = KeyGeneratorService.generateKeys(getState().account.currentAccount, newPassword);

                // const activeObjKey = generateActiveKey(brainKey, newPassword);
                const activePrivateKey = keys.active;
                const activePublicKey = activePrivateKey.toPublicKey().toPublicKeyString();
                const activePrivateKeyEncrypted = aesPrivate.encryptToHex(activePrivateKey.toBuffer());

                //const newOwnerPrivateKeyEncrypted = aesPrivate.encryptToHex(ownerPrivateKey.toBuffer());

                const passwordPrivate = PrivateKey.fromSeed( newPassword );
                const passwordPublic = passwordPrivate.toPublicKey().toPublicKeyString();

                const wallet = {
                    public_name : getState().walletData.wallet.public_name,
                    password_pubkey : passwordPublic,
                    encryption_key : encryptionKey,
                    encrypted_brainkey : activePrivateKeyEncrypted,
                    brainkey_pubkey : activePublicKey,
                    brainkey_sequence: 0,
                    brainkey_backup_date : new Date(),
                    created: getState().walletData.wallet.created,
                    last_modified: new Date(),
                    chain_id: Apis.instance().chain_id,
                    backup_date: null
                };

                try {
                    WalletTcomb(wallet);
                } catch(e) {
                    console.error("WALLET DATA FORMAT ERROR:", e);
                }

                AccountRepository.fetchFullAccount(getState().account.currentAccount).then((account) => {
                    AccountRepository.updateKeys(account[1].account, keys.owner.toPublicKey().toPublicKeyString(), keys.active.toPublicKey().toPublicKeyString(), keys.memo.toPublicKey().toPublicKeyString()).then(transactionObject => {
                        resolve({transactionObject, wallet, keys, oldOwnerPrivateKey, oldActivePrivateKey, aesPrivate});
                    });
                });
            });
        }
    }

    /**
     * Password change transaction
     *
     * @param wallet
     * @param keys
     * @param oldOwnerPrivateKey
     * @param aesPrivate
     * @returns {function(*=, *)}
     */
    static changePassword({ wallet, keys, oldOwnerPrivateKey, aesPrivate}) {

        return (dispatch, getState) => {
            return new Promise( (resolve, reject) => {
                AccountRepository.process_transaction(getState().transactionConfirm.transaction.transactionObject, oldOwnerPrivateKey).then((data) => {
                    dispatch({
                        type : WD_UPDATE_WALLET,
                        payload : wallet
                    });

                    dispatch({
                        type: WD_SET_AES_PRIVATE,
                        payload: aesPrivate
                    });


                    WalletService.resetDBPrivateKeysTable().then(() => {
                        WalletService.saveKeysToDB(keys, aesPrivate).then((objectKeys) => {
                            dispatch(PrivateKeyActions.setKeys(objectKeys));
                        });
                    });


                    let walletTransaction = iDB.instance().db().transaction(["wallet"], "readwrite");
                    walletTransaction.objectStore("wallet").clear();
                    walletTransaction.objectStore("wallet").put(wallet);

                    dispatch({
                        type: SET_LOCK_STATUS,
                        payload: false
                    });

                    resolve()
                }).catch(error => reject(error))
            })
        }
    }

}

export default ChangePasswordActions;