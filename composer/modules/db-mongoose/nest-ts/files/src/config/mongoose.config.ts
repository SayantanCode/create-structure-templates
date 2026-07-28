// A function, not a top-level constant: MongooseModule.forRootAsync's
// useFactory calls this lazily during DI resolution (inside Nest's own
// bootstrap/Test.createTestingModule().compile()), by which point test
// setup has already overridden process.env.MONGO_URI with the in-memory
// server's URI. A constant evaluated at import time would capture the
// fallback value instead, since app.module.ts imports this file before
// test/setup.ts's beforeAll has run.
export function getMongoUri(): string {
  return process.env.MONGO_URI || "mongodb://127.0.0.1:27017/{{projectName}}";
}
