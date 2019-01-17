import {ApisInstance} from 'peerplaysjs-ws';
import {Apis} from 'peerplaysjs-ws';

let instances = {};

class ConnectManager {
  /**
   *
   * @param {string} cs
   * @param {ApisInstance} instance
   */
  static setConnection(cs, instance) {
    instances[cs] = instance;
  }

  /**
   * WebSocket status callback
   * @param {function} callback
   */
  static setDefaultRpcConnectionStatusCallback(callback) {
    return Apis.instance().setRpcConnectionStatusCallback(callback);
  }

  /**
   *
   * @param {String} connectionString
   */
  static setDefaultConnection(connectionString) {
    return Apis.instance(connectionString, true);
  }

  /**
   *
   * @param {String} cs
   * @returns {*}
   */
  static getConnection(cs) {
    if (!instances[cs]) {
      let instance = new ApisInstance();
      instance.connect(cs);
      ConnectManager.setConnection(cs, instance);
    }

    return instances[cs];
  }
}

export default ConnectManager;