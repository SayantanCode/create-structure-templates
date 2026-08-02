import { useEffect, useState } from "react";
import { useRealtime } from "@/platform/realtime/useRealtime";
import { SOCKET_EVENTS } from "@/constants/socketEvents";

// Tracks who else is online in a channel — assumes the server emits
// SOCKET_EVENTS.PRESENCE_UPDATE with `{ channel, members }` whenever someone
// joins/leaves. Swap the event contract here to match your backend.
export function usePresence(channel) {
  const { socket, connected } = useRealtime();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!connected) return;
    socket.emit("channel:join", channel);

    const onPresence = (payload) => {
      if (payload.channel === channel) setMembers(payload.members || []);
    };
    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, onPresence);

    return () => {
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, onPresence);
      socket.emit("channel:leave", channel);
    };
  }, [socket, connected, channel]);

  return members;
}
