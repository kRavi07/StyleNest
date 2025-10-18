/* eslint-disable no-unused-vars */
import mongoose, { Schema, Document, InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  mobileno: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken: String;
  resetPasswordExpires: Date;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    mobileno: {
      type: String,
      required: [true, "Please provide a mobile number"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.setPassword = async function (password: string) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export type UserDoc = InferSchemaType<typeof UserSchema> & {
  setPassword(password: string): Promise<void>;
  validatePassword(password: string): Promise<boolean>;
};

export default mongoose.models.User ||
  mongoose.model<UserDocument>("User", UserSchema);
