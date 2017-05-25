import { Apis, ChainConfig } from 'graphenejs-ws';
import { Config, ConnectionStatus } from '../constants';
import { ConnectionUtils } from '../utility';
import log from 'loglevel';
const connectionString = Config.blockchainUrls[0];

class ConnectionService {
  static onlineStatusCallback = null;
  static offlineStatusCallback = null;
  static websocketStatusCallback = null;

  /**
   * Remove any registered callback to connection (online, offline, websocket)
   */
  static removeConnectionStatusCallback() {
    if (this.onlineStatusCallback) {
      window.removeEventListener('online', this.onlineStatusCallback);
      this.onlineStatusCallback = null;
    }
    if (this.offlineStatusCallback) {
      window.removeEventListener('offline', this.offlineStatusCallback);
      this.offlineStatusCallback = null;
    }
    if (this.websocketStatusCallback) {
      Apis.setRpcConnectionStatusCallback(null);
      this.websocketStatusCallback = null;
    }
  }

  /**
   * Register connection callback
   */
  static setConnectionStatusCallback(connectionStatusCallback) {
    // Remove any existing callback
    this.removeConnectionStatusCallback();

    // Define new callback
    this.onlineStatusCallback = () => {
      log.info('Connected to Internet.');
      if (ConnectionUtils.isWebsocketOpen()) {
        // Internet is on and websocket is open
        connectionStatusCallback(ConnectionStatus.CONNECTED);
      } else {
        // Internet is on but websocket is closed
        connectionStatusCallback(ConnectionStatus.DISCONNECTED);
      }
    };

    this.offlineStatusCallback = () => {
      log.info('Disconnected from the internet.');
      // Internet is off and websocket is open/ closed
      connectionStatusCallback(ConnectionStatus.DISCONNECTED);
    }

    this.websocketStatusCallback = (message) => {
      switch (message) {
        case 'open': {
          log.info('Websocket connection is open.');
          if (ConnectionUtils.isConnectedToInternet()) {
            // Internet is on and websocket is open
            connectionStatusCallback(ConnectionStatus.CONNECTED);
          } else {
            // Internet is on and websocket is closed
            connectionStatusCallback(ConnectionStatus.DISCONNECTED);
          }

          break;
        }
        case 'closed': {
          log.info('Websocket connection is closed.');
          // Internet is on/off and websocket is closed
          connectionStatusCallback(ConnectionStatus.DISCONNECTED);
          break;
        }
        default: break;
      }
    };

    // Register them
    window.addEventListener('online', this.onlineStatusCallback);
    window.addEventListener('offline', this.offlineStatusCallback);
    Apis.setRpcConnectionStatusCallback(this.websocketStatusCallback);
  }

  /**
   * Close connection to blockchain and remove any related callbacks
   */
  static closeConnectionToBlockchain() {
    // Close connection
    Apis.close();
    // Remove any status callback handler
    this.removeConnectionStatusCallback();
  }

  /**
   * Open websocket connection to blockchain
   */
  static connectToBlockchain(connectionStatusCallback, attempt=3) {
    // Set connection status callback
    ConnectionService.setConnectionStatusCallback(connectionStatusCallback);
    // Set connection status to be connecting
    connectionStatusCallback(ConnectionStatus.CONNECTING);
    // Connecting to blockchain
    return Apis.instance(connectionString, true).init_promise.then((res) => {
      // Print out which blockchain we are connecting to
      log.debug('Connected to:', res[0] ? res[0].network_name : 'Undefined Blockchain');
      // This is set to TEST since Peerplays Blockchain Testnet is currently using TEST prefix
      ChainConfig.setPrefix("PPY");
    }).catch((error) => {
      log.error('Fail to connect to blockchain', error);
      // Close residue connection to blockchain
      this.closeConnectionToBlockchain();
      // Retry if needed
      if (attempt > 0) {
        // Retry to connect
        log.info('Retry connecting to blockchain');
        return ConnectionService.connectToBlockchain(connectionStatusCallback, attempt-1);
      } else {
        // Give up, throw the error to be caught by the outer promise handler
        throw error;
      }
    })
  }

}

export default ConnectionService;
