import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import itemRoutes from "./routes/item.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/{{projectName}}";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
