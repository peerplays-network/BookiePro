/**
 * Created by shumer on 10/5/16.
 */
import Immutable from 'immutable';
import {ActionTypes} from '../constants/ActionTypes';

/**
 * Private Key Reducer is used to controlling Private keys
 * Initial State
 * keys - Private keys
 * @type {{keys: (*)}}
 */
const initialState = {
  keys: Immutable.Map()
};

export default (state = initialState, action) => {
  switch (action.type) {
    // Set new Private Keys
    case ActionTypes.PRIVATE_KEY_SET:
      return Object.assign({}, state, {
        keys: action.payload.keys
      });
    default:
      // We return the previous state in the default case
      return state;
  }
};