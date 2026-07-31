import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../auth/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

interface OnlineUser {
  id: string;
  name: string;
}

interface RealtimeContextValue {
  online: OnlineUser[];
  connected: boolean;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [online, setOnline] = useState<OnlineUser[]>([]);
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

    const socket: Socket = io(SOCKET_URL, { auth: { token: accessToken } });
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("presence:update", (users: OnlineUser[]) => setOnline(users));

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
