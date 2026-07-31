import { createServer as createHttpServer, type Server as HttpServer } from "node:http";
import type { AddressInfo } from "node:net";
import { Server } from "socket.io";
import { io as ioClient, type Socket as ClientSocket } from "socket.io-client";
import { createServer } from "../app.js";
import { registerSocketHandlers } from "../sockets/index.js";
import { signAccessToken } from "../utils/jwt.js";
import { User } from "../models/user.model.js";

describe("realtime presence", () => {
  let httpServer: HttpServer;
  let io: Server;
  let port: number;

  beforeAll(async () => {
    httpServer = createHttpServer(createServer());
    io = new Server(httpServer);
    registerSocketHandlers(io);
    await new Promise<void>((resolve) => httpServer.listen(0, resolve));
    port = (httpServer.address() as AddressInfo).port;
  });

  afterAll(async () => {
    io.close();
    await new Promise<void>((resolve) => httpServer.close(() => resolve()));
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  function connect(auth?: Record<string, unknown>): ClientSocket {
    return ioClient(`http://localhost:${port}`, { auth, forceNew: true, reconnection: false });
  }

  it("rejects a connection without a token", async () => {
    const client = connect();
    const error = await new Promise<Error>((resolve) => client.on("connect_error", resolve));
    expect(error.message).toMatch(/token/i);
    client.close();
  });

  it("accepts a valid token and broadcasts presence", async () => {
    const user = await User.create({ name: "Ada", email: "ada@example.com", password: "password123" });
    const token = signAccessToken({ id: user.id, role: "user" });

    const client = connect({ token });
    const presence = await new Promise<OnlineUser[]>((resolve) =>
      client.on("presence:update", resolve)
    );

    expect(presence).toEqual([{ id: user.id, name: "Ada" }]);
    client.close();
  });
});

interface OnlineUser {
  id: string;
  name: string;
}
