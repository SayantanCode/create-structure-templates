import { createContext, useEffect, useMemo, useState } from "react";
import { connectSocket, disconnectSocket } from "@/platform/realtime/socketClient";
import { SOCKET_EVENTS } from "@/constants/socketEvents";

const RealtimeContext = createContext(null);

export function RealtimeProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const socket = useMemo(() => connectSocket(), []);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on(SOCKET_EVENTS.CONNECT, onConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, onConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
      disconnectSocket();
    };
  }, [socket]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export { RealtimeContext };
