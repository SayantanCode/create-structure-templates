import { Server } from "socket.io";
import { io as ioClient } from "socket.io-client";
import { createServer } from "../app.js";
import { registerSocketHandlers } from "../sockets/index.js";
import { signAccessToken } from "../utils/jwt.js";
import { User } from "../models/user.model.js";

describe("realtime presence", () => {
  let app;
  let io;
  let port;

  beforeAll(async () => {
    app = createServer();
    io = new Server(app.server);
    registerSocketHandlers(io);
    await app.listen({ port: 0, host: "127.0.0.1" });
    port = app.server.address().port;
  });

  afterAll(async () => {
    // Closing the Fastify instance also closes the underlying http.Server
    // Socket.IO attached to — nothing extra to tear down on `io` itself.
    await app.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  function connect(auth) {
    return ioClient(`http://127.0.0.1:${port}`, { auth, forceNew: true, reconnection: false });
  }

  it("rejects a connection without a token", async () => {
    const client = connect();
    const error = await new Promise((resolve) => client.on("connect_error", resolve));
    expect(error.message).toMatch(/token/i);
    client.close();
  });

  it("accepts a valid token and broadcasts presence", async () => {
    const user = await User.create({ name: "Ada", email: "ada@example.com", password: "password123" });
    const token = signAccessToken({ id: user.id, role: "user" });

    const client = connect({ token });
    const presence = await new Promise((resolve) => client.on("presence:update", resolve));

    expect(presence).toEqual([{ id: user.id, name: "Ada" }]);
    client.close();
  });
});
