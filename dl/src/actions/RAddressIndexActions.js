import iDB from '../idb-instance';
import * as Types from '../constants/ActionTypes';
import {key} from 'peerplaysjs-lib';

let timeout;

export default class AddressIndexActions {

  /**
 * add pub key
 *
 * @param publicKey
 * @returns {function(*=, *)}
 */
  static add(publicKey) {
    let self = this;

    return (dispatch, getState)=> {
      dispatch(self.load()).then(() => {
        let dirty = false,
          {pubkeys, saving, addresses} = getState().addressIndex;

        if (pubkeys.has(publicKey)){
          return;
        }

        let pubKeys = new Set();

        pubkeys.forEach((v) => {
          pubKeys.add(v);
        });

        pubKeys.add(publicKey);

        dispatch({
          type : Types.SET_ADDRESS_INDEXES_PUBKEYS,
          payload : pubKeys,
        });

        if (saving){
          return;
        }

        dispatch({
          type: Types.SET_ADDRESS_INDEXES_SAVING_STATUS,
          payload: true,
        });

        // Gather all 5 legacy address formats (see key.addresses)
        var address_strings = key.addresses(publicKey);

        for(let address of address_strings) {
          addresses.set(address, publicKey);
          dirty = true;
        }

        if( dirty ) {
          dispatch({
            type : Types.SET_ADDRESS_INDEXES,
            payload : addresses,
          });

          clearTimeout(timeout);

          timeout = setTimeout(()=> {
            dispatch({
              type: Types.SET_ADDRESS_INDEXES_SAVING_STATUS,
              payload: false,
            });

            return iDB.root.setProperty('AddressIndex', addresses.toObject());
          }, 100);
        } else {
          dispatch({
            type: Types.SET_ADDRESS_INDEXES_SAVING_STATUS,
            payload: false,
          });
        }
      }).catch((e) => {
        throw e;
      });
    };
  }
}