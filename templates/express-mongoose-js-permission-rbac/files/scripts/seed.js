import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const seed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/{{projectName}}"
    );
    console.log("Connected to MongoDB for seeding.");

    await User.deleteMany({});

    // User.create() (not insertMany) so the password-hashing pre-save hook
    // actually runs for each document.
    await User.create([
      { name: "Admin User", email: "admin@example.com", password: "changeme123", role: "admin" },
      { name: "Normal User", email: "user@example.com", password: "changeme123", role: "user" },
    ]);

    console.log("Database seeded successfully with 2 users (password: changeme123).");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

seed();
