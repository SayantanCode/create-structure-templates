const { verifyAccessToken } = require("../utils/jwt.js");
const { User } = require("../models/user.model.js");

const LOBBY_ROOM = "lobby";

// socket.id -> the user connected on that socket. A user with two open tabs
// shows up twice, which is the correct behavior for "who's online right now"
// (two sockets really are connected) rather than deduping by user id.
const onlineUsers = new Map();

function broadcastPresence(io) {
  io.to(LOBBY_ROOM).emit("presence:update", Array.from(onlineUsers.values()));
}

function registerSocketHandlers(io) {
  // Same access token that guards HTTP routes guards the socket connection —
  // sent as handshake auth (there's no request header to attach to the
  // WebSocket upgrade the way there is on a normal fetch).
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Missing auth token"));
    try {
      socket.data.user = verifyAccessToken(token);
      next();
    } catch {
      next(new Error("Invalid or expired access token"));
    }
  });

  io.on("connection", async (socket) => {
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

module.exports = { registerSocketHandlers };
