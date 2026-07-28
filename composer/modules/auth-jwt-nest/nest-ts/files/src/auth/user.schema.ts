import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as bcrypt from "bcryptjs";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, minlength: 8, select: false })
  password: string;

  @Prop({ enum: ["user", "admin"], default: "user" })
  role: string;

  comparePassword: (candidate: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

function stripSensitiveFields(_doc: unknown, ret: Record<string, unknown>) {
  delete ret.password;
  delete ret.__v;
  return ret;
}

// Both toJSON (res.json/JSON.stringify) and toObject (.toObject(), and
// .lean() results already exclude password via select:false above) strip
// the password the same way, so it can never leak regardless of which one
// calling code happens to use.
UserSchema.set("toJSON", { transform: stripSensitiveFields });
UserSchema.set("toObject", { transform: stripSensitiveFields });

UserSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};
