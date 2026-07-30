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

// Loosely typed: mongoose's own transform type ties `ret` to the exact
// hydrated-document shape, which is more precise than this generic helper
// needs to care about.
function stripSensitiveFields(_doc: unknown, ret: any) {
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

// Mongoose 9 dropped the next() callback from pre hooks — an async
// function (or one returning a promise) is now the only supported form.
UserSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};
