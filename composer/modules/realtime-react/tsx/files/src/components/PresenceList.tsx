import { useAuth } from "../auth/AuthContext";
import { useRealtime } from "../realtime/RealtimeContext";

// Demonstrates useRealtime() end to end — safe to delete once you've wired
// your own real-time features. Requires being logged in (see AuthStatus):
// the backend's realtime-socketio module authenticates the socket with the
// same access token that guards the HTTP API.
export function PresenceList() {
  const { user } = useAuth();
  const { online, connected } = useRealtime();

  if (!user) return <p>Log in to see who else is online.</p>;

  return (
    <div>
      <p>{connected ? "🟢 Live" : "⚪ Connecting..."} — online now ({online.length}):</p>
      <ul>
        {online.map((u, i) => (
          <li key={`${u.id}-${i}`}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
