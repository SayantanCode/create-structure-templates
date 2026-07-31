import type { Server, Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/user.model.js";

const LOBBY_ROOM = "lobby";

interface OnlineUser {
  id: string;
  name: string;
}

// socket.id -> the user connected on that socket. A user with two open tabs
// shows up twice, which is the correct behavior for "who's online right now"
// (two sockets really are connected) rather than deduping by user id.
const onlineUsers = new Map<string, OnlineUser>();

function broadcastPresence(io: Server) {
  io.to(LOBBY_ROOM).emit("presence:update", Array.from(onlineUsers.values()));
}

export function registerSocketHandlers(io: Server) {
  // Same access token that guards HTTP routes guards the socket connection —
  // sent as handshake auth (there's no request header to attach to the
  // WebSocket upgrade the way there is on a normal fetch).
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Missing auth token"));
    try {
      socket.data.user = verifyAccessToken(token);
      next();
    } catch {
      next(new Error("Invalid or expired access token"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const { sub } = socket.data.user;
    const user = await User.findById(sub).select("name").lean();
    if (!user) {
      socket.disconnect(true);
      return;
    }

    socket.join(LOBBY_ROOM);
    onlineUsers.set(socket.id, { id: sub, name: user.name });
    broadcastPresence(io);

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      broadcastPresence(io);
    });
  });
}
