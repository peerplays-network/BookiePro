import StorageService from "./StorageService";
const SETTINGS_KEY = "settings_v3";

/**
 * Settings Storage Service
 *
 * Here we work with Local Storage
 */
class SettingsStorageService {
  static get(param) {
    let settings = StorageService.get(SETTINGS_KEY);

    if (settings && typeof settings[param] !== "undefined") {
      return settings[param];
    }
    return null;
  }

  static set(k, val) {
    let settings = StorageService.get(SETTINGS_KEY);
    if (!settings) {
      settings = {};
    }

    settings[k] = val;
    StorageService.set(SETTINGS_KEY, settings);
  }

  static remove(k) {
    let settings = StorageService.get(SETTINGS_KEY);

    if (!settings) {
      settings = {};
    }

    delete settings[k];
    StorageService.set(SETTINGS_KEY, settings);
  }
}

export default SettingsStorageService;