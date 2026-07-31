import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/user.model.js";

// Idempotent — safe to re-run. Existing emails are skipped rather than
// erroring, so `npm run seed` after `npm run seed` is a no-op.
const SEED_USERS = [
  { name: "Admin User", email: "admin@example.com", password: "password123", role: "admin" as const },
  { name: "Test User", email: "user@example.com", password: "password123", role: "user" as const },
];

async function seed() {
  await connectDB();

  for (const data of SEED_USERS) {
    const exists = await User.findOne({ email: data.email });
    if (exists) {
      console.log(`Skipping ${data.email} (already exists)`);
      continue;
    }
    await User.create(data);
    console.log(`Created ${data.email} / ${data.password}`);
  }

  await mongoose.connection.close();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
