const request = require("supertest");
const { createServer } = require("../app.js");

const app = createServer();

describe("Health check", () => {
  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
