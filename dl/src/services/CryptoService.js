import {Aes} from 'peerplaysjs-lib';

class CryptoService {
  /**
   * get AES by password and encryption_key
   *
   * @param password
   * @param encryption_key
   * @returns {*}
   */
  static getAesPrivate(password, encryption_key) {
    let password_aes = Aes.fromSeed(password),
      encryption_plainbuffer = password_aes.decryptHexToBuffer(encryption_key);

    return Aes.fromSeed(encryption_plainbuffer);
  }
}

export default CryptoService;