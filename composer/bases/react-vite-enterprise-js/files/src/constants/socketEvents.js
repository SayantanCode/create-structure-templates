// Every realtime event name the app emits/listens for. Add one entry per
// event instead of typing the string at each socket.emit()/on() call site.
export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  PRESENCE_UPDATE: "presence:update",
};
