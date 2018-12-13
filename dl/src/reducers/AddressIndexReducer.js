/**
 * Created by shumer on 10/19/16.
 */
import Immutable from "immutable";
import * as Types from '../constants/ActionTypes';

/**
 * Address Index Reducer is used to saving pub keys
 * TODO::rm if is not used
 * Initial state
 * @type {{addresses: (*), saving: boolean, pubkeys: Set}}
 */
const initialState = {
    addresses: Immutable.Map(),
    saving: false,
    pubkeys : new Set()
};

export default (state = initialState, action)=>{
    switch(action.type){
        case Types.SET_ADDRESS_INDEXES:
            return Object.assign({}, state, {
                addresses : action.payload
            });
        case Types.SET_ADDRESS_INDEXES_SAVING_STATUS:
            return Object.assign({}, state, {
                saving : action.payload
            });
        case Types.SET_ADDRESS_INDEXES_PUBKEYS:
            return Object.assign({}, state, {
                pubkeys : action.payload
            });
        default:
            return state;
    }
};