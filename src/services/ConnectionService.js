import { Apis } from 'peerplaysjs-ws';
import { Config, ConnectionStatus } from '../constants';
import { ConnectionUtils } from '../utility';
import log from 'loglevel';
import CommunicationService from './CommunicationService';

class ConnectionService {
  
  constructor() {
    this.blockchainUrlIndex = 0; // Index of blockchain url to be used from the list
  
    // Listen for the loss of internet.
    window.addEventListener('offline', this.offlineStatusCallback.bind(this));

    // Since the service is now a class, bind to the this instance.
    Apis.setRpcConnectionStatusCallback(this.websocketStatusCallback.bind(this));
    
    // Default callback so we don't have to to validity checking everytime we call the callback.
    this.connectionStatusCallback = () => {};
  }
  
  /**
   * Called when the internet is offline.
   *
   * @memberof ConnectionService
   */
  offlineStatusCallback () {
    log.info('Disconnected from the internet.');
    // Internet is off and websocket is open/ closed
    this.connectionStatusCallback(ConnectionStatus.DISCONNECTED);
    this.closeConnectionToBlockchain();
  }

  /**
   * Called each time the websocket status chagnes.
   *
   * @param {string} message [open, error, reconnected, closed] current status.
   * @memberof ConnectionService
   */
  websocketStatusCallback (message) {
    switch (message) {
      case 'open': {
        log.info('Websocket connection is open.');
        if (ConnectionUtils.isConnectedToInternet()) {
          // Internet is on and websocket is open
  
          // Setup the health check.
          CommunicationService.ping();

          this.connectionStatusCallback(ConnectionStatus.CONNECTED);

        } else {
          // Internet is off and websocket is closed
          this.connectionStatusCallback(ConnectionStatus.DISCONNECTED);
          this.closeConnectionToBlockchain();
        }

        break;
      }
      case 'error': {
        this.connectionStatusCallback(ConnectionStatus.DISCONNECTED);
        this.closeConnectionToBlockchain();
        break;
      }
      case 'closed': {
        log.info('Websocket connection is closed.');
        // Internet is on/off and websocket is closed
        this.connectionStatusCallback(ConnectionStatus.DISCONNECTED);
        this.closeConnectionToBlockchain();
        break;
      }
      default: break;
    }
  }

  /**
   * Close connection to blockchain and remove any related callbacks
   *
   * @memberof ConnectionService
   */
  closeConnectionToBlockchain() {
    // Close connection
    Apis.close();

    // Increment the index fpr the next connection attempt; 
    this.blockchainUrlIndex++;

    // Reset the index if we've gone past the end.
    if (this.blockchainUrlIndex >= Config.blockchainUrls.length) {
      this.blockchainUrlIndex = 0;
    }

    // Stop the health check.
    CommunicationService.clearPing();
  }

  /**
   * Open websocket connection to blockchain
   *
   * @param {function} connectionStatusCallback
   * @returns A promise that resolves when the connection is establised.
   * @memberof ConnectionService
   */
  connectToBlockchain(connectionStatusCallback) {
    // Set connection status callback
    this.connectionStatusCallback = connectionStatusCallback;

    // Set connection status to be connecting
    this.connectionStatusCallback(ConnectionStatus.CONNECTING);

    // Connecting to blockchain
    const connectionString = Config.blockchainUrls[this.blockchainUrlIndex];

    return Apis.instance(connectionString, true).init_promise.then((res) => {
      // Print out which blockchain we are connecting to
      log.debug('Connected to:', res[0] ? res[0].network_name : 'Undefined Blockchain');
    }).catch((error) => {
      // Close residue connection to blockchain
      this.closeConnectionToBlockchain();
    })
  }

}

export default new ConnectionService();
