import {ActionTypes} from '../constants/ActionTypes';

/**
 * Claim Bts Reducer is used to controlling BTS Sharedrop page
 *
 * status - Btn Status (default|loading)
 * errors - ClaimBtsForm: common errors
 * @type {{status: string, errors: Array}}
 */
let defaultState = {
  status: 'default',
  errors: []
};

export default function (state = defaultState, action) {
  switch (action.type) {
    // set btn status (default|loading)
    case ActionTypes.CLAIM_BTS_SET_STATUS:
      return {
        ...state,
        status: action.payload.status
      };
      // ClaimBtsForm: Setting Common validation errors
    case ActionTypes.CLAIM_BTS_SET_ERRORS:
      return {
        ...state,
        errors: action.payload.errors
      };
    default:
      // We return the previous state in the default case
      return state;
  }
}