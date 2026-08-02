import { useEffect } from "react";
import { useRealtime } from "@/platform/realtime/useRealtime";

// Subscribes to one event on a channel for the component's lifetime, and
// tells the server to join/leave the channel room around it. Assumes a
// server listening for "channel:join"/"channel:leave" — adjust the event
// names here to match your backend's actual protocol.
export function useChannel(channel, event, handler) {
  const { socket, connected } = useRealtime();

  useEffect(() => {
    if (!connected) return;
    socket.emit("channel:join", channel);
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
      socket.emit("channel:leave", channel);
    };
  }, [socket, connected, channel, event, handler]);
}
