import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/auth/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

const RealtimeContext = createContext(null);

export function RealtimeProvider({ children }) {
  const { accessToken } = useAuth();
  const [online, setOnline] = useState([]);
  const [connected, setConnected] = useState(false);

  // The socket is only opened once we actually have an access token — the
  // backend's realtime-socketio module rejects the handshake without one,
  // so there's no point connecting (and reconnecting on every render) while
  // logged out.
  useEffect(() => {
    if (!accessToken) {
      setOnline([]);
      setConnected(false);
      return;
    }

    const socket = io(SOCKET_URL, { auth: { token: accessToken } });
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("presence:update", (users) => setOnline(users));

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

  return (
    <RealtimeContext.Provider value={{ online, connected }}>{children}</RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error("useRealtime must be used within a RealtimeProvider");
  return ctx;
}
