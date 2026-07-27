const request = require("supertest");
const { createServer } = require("../app.js");
const { User } = require("../models/user.model.js");

const app = createServer();

describe("Auth API", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("registers a new user and returns an access token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Jane Doe", email: "jane@example.com", password: "password123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty("email", "jane@example.com");
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("rejects registering the same email twice", async () => {
    const payload = { name: "Jane", email: "jane@example.com", password: "password123" };
    await request(app).post("/api/v1/auth/register").send(payload);
    const res = await request(app).post("/api/v1/auth/register").send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("logs in with correct credentials", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Jane", email: "jane@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "jane@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("rejects login with the wrong password", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Jane", email: "jane@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "jane@example.com", password: "wrong-password" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns the current user for GET /auth/me with a valid token", async () => {
    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Jane", email: "jane@example.com", password: "password123" });
    const token = registerRes.body.data.accessToken;

    const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("email", "jane@example.com");
  });

  it("rejects GET /auth/me without a token", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
