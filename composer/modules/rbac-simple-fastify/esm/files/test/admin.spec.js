import { createServer } from "../app.js";
import { User } from "../models/user.model.js";

async function loginAs(app, email, password) {
  const res = await app.inject({ method: "POST", url: "/api/v1/auth/login", payload: { email, password } });
  return res.json().data.accessToken;
}

describe("Admin-only route (simple RBAC)", () => {
  let app;

  beforeEach(async () => {
    app = createServer();
    await app.ready();
    await User.deleteMany({});
    await User.create({ name: "Admin", email: "admin@example.com", password: "password123", role: "admin" });
    await User.create({ name: "Regular", email: "user@example.com", password: "password123", role: "user" });
  });

  afterEach(async () => {
    await app.close();
  });

  it("allows an admin", async () => {
    const token = await loginAs(app, "admin@example.com", "password123");
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/admin-check",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().success).toBe(true);
  });

  it("rejects a non-admin", async () => {
    const token = await loginAs(app, "user@example.com", "password123");
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/admin-check",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(403);
    expect(res.json().success).toBe(false);
  });
});
