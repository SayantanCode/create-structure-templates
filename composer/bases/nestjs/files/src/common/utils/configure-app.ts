import { INestApplication } from "@nestjs/common";

// setGlobalPrefix is an imperative call on the app instance — there's no
// module/decorator-based equivalent — so it has to be applied by every code
// path that creates an app instance: main.ts's bootstrap() AND every
// e2e spec's Test.createTestingModule().createNestApplication(), since
// tests never call bootstrap(). Centralized here so those two call sites
// can't drift out of sync.
export function applyGlobalPrefix(app: INestApplication) {
  // Both stay unprefixed to match the other framework targets — load
  // balancer/k8s probes hit a stable /health(z), independent of API
  // versioning.
  app.setGlobalPrefix("api/v1", { exclude: ["health", "healthz"] });
}
