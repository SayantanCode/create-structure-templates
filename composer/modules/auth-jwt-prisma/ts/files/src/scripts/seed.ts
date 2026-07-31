import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

// Idempotent — safe to re-run. Existing emails are skipped rather than
// erroring, so `npm run seed` after `npm run seed` is a no-op.
const SEED_USERS = [
  { name: "Admin User", email: "admin@example.com", password: "password123", role: "admin" },
  { name: "Test User", email: "user@example.com", password: "password123", role: "user" },
];

async function seed() {
  for (const data of SEED_USERS) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      console.log(`Skipping ${data.email} (already exists)`);
      continue;
    }
    const password = await bcrypt.hash(data.password, 10);
    await prisma.user.create({ data: { ...data, password } });
    console.log(`Created ${data.email} / ${data.password}`);
  }

  await prisma.$disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
