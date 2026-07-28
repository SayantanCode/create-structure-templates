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

  beforeEach(async () => {
    await mongoose.connection.collection("users").deleteMany({});
  });

  // Registers through the real endpoint (so the password is hashed exactly
  // like production), then promotes to admin with a direct write — avoids
  // depending on @nestjs/mongoose's internal model/connection identity from
  // outside the DI container, which auth.e2e-spec.ts sidesteps the same way.
  async function registerAndLogin(email: string, password: string, role: "user" | "admin") {
    await request(app.getHttpServer()).post("/api/v1/auth/register").send({ name: role, email, password });
    if (role === "admin") {
      await mongoose.connection.collection("users").updateOne({ email }, { $set: { role: "admin" } });
    }
    const res = await request(app.getHttpServer()).post("/api/v1/auth/login").send({ email, password });
    return res.body.data.accessToken;
  }

  it("allows a user whose role grants admin:access", async () => {
    const token = await registerAndLogin("admin@example.com", "password123", "admin");
    const res = await request(app.getHttpServer())
      .get("/api/v1/admin-check")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rejects a user whose role doesn't grant admin:access", async () => {
    const token = await registerAndLogin("user@example.com", "password123", "user");
    const res = await request(app.getHttpServer())
      .get("/api/v1/admin-check")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
