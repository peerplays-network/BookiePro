import {ApisInstance} from "peerplaysjs-ws";
import {Apis} from "peerplaysjs-ws";
import CONFIG from '../config/main';

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

    const connectionString = this.blockchainUrls[this.blockchainUrlIndex];

    // Display the blockchain api node that we are conencting to.
    console.log("Attempting connection to: ", connectionString);
    
    return Apis.instance(connectionString, true).init_promise.then((res) => {
      console.log('Connected to: ', connectionString);
    }).catch((err) => {
      console.log('Connection to: ', connectionString, ' failed.');
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
      console.log('instance', instance)
      let instance = new ApisInstance();
      instance.connect(cs);
      ConnectManager.setConnection(cs, instance);
    }
    return instances[cs];
  }
}

export default new ConnectManager();