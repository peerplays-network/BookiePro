import { Apis } from 'peerplaysjs-ws';
import { Config, ConnectionStatus } from '../constants';
import { ConnectionUtils } from '../utility';
import log from 'loglevel';

class ConnectionService {
  
  constructor() {
    this.blockchainUrlIndex = 0; // Index of blockchain url to be used from the list
  
    window.addEventListener('online', this.onlineStatusCallback.bind(this));
    window.addEventListener('offline', this.offlineStatusCallback.bind(this));

    Apis.setRpcConnectionStatusCallback(this.websocketStatusCallback.bind(this));
    
    this.connectionStatusCallback = () => {};
  }
  
  // Define new callback
  onlineStatusCallback () {
    log.info('Connected to Internet.');
    if (ConnectionUtils.isWebsocketOpen()) {
      // Internet is on and websocket is open
      this.connectionStatusCallback(ConnectionStatus.CONNECTED);
    } else {
      // Internet is on but websocket is closed
      this.connectionStatusCallback(ConnectionStatus.DISCONNECTED);
    }
  }

  offlineStatusCallback () {
    log.info('Disconnected from the internet.');
    // Internet is off and websocket is open/ closed
    this.connectionStatusCallback(ConnectionStatus.DISCONNECTED);
  }

  websocketStatusCallback (message) {
    switch (message) {
      case 'open': {
        log.info('Websocket connection is open.');
        if (ConnectionUtils.isConnectedToInternet()) {
          // Internet is on and websocket is open
          this.connectionStatusCallback(ConnectionStatus.CONNECTED);
        } else {
          // Internet is off and websocket is closed
          this.connectionStatusCallback(ConnectionStatus.DISCONNECTED);
          this.closeConnectionToBlockchain();
        }

        // TODO: Resubscribe here if we have a list of subscriptions.

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
   */
  closeConnectionToBlockchain() {
    // Close connection
    Apis.close();
  }

  /**
   * Open websocket connection to blockchain
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

      // Increment the index fpr the next connection attempt; 
      this.blockchainUrlIndex++;

      // Reset the index if we've gone past the end.
      if (this.blockchainUrlIndex >= Config.blockchainUrls.length) {
        this.blockchainUrlIndex = 0;
      }

      // Close residue connection to blockchain
      this.closeConnectionToBlockchain();
    })
  }

}

export default new ConnectionService();
