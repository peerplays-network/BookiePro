import {key, PrivateKey} from "graphenejs-lib";

class KeyGeneratorService {

  // Generate private keys given accountName and password
  static generateKeys(accountName, password, roles = ["owner", "active", "memo"]) {
    let keys = {};
    roles.forEach((role) => {
      keys[role] = PrivateKey.fromSeed(key.normalize_brainKey(password + accountName + role));
    });
    return keys;
  }
}

export default KeyGeneratorService;
