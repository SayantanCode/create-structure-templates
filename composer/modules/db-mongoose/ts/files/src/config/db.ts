import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export async function connectDB() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/{{projectName}}");
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error({ err }, "MongoDB connection error");
    process.exit(1);
  }
}
