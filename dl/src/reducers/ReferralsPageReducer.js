import {ActionTypes} from '../constants/ActionTypes';

/**
 * Referrals Reducer is used to controlling a Referral Page
 *
 * Initial State
 *
 * account - Controlled account
 *
 * @type {{account: null}}
 */
let defaultState = {
  account: null
};

export default function (state = defaultState, action) {
  switch (action.type) {
    // Set controlled account
    case ActionTypes.REFERRALS_SET:
      return Object.assign({}, state, {
        account: action.payload.account
      });
    default:
      // We return the previous state in the default case
      return state;
  }
}