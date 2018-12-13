import * as Types from "../constants/ActionTypes";
import idb_helper from "../idb-helper";
import Immutable from "immutable";
import {PrivateKeyTcomb} from "stores/tcomb_structs";
import AddressIndexActions from './RAddressIndexActions';


import {ChainStore, PrivateKey} from "peerplaysjs-lib";

export default class PrivateKeyActions {
    /**
     *
     * Redux Action Creator (PRIVATE_KEY_SET)
     * Set new Private Keys
     *
     * @param keys
     * @returns {function(*)}
     */
    static setKeys(keys) {
        return (dispatch) => {
            dispatch({
                type: Types.PRIVATE_KEY_SET,
                payload: {
                    keys: Immutable.Map(keys)
                }
            })
        }
    }

    /**
     * Add Private key to iDB
     *
     * @param private_key_object
     * @param transaction
     * @returns {function(*, *)}
     */
    static addKey(private_key_object, transaction){
        let self = this;
        return (dispatch, getState)=>{
            return new Promise((resolve)=>{
                let {keys} = getState().privateKey;

                if(keys.has(private_key_object.pubkey)) {
                    resolve({ result : "duplicate", id : null});
                    return;
                }



                keys = keys.set(private_key_object.pubkey, PrivateKeyTcomb(private_key_object));

                dispatch(AddressIndexActions.add(private_key_object.pubkey));

                PrivateKeyTcomb(private_key_object);

                let duplicate = false;

                idb_helper.add(transaction.objectStore("private_keys"), private_key_object).catch( event => {
                    // ignore_duplicates
                    let error = event.target.error;

                    console.log('... error', error, event);

                    if( error.name != 'ConstraintError' || error.message.indexOf('by_encrypted_key') == -1) {

                        console.error("privateKeyStorage_error_add_key", error);

                        throw event
                    } else {
                        duplicate = true;

                        event.preventDefault();
                    }
                }).then( ()=> {
                    if(duplicate){
                        resolve({result:"duplicate",id:null});
                    }

                    if( private_key_object.brainkey_sequence == null){
                        // CachedPropertiesActions.setProperty("backup_recommended", true);
                    }

                    idb_helper.on_transaction_end(transaction).then(() => {

                    });

                    resolve({ result: "added", id: private_key_object.id })
                });
            });
        };
    }
}