import ls from '../common/localStorage';
import ActionTypes from '../constants/ActionTypes';
import Immutable from 'immutable';
import {
  switchLibraryLocale
} from '../services/LocaleService';

const STORAGE_KEY = '__peerplays__';
const SETTINGS_KEY = 'settings_v3';

let ss = new ls(STORAGE_KEY);
let storageSettings = ss.get(SETTINGS_KEY);
let locales = {};
['cn', 'de', 'es', 'fr', 'ko', 'tr'].forEach((locale) => {
  locales[locale] = require('json!assets/locales/locale-' + locale + '.json');
});

// export function
function changeStorageValue(k, val) {
  if (!storageSettings) {
    storageSettings = {};
  }

  storageSettings[k] = val;
  ss.set(SETTINGS_KEY, storageSettings);
}

class RSettingsAcions {
  /**
   * Init/assign settings from storage
   *
   * @returns {Function}
   */
  static initSettings() {
    return function (dispatch, getState) {
      let state = getState();

      if (storageSettings) {
        let newSettings = {};
        let needUpdate = false;

        for (let key in storageSettings) {
          if (storageSettings[key] !== state.settings[key]) {
            if (key === 'hiddenAssets') {
              newSettings[key] = Immutable.List(storageSettings[key]);
            } else {
              newSettings[key] = storageSettings[key];
            }

            needUpdate = true;
          }
        }

        if (needUpdate) {
          let locale = newSettings['locale'];
          switchLibraryLocale({
            locale,
            localeData: locales[locale]
          });
          dispatch({
            type: ActionTypes.INIT_SETTINGS,
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
  static switchLocale(locale) {
    return (dispatch) => {
      changeStorageValue('locale', locale);
      switchLibraryLocale({
        locale,
        localeData: locales[locale]
      });
      dispatch({
        type: ActionTypes.SWITCH_LOCALE,
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
  static changeSettleStatus() {
    let status = storageSettings.showSettles ? false : true;

    return (dispatch) => {
      changeStorageValue('showSettles', status);
      dispatch({
        type: ActionTypes.CHANGE_SETTLE_STATUS,
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
  static changeChatStatus() {
    let status = storageSettings.disableChat ? false : true;

    return (dispatch) => {
      changeStorageValue('disableChat', status);
      dispatch({
        type: ActionTypes.CHANGE_CHAT_STATUS,
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
  static addOwnerKeyPermissions(data) {
    return (dispatch, getState) => { // eslint-disable-line
      dispatch({
        type: ActionTypes.ADD_OWNER_KEY,
        payload: data
      });
    };
  }

  /**
   * Redux Action Creator (CHANGE_UNIT)
   * TODO::rm
   * @param unit
   * @returns {Function}
   */
  static changeUnit(unit) {
    return function (dispatch) {
      changeStorageValue('unit', unit);
      dispatch({
        type: ActionTypes.CHANGE_UNIT,
        payload: unit
      });
    };
  }

  /**
   * Redux Action Creator (CHANGE_HIDDEN_ASSETS)
   * Add asset to hidden assets
   * @param unit
   * @returns {Function}
   */
  static addAssetToHidden(unit) {
    return function (dispatch, getState) {
      let hiddenAssets = getState().settings.hiddenAssets;
      hiddenAssets = hiddenAssets.push(unit);
      changeStorageValue('hiddenAssets', hiddenAssets.toJS());
      dispatch({
        type: ActionTypes.CHANGE_HIDDEN_ASSETS,
        payload: hiddenAssets
      });
    };
  }

  /**
   * Redux Action Creator (CHANGE_HIDDEN_ASSETS)
   *
   * remove asset from hidden assets
   *
   * @param unit
   * @returns {Function}
   */
  static removeAssetToHidden(unit) {
    return function (dispatch, getState) {
      let hiddenAssets = getState().settings.hiddenAssets;

      if (hiddenAssets.indexOf(unit) !== -1) {
        hiddenAssets = hiddenAssets.delete(hiddenAssets.indexOf(unit));

        changeStorageValue('hiddenAssets', hiddenAssets.toJS());

        dispatch({
          type: ActionTypes.CHANGE_HIDDEN_ASSETS,
          payload: hiddenAssets
        });
      }
    };
  }
}

export default RSettingsAcions;