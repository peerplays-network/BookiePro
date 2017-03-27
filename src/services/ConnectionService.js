import { Apis, ChainConfig } from 'graphenejs-ws';
import { ChainStore } from 'graphenejs-lib';
import { Config } from '../constants';

const MAX_ATTEMPT = 3;
const connectionString = Config.blockchainUrls[0];

class ConnectionService {

  static connectToBlockchain(wsStatusCallback, attempt=MAX_ATTEMPT) {
    // Set status callback
    Apis.setRpcConnectionStatusCallback(wsStatusCallback);
    // Connecting to blockchain
    return Apis.instance(connectionString, true).init_promise.then((res) => {
      // Print out which blockchain we are connecting to
      console.log('Connected to:', res[0] ? res[0].network_name : 'Undefined Blockchain');
      // This is set to TEST since Peerplays Blockchain Testnet is currently using TEST prefix
      ChainConfig.setPrefix("TEST");
    }).catch((error) => {
      console.error('Fail to connect to blockchain', error);
      // Close residue connection to blockchain
      Apis.close();
      // Retry if needed
      if (attempt > 0) {
        // Retry to connect
        console.log('Retry connecting to blockchain');
        return ConnectionService.connectToBlockchain(wsStatusCallback, attempt-1);
      } else {
        // Give up, throw the error to be caught by the outer promise handler
        throw error;
      }
    })
  }

  static syncWithBlockchain(attempt=MAX_ATTEMPT) {

    // Sync with blockchain using ChainStore
    return ChainStore.init().then(() => {
      console.log('Sync with Blockchain Success');
    }).catch((error) => {
      console.error('Sync with Blockchain Fail', error);
      // Retry if needed
      if (attempt > 0) {
        // Retry to connect
        console.log('Retry syncing with blockchain');
        return ConnectionService.syncWithBlockchain(attempt-1);
      } else {
        // Give up, close current connection to blockchain
        Apis.close();
        // Throw the error to be caught by the outer promise handler
        throw error;
      }
    });
  }
}

export default ConnectionService;
