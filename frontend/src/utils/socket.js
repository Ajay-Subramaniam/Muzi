import { io } from "socket.io-client";
import { BACKEND_URL } from '../apiConfig'

let socket = null

export function connectSocket() {
  if (!socket || !socket.connected) {
    socket = io(BACKEND_URL, { withCredentials: true });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) socket.disconnect();
}