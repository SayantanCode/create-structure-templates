import { io } from "socket.io-client";
import { env } from "@/config/env";
import { getAccessToken } from "@/services/auth/tokenStorage";

let socket = null;

// socket.io-client already implements reconnect-with-backoff and a
// ping/pong heartbeat internally — this wrapper's job is connection
// lifecycle (singleton instance, auth token attach) so nothing else in the
// app touches `io()` directly.
export function connectSocket() {
  if (socket) return socket;
  socket = io(env.socketUrl, {
    autoConnect: true,
    reconnection: true,
    auth: (cb) => cb({ token: getAccessToken() }),
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}
