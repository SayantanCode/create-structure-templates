const { createServer: createHttpServer } = require("node:http");
const { Server } = require("socket.io");
const { io: ioClient } = require("socket.io-client");
const { createServer } = require("../app.js");
const { registerSocketHandlers } = require("../sockets/index.js");
const { signAccessToken } = require("../utils/jwt.js");
const { User } = require("../models/user.model.js");

describe("realtime presence", () => {
  let httpServer;
  let io;
  let port;

  beforeAll(async () => {
    httpServer = createHttpServer(createServer());
    io = new Server(httpServer);
    registerSocketHandlers(io);
    await new Promise((resolve) => httpServer.listen(0, resolve));
    port = httpServer.address().port;
  });

  afterAll(async () => {
    io.close();
    await new Promise((resolve) => httpServer.close(() => resolve()));
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  function connect(auth) {
    return ioClient(`http://localhost:${port}`, { auth, forceNew: true, reconnection: false });
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
