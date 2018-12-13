import ls from "../common/localStorage";
import * as Types from '../constants/ActionTypes';
import Immutable from "immutable";
import { switchLibraryLocale } from "../services/LocaleService";

const STORAGE_KEY = "__peerplays__";
const SETTINGS_KEY = "settings_v3";

let ss = new ls(STORAGE_KEY);
let storageSettings = ss.get(SETTINGS_KEY);

let locales = {};
["cn", "de", "es", "fr", "ko", "tr"].forEach(locale => {
  locales[locale] = require("json!assets/locales/locale-" + locale + ".json");
});

/**
 * Init/assign settings from storage
 *
 * @returns {Function}
 */
export function initSettings() {
    return function (dispatch, getState) {
        let state = getState();
        if (storageSettings) {
            let newSettings = {};
            let needUpdate = false;
            for (let key in storageSettings) {
                if (storageSettings[key] !== state.settings[key]) {
                    if(key == "hiddenAssets"){
                        newSettings[key] = Immutable.List(storageSettings[key]);
                    } else {
                        newSettings[key] = storageSettings[key];
                    }

                    needUpdate = true;
                }
            }
            if (needUpdate) {
              let locale = newSettings["locale"];
                switchLibraryLocale({locale, localeData: locales[locale]});
                dispatch({
                    type: Types.INIT_SETTINGS,
                    payload: {
                        newSettings: newSettings
                    }
                });
            }
        }
    };
}

/**
 * Redux Action Creator (SWITCH_LOCALE)
 * Change settings language
 * @param {string} locale - ISO
 * @returns {function(*)}
 */

export function switchLocale(locale) {
  return dispatch => {
    changeStorageValue("locale", locale);
    switchLibraryLocale({locale, localeData: locales[locale]});
    dispatch({
        type: Types.SWITCH_LOCALE,
        payload: locale
    });
  };
}

/**
 * Redux Action Creator (CHANGE_SETTLE_STATUS)
 * TODO::rm
 * show|hide settles
 * @returns {function(*, *)}
 */
export function changeSettleStatus() {
  let status = storageSettings.showSettles ? false : true;
  return (dispatch, getState) => {
    changeStorageValue("showSettles", status);
    dispatch({
        type: Types.CHANGE_SETTLE_STATUS,
        payload: status
    });
  };
}

/**
 * Redux Action Creator (CHANGE_CHAT_STATUS)
 * show|hide chat
 * TODO::rm
 * @returns {function(*, *)}
 */
export function changeChatStatus() {
  let status = storageSettings.disableChat ? false : true;
  return (dispatch, getState) => {
    changeStorageValue("disableChat", status);
    dispatch({
        type: Types.CHANGE_CHAT_STATUS,
        payload: status
    });
  };
}


/**
 * Redux Action Creator (ADD_OWNER_KEY)
 * TODO::rm
 * add OwnerKey Permissions
 * @param data
 * @returns {function(*, *)}
 */
export function addOwnerKeyPermissions(data){
  return (dispatch, getState) => {
    dispatch({
      type: Types.ADD_OWNER_KEY,
      payload: data
    })
  }
}

/**
 * Redux Action Creator (CHANGE_UNIT)
 * TODO::rm
 * @param unit
 * @returns {Function}
 */
export function changeUnit(unit) {

    return function (dispatch) {
        changeStorageValue('unit', unit);

        dispatch({
            type: Types.CHANGE_UNIT,
            payload: unit
        });
    }
}

/**
 *
 * Redux Action Creator (CHANGE_FAUCET_ADDRESS)
 * Change current faucet address
 *
 * @param {string} address
 * @returns {Function}
 */
export function changeFaucetAddress(address){
    return function (dispatch) {
        changeStorageValue('faucetAddress', address);

        dispatch({
            type: Types.CHANGE_FAUCET_ADDRESS,
            payload: address
        });
    }
}

/**
 * Redux Action Creator (CHANGE_HIDDEN_ASSETS)
 * Add asset to hidden assets
 * @param unit
 * @returns {Function}
 */
export function addAssetToHidden(unit) {
    return function (dispatch, getState) {
        let hiddenAssets = getState().settings.hiddenAssets;

        hiddenAssets = hiddenAssets.push(unit);

        changeStorageValue('hiddenAssets', hiddenAssets.toJS());

        dispatch({
            type: Types.CHANGE_HIDDEN_ASSETS,
            payload: hiddenAssets
        });
    }
}
/**
 * Redux Action Creator (CHANGE_HIDDEN_ASSETS)
 *
 * remove asset from hidden assets
 *
 * @param unit
 * @returns {Function}
 */
export function removeAssetToHidden(unit) {

    return function (dispatch, getState) {
        let hiddenAssets = getState().settings.hiddenAssets;

        if(hiddenAssets.indexOf(unit) != -1){
            hiddenAssets = hiddenAssets.delete(hiddenAssets.indexOf(unit));

            changeStorageValue('hiddenAssets', hiddenAssets.toJS());

            dispatch({
                type: Types.CHANGE_HIDDEN_ASSETS,
                payload: hiddenAssets
            });
        }
    }
}



// export function
function changeStorageValue(k, val) {

    if (!storageSettings) {
        storageSettings = {};
    }

    storageSettings[k] = val;

    ss.set(SETTINGS_KEY, storageSettings);


}
