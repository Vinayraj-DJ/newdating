import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialize WebSocket connection
 */
export const initWebSocket = (onNotificationReceived) => {
  // Use the production base URL from the API config
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://friendcircle-x7d6.onrender.com";
  
  // Determine the WebSocket URL based on environment
  let wsUrl;
  if (process.env.NODE_ENV === 'development') {
    // In development, only connect if REACT_APP_WS_URL is explicitly set
    // This prevents automatic connection attempts to localhost:3001
    wsUrl = process.env.REACT_APP_WS_URL;
    if (!wsUrl) {
      // Suppress console message
      return null;
    }
  } else {
    // In production, use the API base URL with appropriate protocol
    // Convert HTTP/HTTPS to WebSocket protocol (ws/wss)
    if (API_BASE.startsWith('https')) {
      wsUrl = API_BASE.replace('https://', 'wss://');
    } else {
      wsUrl = API_BASE.replace('http://', 'ws://');
    }
  }
  
  // Only attempt to connect if we have a valid URL
  if (!wsUrl) {
    console.warn('WebSocket: No URL configured, skipping connection');
    return null;
  }
  
  socket = io(wsUrl, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 3, // Reduced attempts for faster failure
    timeout: 5000, // Reduced timeout for faster failure
  });

  // Join the admin notifications room
  socket.on('connect', () => {
    console.log('Connected to WebSocket server at:', wsUrl);
    socket.emit('join_admin_notifications');
  });

  // Listen for admin notifications
  socket.on('notification', (data) => {
    console.log('Received notification:', data);
    if (onNotificationReceived) {
      onNotificationReceived(data);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from WebSocket server:', reason);
  });

  socket.on('connect_error', (error) => {
    console.warn('WebSocket connection error (this is normal if server is not running):', error.message);
    // Don't throw error, just log it
  });

  socket.on('error', (error) => {
    console.warn('WebSocket error (this is normal if server is not running):', error.message);
  });

  return socket;
};

/**
 * Get the current socket instance
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect WebSocket
 */
export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};