import request from "supertest";
import { createServer } from "../app.js";
import { User } from "../models/user.model.js";

const app = createServer();

async function loginAs(email: string, password: string) {
  const res = await request(app).post("/api/v1/auth/login").send({ email, password });
  return res.body.data.accessToken as string;
}

describe("User API", () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await User.create({ name: "Admin", email: "admin@example.com", password: "password123", role: "admin" });
    await User.create({ name: "Regular", email: "user@example.com", password: "password123", role: "user" });
    adminToken = await loginAs("admin@example.com", "password123");
    userToken = await loginAs("user@example.com", "password123");
  });

  it("allows any authenticated user to list users", async () => {
    const res = await request(app).get("/api/v1/users").set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  it("rejects listing users without a token", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("allows an admin to create a user", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "New User", email: "new@example.com", password: "password123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("email", "new@example.com");
    expect(res.body.data.password).toBeUndefined();
  });

  it("rejects a non-admin trying to create a user", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "New User", email: "new2@example.com", password: "password123" });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("allows an admin to delete a user", async () => {
    const target = await User.create({
      name: "ToDelete",
      email: "delete@example.com",
      password: "password123",
    });

    const res = await request(app)
      .delete(`/api/v1/users/${target._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  it("rejects a non-admin trying to delete a user", async () => {
    const target = await User.create({
      name: "ToDelete",
      email: "delete2@example.com",
      password: "password123",
    });

    const res = await request(app)
      .delete(`/api/v1/users/${target._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});
