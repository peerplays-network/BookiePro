let ls = window.localStorage;
import BookieModes from '../constants/BookieModes';
import StorageItems from '../constants/StorageItems';

/**
 * Base Storage service
 *
 * Used to interact with the browser's local storage.
 */
class StorageUtils {
  // Generic storage get
  static get(key) {
    return ls.getItem(key);
  }

  static set(key, value) {
    return ls.setItem(key, value);
  }

  static remove(key) {
    return ls.removeItem(key);
  }

  // Get Bookie Mode from LS - has some extra logic to avoid invalid values
  static getBookMode() {
    const mode = ls.getItem(StorageItems.BOOKIE_MODE_PREFERENCE);
    
    if (mode === BookieModes.EXCHANGE || mode === BookieModes.SPORTSBOOK) {
      return mode;
    } else {
      return BookieModes.EXCHANGE;
    }

  }

}

export default StorageUtils;
