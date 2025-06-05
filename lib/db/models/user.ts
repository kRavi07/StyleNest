import mongoose, { Schema, Document } from "mongoose";
import { Address } from "@/types";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
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
    addresses: [
      {
        fullName: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phone: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<UserDocument>("User", UserSchema);
