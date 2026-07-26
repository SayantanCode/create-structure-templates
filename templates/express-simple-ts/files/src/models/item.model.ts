import mongoose from "mongoose";

export interface Item {
  name: string;
  description?: string;
}

const itemSchema = new mongoose.Schema<Item>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<Item>("Item", itemSchema);
