import { Apis } from 'graphenejs-ws';

/**
 * Utility to check connection
 */
class ConnectionUtils {
  /**
   * Check if the app is connected to internet through Navigator object
   */
  static isConnectedToInternet() {
    return !!(window.navigator && window.navigator.onLine);
  }

  /**
   * Check if websocket is open through websocket ready state
   */
  static isWebsocketOpen() {
    const websocketReadyState = Apis.instance() && Apis.instance().ws_rpc && Apis.instance().ws_rpc.ws && Apis.instance().ws_rpc.ws.readyState;
    return websocketReadyState === WebSocket.OPEN;
  }
}

export default ConnectionUtils;
