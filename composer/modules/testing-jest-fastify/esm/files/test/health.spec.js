import { createServer } from "../app.js";

describe("Health check", () => {
  let app;

  beforeEach(async () => {
    app = createServer();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET /health returns ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
});
