const mongoose = require("mongoose");
const { logger } = require("../utils/logger.js");

async function connectDB() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/{{projectName}}");
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error({ err }, "MongoDB connection error");
    process.exit(1);
  }
}

module.exports = { connectDB };
