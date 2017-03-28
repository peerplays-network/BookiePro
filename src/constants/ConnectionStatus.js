// Enumeration for Connection Status

/**
 * Internet is on, websocket is open = CONNECTED
 * Internet is on, websocket is closed = DISCONNECTED
 * Internet is off, websocket is open = DISCONNECTED
 * Internet is off, websocket is closed = DISCONNECTED
 */

class ConnectionStatus {
  static DISCONNECTED = 'disconnected';
  static CONNECTING = 'connecting';
  static CONNECTED = 'connected';
}

export default ConnectionStatus;
