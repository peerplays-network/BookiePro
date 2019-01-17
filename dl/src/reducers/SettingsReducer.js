import Immutable from 'immutable';
import * as Types from '../constants/ActionTypes';
import CONFIG from '../config/main';

const CORE_ASSET = CONFIG.CORE_ASSET;
/**
 * Settings reducer is used to controlling Site settings
 *
 * Initial State
 *
 * @type {{locale: string, showSettles: boolean, disableChat: boolean, ownerKeyPermissions: null, connection: *, faucetAddress: *, unit: *, defaults: {locale: [*], unit: [*], preferredBases: [*], topMarkets: [*]}, hiddenAssets: (*)}}
 */

const initialState = {
  /*general*/
  locale: 'en',
  showSettles: false,
  disableChat: false,
  /*permissions*/
  ownerKeyPermissions: null,
  /*API access*/
  connection: BLOCKCHAIN_URL[0], // eslint-disable-line
  faucetAddress: FAUCET_URL[0], // eslint-disable-line
  unit: CORE_ASSET,
  defaults : {
    locale: [
      'en',
      'cn',
      // "fr",
      // "ko",
      // "de",
      // "es",
      // "tr"
    ],
    unit: [
      CORE_ASSET,
      //"SMARTSMART"
      // "CNY",
      //  "PIXEL.BITCOIN"
      // "EUR",
      // "GBP"
    ],
    preferredBases: [CORE_ASSET, 'PIXEL.BITCOIN', 'PIXEL.STEEM'],
    topMarkets: [
      'PIXEL.BITCOIN', 'PIXEL.STEEM', 'BTS', 'OPEN.ETH', 'ICOO', 'BTC', 'OPEN.LISK',
      'OPEN.STEEM', 'OPEN.DAO', 'PEERPLAYS', 'USD', 'CNY', 'BTSR', 'OBITS',
      'OPEN.DGD', 'EUR', 'TRADE.BTC', 'CASH.BTC', 'GOLD', 'SILVER'
    ]
  },
  hiddenAssets : Immutable.List([])

};


export default function (state = initialState, action) {
  switch (action.type) {
    /**
         * Set initial settings
         */
    case Types.INIT_SETTINGS:
      return Object.assign({}, state, action.payload.newSettings);
      /**
         * Change settings language
         */
    case Types.SWITCH_LOCALE:
      return Object.assign({}, state, {
        locale: action.payload
      });
      /**
         * show|hide settles
         */
    case Types.CHANGE_SETTLE_STATUS:
      return Object.assign({}, state, {
        showSettles: action.payload
      });
      /**
         * show|hide chat
         */
    case Types.CHANGE_CHAT_STATUS:
      return Object.assign({}, state, {
        disableChat: action.payload
      });
      /**
         * change unit //TODO::rm
         */
    case Types.CHANGE_UNIT:
      return Object.assign({}, state, {
        unit: action.payload
      });
      /**
         * change hidden assets
         */
    case Types.CHANGE_HIDDEN_ASSETS:
      return Object.assign({}, state, {
        hiddenAssets : action.payload
      });
      /**
         * add OwnerKey Permissions TODO::rm
         */
    case Types.ADD_OWNER_KEY:
      return {
        ...state,
        ownerKeyPermissions: state.ownerKeyPermissions
          ? state.ownerKeyPermissions.concat(action.payload)
          : action.payload
      };
    default:
      /**
             * We return the previous state in the default case
             */
      return state;
  }

}

;
