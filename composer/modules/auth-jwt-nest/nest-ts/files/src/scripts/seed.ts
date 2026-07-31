import "reflect-metadata";
import "dotenv/config";
import mongoose from "mongoose";
import { User, UserSchema } from "../auth/user.schema";
import { getMongoUri } from "../config/mongoose.config";

// Idempotent — safe to re-run. Existing emails are skipped rather than
// erroring, so `npm run seed` after `npm run seed` is a no-op. Connects
// directly via mongoose rather than bootstrapping the whole Nest app —
// UserSchema's own pre("save") hook still hashes the password either way.
const SEED_USERS = [
  { name: "Admin User", email: "admin@example.com", password: "password123", role: "admin" },
  { name: "Test User", email: "user@example.com", password: "password123", role: "user" },
];

async function seed() {
  await mongoose.connect(getMongoUri());
  const UserModel = mongoose.model(User.name, UserSchema);

  for (const data of SEED_USERS) {
    const exists = await UserModel.findOne({ email: data.email });
    if (exists) {
      console.log(`Skipping ${data.email} (already exists)`);
      continue;
    }
    await UserModel.create(data);
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
