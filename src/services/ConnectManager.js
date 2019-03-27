import {ApisInstance, Apis, ConnectionManager} from 'peerplaysjs-ws';
import CONFIG from '../config/main';
let instances = {};
class ConnectManager {
  constructor() {
    this.blockchainUrlIndex = 0;
    this.blockchainUrls = CONFIG.BLOCKCHAIN_URL;
    this.sortedUrls = [];
  }

  /**
   * Close connection to blockchain and remove any related callbacks
   *
   * @memberof ConnectionService
   */
  closeConnectionToBlockchain() {
    console.log('close connection');
    Apis.close();

    // Reset the index if we've gone past the end.
    if (this.blockchainUrlIndex >= this.blockchainUrls.length) {
      this.blockchainUrlIndex = 0;
    }
  }

  /**
   * reconnect to blockchain in case of disconnect
   *
   * @memberof ConnectionService
   */
  reconnectToBlockchain() {
    // Increment the index for the next connection attempt
    this.blockchainUrlIndex++;
    const connectionString = this.sortedUrls[this.blockchainUrlIndex];

    return Apis.instance(connectionString, true).init_promise.then(() => {
      console.log(`%cConnected to: ${connectionString}.`,
        'background: #222 color: green; font-size: large');
    }).catch(() => {
      console.error(`%cConnection to: ${connectionString} failed.`,
        'background: #222; color: red; font-size: large');

      return Promise.reject();
    });
  }

  connectToBlockchain(callback, store) {

    let wsConnectionManager = new ConnectionManager({
      urls: this.blockchainUrls
    });

    if (this.sortedUrls.length > 1) {
      return this.reconnectToBlockchain();
    } else {
      this.callback = callback;
      this.callback(store);

      return wsConnectionManager.sortNodesByLatency().then((list) => {
        return list;
      }).then((list) => {
        this.sortedUrls = list;
        console.log('sorted list: ', this.sortedUrls);
        const connectionString = list[this.blockchainUrlIndex];

        // Display the blockchain api node that we are conencting to.
        console.log(`%cConnected to: ${connectionString}.`,
          'background: #222 color: green; font-size: large');
        return Apis.instance(connectionString, true).init_promise;
      }).catch((err) => {
        console.error('%cNo Available Nodes.',
          'background: #222; color: red; font-size: large: ', err);

        return Promise.reject();
      });
    }
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