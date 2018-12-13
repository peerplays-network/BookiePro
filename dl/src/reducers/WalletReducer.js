import * as Types from '../constants/ActionTypes';

/**
 * Wallet Reducer is used to unlocking and locking the Modal window
 *
 * Initial State
 *
 * locked - Wallet is closed or not
 * isOpen - Show|Hide Unlock modal
 * success - Unlock modal: success Promise
 * cancel - Unlock modal: cancel Promise
 * @type {{locked: boolean, isOpen: boolean, success: null|Promise, cancel: null|Promise}}
 */
const initialState = {
	locked: true,
	isOpen: false,
    success: null,
    cancel: null
};

export default function (state = initialState, action){
	switch(action.type) {
        /**
		 *
         */
		case Types.SET_LOCK_STATUS:
			return Object.assign({}, state, {
				locked : action.payload
			});
        /**
		 * Show|Hide Unlock modal
         */
		case Types.SET_POSITION:
			return Object.assign({}, state, {
				isOpen : action.payload
			});
        /**
		 * reset wallet data
         */
		case Types.WALLET_RESET:
			return Object.assign({}, state, initialState);



    /**
     * New
     */

        /**
		 * Show|Hide Unlock modal //here we work with promises
         */
        case Types.SHOW_WALLET_PASSWORD_WINDOW:
            return Object.assign({}, state, {
                isOpen : action.payload.isOpen,
                success: action.payload.success,
                cancel: action.payload.cancel
            });

        /**
		 * reset Unlock modal //here we work with promises
         */
        case Types.RESET_WALLET_PASSWORD_WINDOW:
            return Object.assign({}, state, {
                isOpen : false,
                success: null,
                cancel: null
            });

		default:
            /**
             * We return the previous state in the default case
             */
			return state;
	}
}
