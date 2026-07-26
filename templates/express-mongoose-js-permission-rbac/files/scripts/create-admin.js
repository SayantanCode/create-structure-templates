import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const createAdmin = async () => {
  try {
    const email = process.argv[2];
    if (!email) {
      console.error("Usage: node scripts/create-admin.js <email>");
      process.exit(1);
    }

    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/{{projectName}}"
    );
    console.log("Connected to MongoDB.");

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`No user found with email ${email}. Register them first.`);
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`User ${user.email} is now an admin.`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
