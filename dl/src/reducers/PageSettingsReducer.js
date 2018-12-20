import {ActionTypes} from '../constants/ActionTypes';
import {getViewSettings} from 'services/ViewSettingsService';
import Immutable from 'immutable';

let activeSetting = getViewSettings('activeSetting') ? getViewSettings('activeSetting') : 'general';
let connection = getViewSettings('connection') ? getViewSettings('connection') : [BLOCKCHAIN_URL];

/**
 *  Page Settings Reducer is used to controlling Settings page tabs
 *
 * Initial State
 *
 * @type {{activeSetting: string, connection: [*], menuEntries: [*], settingEntries: {general: [*], access: [*]}, defaults: {showSettles: [*], disableChat: [*], connection: *, faucetAddress: *}, claim_error: null, claim_privateKey: null, claim_balances: (*)}}
 */
const initialState = {

  /* Active menu item (Sub menu)*/

  activeSetting: activeSetting,
  // Current connection
  connection: connection,

  // Tabs
  menuEntries: [
    'general',
    'password',
    'permissions',
    'API access'
  ],
  settingEntries: {
    general: ['locale', 'showSettles', 'disableChat'],
    access: ['connection', 'faucetAddress']
  },
  //Default settings
  defaults: {
    showSettles: [{
      translate: 'yes'
    },
    {
      translate: 'no'
    }
    ],
    disableChat: [{
      translate: 'yes'
    },
    {
      translate: 'no'
    }
    ],
    connection: BLOCKCHAIN_URL,
    faucetAddress: FAUCET_URL,
  },
  // Claim page(sharedrop page)
  claim_error: null,
  claim_privateKey: null,
  claim_balances: Immutable.List()
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_CONNECTION:
      return Object.assign({}, state, {
        connection: state.connection.concat(action.payload)
      });
    case ActionTypes.REMOVE_CONNECTION:
      return Object.assign({}, state, {
        connection: state.connection.filter((e) => e !== action.payload)
      });
      /* Sharedrop page claim */

      // set common key error(field Owner Key)
    case ActionTypes.SETTINGS_CLAIM_SET_KEY_ERROR:
      return Object.assign({}, state, {
        claim_error: action.payload.claim_error
      });
      // reset page
    case ActionTypes.SETTINGS_CLAIM_RESET:
      return Object.assign({}, state, {
        claim_error: null,
        claim_privateKey: null,
        claim_balances: Immutable.List()
      });
      // reset balances list only(without owner key)
    case ActionTypes.SETTINGS_CLAIM_RESET_BALANCES:
      return Object.assign({}, state, {
        claim_balances: Immutable.List()
      });
      // Set key with which we will work
    case ActionTypes.SETTINGS_CLAIM_SET_PRIVATE_KEY:
      return Object.assign({}, state, {
        claim_privateKey: action.payload.claim_privateKey
      });
      // set claim balances list
    case ActionTypes.SETTINGS_CLAIM_SET_BALANCES_DATA:
      return Object.assign({}, state, {
        claim_balances: action.payload.claim_balances
      });
    default:
      // We return the previous state in the default case
      return state;
  }
}