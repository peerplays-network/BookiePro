import {key,PrivateKey} from 'peerplaysjs-lib';

class KeyGeneratorService {
  /**
   * Generate keys role=("owner"|"active"|"memo") from (password + accountName + role)
   *
   * @param accountName String
   * @param password String
   * @param roles Array
   * @returns Object of roles
   */
  static generateKeys(accountName, password, roles = ['owner', 'active', 'memo']) {
    let keys = {};

    roles.forEach((role) => {
      keys[role] = PrivateKey.fromSeed(key.normalize_brainKey(password + accountName + role));
    });

    return keys;
  }
}

export default KeyGeneratorService;