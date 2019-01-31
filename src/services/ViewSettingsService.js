import ls from 'common/localStorage';
import Immutable from 'immutable';

const STORAGE_KEY = '__peerplays__';
const VIEW_SETTINGS_KEY = 'viewSettings_v3';
let ss = new ls(STORAGE_KEY);
let viewSettings = Immutable.Map(ss.get(VIEW_SETTINGS_KEY));

initViewSettings();

function initViewSettings() {
  let defaultViewSettings = {
    activeSetting: 'general',
    connection: [BLOCKCHAIN_URL]
  };
  let reset = false;

  for (let key in defaultViewSettings) {
    if (!viewSettings.get(key)) {
      viewSettings = viewSettings.set(key, defaultViewSettings[key]);
      reset = true;
    }
  }

  if (reset) {
    let vSettings = viewSettings.toJS();
    ss.set(VIEW_SETTINGS_KEY, vSettings);
  }
}

/**
 *
 * @param item
 * @returns {null}
 */
export function getViewSettings(item) {
  let data = ss.get(VIEW_SETTINGS_KEY);

  return (data && (item in data)) ? data[item] : null;
}

/**
 *
 * @param data
 * @returns {any}
 */
export function setViewSettings(data) {
  for (let key in data) {
    viewSettings = viewSettings.set(key, data[key]);
  }

  let vSettings = viewSettings.toJS();
  ss.set(VIEW_SETTINGS_KEY, vSettings);

  return vSettings;
}
