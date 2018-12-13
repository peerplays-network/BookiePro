import {
    NOTIFICATIONS_SET_MESSAGES
} from '../constants/ActionTypes';
import Immutable from "immutable";

/**
 * Notifications Reducer is used to saving notification
 * Initial state
 * messages - List of notices
 *
 * @type {{messages: (Immutable.List<T>|*|Immutable.List<any>)}}
 */
let defaultState = {
    messages: Immutable.List()
};

export default (state = defaultState, action) => {

    switch (action.type) {
        /**
         * Set List of notices
         */
        case NOTIFICATIONS_SET_MESSAGES:
            return {
                ...state,
                messages: action.payload.messages
            };
        default:
            return state
    }

};