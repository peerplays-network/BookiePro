/**
 * Created by shumer on 10/7/16.
 */
import * as Types from '../constants/ActionTypes';

/**
 * Wallet Data Reducer is used to storing wallet data
 *
 * Initial State
 *
 * wallet - our wallet
 * aesPrivate - Wallet AES
 * @type {{wallet: null, aesPrivate: null}}
 */
const initialState = {
    wallet : null,
    aesPrivate : null,
};

export default (state = initialState, action) => {
    switch(action.type) {
        /**
         * Update wallet data
         */
        case Types.WD_UPDATE_WALLET:
            return Object.assign({}, state, {
                wallet : action.payload
            });
        /**
         * RPS Game: Update Reveal moves
         */
        case Types.WD_UPDATE_REVEAL_MOVES_WALLET:

            return {
                ...state,
                wallet: {
                    ...state.wallet,
                    reveal_moves: action.payload
                }
            };

        /**
         * Change wallet AES
         */
        case Types.WD_SET_AES_PRIVATE:
            return Object.assign({}, state, {
                aesPrivate: action.payload
            });
        /**
         * Reset Wallet data reducer
         */
        case Types.WD_RESET:
            return Object.assign({}, state, initialState);
        default:
            /**
             * We return the previous state in the default case
             */
            return state
    }

}