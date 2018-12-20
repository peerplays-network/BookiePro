import {ActionTypes} from '../constants/ActionTypes';

/**
 * Software Update Reducer is used to monitoring updates
 *
 * Initial State
 * account - user controlled account
 * @type {{account: null}}
 */
let defaultState = {
  /**
   * Controlled account
   */
  account: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    /**
     * Update controlled account
     */
    case ActionTypes.SOFTWARE_UPDATE_SET_ACCOUNT_DATA:
      return {
        ...state,
        account: action.payload.account
      };
    default:
      /**
       * We return the previous state in the default case
       */
      return state;
  }
};