import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import mongoose from "mongoose";
import { AppModule } from "../app.module";
import { applyGlobalPrefix } from "../common/utils/configure-app";

describe("Admin-only route (permission RBAC)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    applyGlobalPrefix(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function loginAs(email: string, password: string) {
    const res = await request(app.getHttpServer()).post("/api/v1/auth/login").send({ email, password });
    return res.body.data.accessToken;
  }

  beforeEach(async () => {
    // @nestjs/mongoose registers feature schemas on the Connection object
    // (via connection.model(...)), not on the global mongoose.model(...)
    // registry, even though it's the same default connection — so look it
    // up through mongoose.connection, not the top-level mongoose.model().
    const UserModel = mongoose.connection.model("User");
    await UserModel.deleteMany({});
    await UserModel.create({ name: "Admin", email: "admin@example.com", password: "password123", role: "admin" });
    await UserModel.create({ name: "Regular", email: "user@example.com", password: "password123", role: "user" });
  });

  it("allows a user whose role grants admin:access", async () => {
    const token = await loginAs("admin@example.com", "password123");
    const res = await request(app.getHttpServer())
      .get("/api/v1/admin-check")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rejects a user whose role doesn't grant admin:access", async () => {
    const token = await loginAs("user@example.com", "password123");
    const res = await request(app.getHttpServer())
      .get("/api/v1/admin-check")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
