import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

// Prisma 7's client requires an explicit driver adapter built from
// DATABASE_URL, unlike Mongoose's mongoose.connect() which can be called
// whenever — a plain `new PrismaClient({ adapter })` at module load time
// would freeze DATABASE_URL at import time, before tests get a chance to
// override it with an ephemeral container's URI (the same class of bug
// already hit and fixed once for Mongoose in this project). This Proxy
// defers actually constructing the client until the first real query, by
// which point DATABASE_URL has its final value either way.
let real: PrismaClient | undefined;
function getReal(): PrismaClient {
  if (!real) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    real = new PrismaClient({ adapter });
  }
  return real;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getReal(), prop, receiver);
  },
});

export async function connectDB() {
  await prisma.$connect();
  console.log("🗄️  Connected to PostgreSQL");
}
