import {ApisInstance} from 'peerplaysjs-ws';
import {Apis} from 'peerplaysjs-ws';
import CONFIG from '../config/main';
import {Manager} from '../../../peerplaysjs-ws/';
let instances = {};

class ConnectManager {
  constructor() {
    this.blockchainUrlIndex = 0;
    this.blockchainUrls = CONFIG.BLOCKCHAIN_URL;
  }

  /**
   * Close connection to blockchain and remove any related callbacks
   *
   * @memberof ConnectionService
   */
  closeConnectionToBlockchain() {
    Apis.close();

    // Increment the index for the next connection attempt
    this.blockchainUrlIndex++;

    // Reset the index if we've gone past the end.
    if (this.blockchainUrlIndex >= this.blockchainUrls.length) {
      this.blockchainUrlIndex = 0;
    }
  }

  connectToBlockchain(callback, store) {
    this.callback = callback;
    this.callback(store);

    //const connectionString = this.blockchainUrls[this.blockchainUrlIndex];
    let manager = new Manager({
      urls: this.blockchainUrls
    });

    // Display the blockchain api node that we are conencting to.

    return manager.sortNodesByLatency().then((list) => {
      console.log('response: ', list);
      return list;
    }).then((list) => {
      const connectionString = list[this.blockchainUrlIndex];
      console.log(`%cConnected to: ${connectionString}.`,
        'background: #222 color: green; font-size: large');
      return Apis.instance(connectionString, true).init_promise;
    }).catch(() => {
      console.error('%cNo Available Nodes.',
        'background: #222; color: red; font-size: large');

      return Promise.reject();
    });
  }

  /**
   * @param {string} cs
   * @param {ApisInstance} instance
   */
  setConnection(cs, instance) {
    instances[cs] = instance;
  }

  /**
   * WebSocket status callback
   * @param {function} callback
   */
  setDefaultRpcConnectionStatusCallback(callback) {
    return Apis.instance().setRpcConnectionStatusCallback(callback);
  }

  /**
   * Connects to the blockchain with the provided connectionString.
   *
   * @param {String} connectionString
   */
  setDefaultConnection(connectionString) {
    return Apis.instance(connectionString, true);
  }

  /**
   *
   * @param {String} cs
   * @returns {*}
   */
  getConnection(cs) {
    if (!instances[cs]) {
      console.log('instance', instance);
      let instance = new ApisInstance();
      instance.connect(cs);
      ConnectManager.setConnection(cs, instance);
    }

    return instances[cs];
  }
}

export default new ConnectManager();