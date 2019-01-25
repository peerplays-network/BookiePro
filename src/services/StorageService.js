import LS from '../common/localStorage';

let accountStorage = new LS('__peerplays__');

/**
 * Base Storage service
 *
 * Here we work with Local Storage
 */
class StorageService {
  static get() {
    return accountStorage.get.apply(accountStorage, arguments);
  }

  static set() {
    return accountStorage.set.apply(accountStorage, arguments);
  }

  static remove() {
    return accountStorage.remove.apply(accountStorage, arguments);
  }
}

export default StorageService;