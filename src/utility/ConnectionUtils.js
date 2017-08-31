/**
 * The ConnectionUtils contains all the network connection checking functions.
 */
import { Apis } from 'peerplaysjs-ws';

const ConnectionUtils = {
  
  /**
   * Check if the app is connected to internet through Navigator object
   * @returns {boolean} - if window.navigator currrently connected to network
   */
  isConnectedToInternet() {
    return !!(window.navigator && window.navigator.onLine);
  },

  /**
   * Check if websocket is open through websocket ready state
   * @returns {boolean} - if websocket connnecting to peerplaysjs-ws ready.
   */
  isWebsocketOpen() {
    const websocketReadyState = Apis.instance() && Apis.instance().ws_rpc && Apis.instance().ws_rpc.ws && Apis.instance().ws_rpc.ws.readyState;
    return websocketReadyState === WebSocket.OPEN;
  }
}

export default ConnectionUtils;
