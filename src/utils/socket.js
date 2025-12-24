import { io } from 'socket.io-client';

/**
 * Socket.io client connection utility
 * Creates and manages a singleton socket connection
 */
class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    // If socket exists and is connected, return it
    if (this.socket?.connected) {
      return this.socket;
    }

    // If socket exists but not connected, return it (it will reconnect automatically)
    if (this.socket) {
      console.log('[SOCKET] Reusing existing socket, waiting for connection...');
      return this.socket;
    }

    // Create new socket connection
    console.log('[SOCKET] Creating new socket connection...');
    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: true
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('[SOCKET] Connected successfully, ID:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('[SOCKET] Disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SOCKET] Connection error:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('[SOCKET] Reconnected after', attemptNumber, 'attempts');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }
}

// Export singleton instance
const socketManager = new SocketManager();
export default socketManager;

