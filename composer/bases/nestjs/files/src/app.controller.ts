import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
// __COMPOSER_IMPORTS__

@Controller()
export class AppController {
  constructor(
    /* __COMPOSER_CONSTRUCTOR_ARGS__ */
  ) {}

  // Liveness: the process is up and handling requests. Doesn't check
  // dependencies — that's what /healthz is for.
  @Get("health")
  health() {
    return { status: "ok" };
  }

  // Readiness: is this instance actually able to serve real traffic right
  // now? Each database module contributes its own connectivity check —
  // an empty list here (no database module selected) is vacuously "ok".
  @Get("healthz")
  async healthz() {
    const checks: { name: string; check: () => boolean | Promise<boolean> }[] = [
      // __COMPOSER_READINESS__
    ];
    const results = await Promise.all(
      checks.map(async (c) => ({ name: c.name, ok: await c.check() }))
    );
    const allOk = results.every((r) => r.ok);
    const body = {
      status: allOk ? "ok" : "unavailable",
      checks: Object.fromEntries(results.map((r) => [r.name, r.ok])),
    };
    if (!allOk) throw new ServiceUnavailableException(body);
    return body;
  }
}
