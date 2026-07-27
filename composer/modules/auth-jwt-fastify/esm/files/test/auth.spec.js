import { createServer } from "../app.js";
import { User } from "../models/user.model.js";

describe("Auth API", () => {
  let app;

  beforeEach(async () => {
    app = createServer();
    await app.ready();
    await User.deleteMany({});
  });

  afterEach(async () => {
    await app.close();
  });

  it("registers a new user and returns an access token", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: { name: "Jane Doe", email: "jane@example.com", password: "password123" },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data.user).toHaveProperty("email", "jane@example.com");
    expect(body.data.user.password).toBeUndefined();
    expect(body.data.accessToken).toBeDefined();
  });

  it("rejects registering the same email twice", async () => {
    const payload = { name: "Jane", email: "jane@example.com", password: "password123" };
    await app.inject({ method: "POST", url: "/api/v1/auth/register", payload });
    const res = await app.inject({ method: "POST", url: "/api/v1/auth/register", payload });

    expect(res.statusCode).toBe(409);
    expect(res.json().success).toBe(false);
  });

  it("logs in with correct credentials", async () => {
    await app.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: { name: "Jane", email: "jane@example.com", password: "password123" },
    });

    const res = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "jane@example.com", password: "password123" },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.accessToken).toBeDefined();
  });

  it("rejects login with the wrong password", async () => {
    await app.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: { name: "Jane", email: "jane@example.com", password: "password123" },
    });

    const res = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "jane@example.com", password: "wrong-password" },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().success).toBe(false);
  });

  it("returns the current user for GET /auth/me with a valid token", async () => {
    const registerRes = await app.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: { name: "Jane", email: "jane@example.com", password: "password123" },
    });
    const token = registerRes.json().data.accessToken;

    const res = await app.inject({
      method: "GET",
      url: "/api/v1/auth/me",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data).toHaveProperty("email", "jane@example.com");
  });

  it("rejects GET /auth/me without a token", async () => {
    const res = await app.inject({ method: "GET", url: "/api/v1/auth/me" });
    expect(res.statusCode).toBe(401);
    expect(res.json().success).toBe(false);
  });
});
