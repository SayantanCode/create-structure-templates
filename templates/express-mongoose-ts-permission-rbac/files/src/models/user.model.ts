import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  comparePassword(candidate: string): Promise<boolean>;
}

function stripSensitiveFields(_doc: unknown, ret: Record<string, unknown>) {
  delete ret.password;
  delete ret.__v;
  return ret;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
    // Both toJSON (res.json/JSON.stringify) and toObject (.toObject(), and
    // .lean() results already exclude password via select:false above) strip
    // the password the same way, so it can never leak regardless of which
    // one calling code happens to use.
    toJSON: { transform: stripSensitiveFields },
    toObject: { transform: stripSensitiveFields },
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<UserDocument>("User", userSchema);
