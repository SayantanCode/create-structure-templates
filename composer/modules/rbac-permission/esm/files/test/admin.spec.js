import request from "supertest";
import { createServer } from "../app.js";
import { User } from "../models/user.model.js";

const app = createServer();

async function loginAs(email, password) {
  const res = await request(app).post("/api/v1/auth/login").send({ email, password });
  return res.body.data.accessToken;
}

describe("Admin-only route (permission RBAC)", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.create({ name: "Admin", email: "admin@example.com", password: "password123", role: "admin" });
    await User.create({ name: "Regular", email: "user@example.com", password: "password123", role: "user" });
  });

  it("allows a user whose role grants admin:access", async () => {
    const token = await loginAs("admin@example.com", "password123");
    const res = await request(app).get("/api/v1/admin-check").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rejects a user whose role doesn't grant admin:access", async () => {
    const token = await loginAs("user@example.com", "password123");
    const res = await request(app).get("/api/v1/admin-check").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
