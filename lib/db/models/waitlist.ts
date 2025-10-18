import mongoose, { Schema, models } from "mongoose";

const WaitlistSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || /^\d{10}$/.test(v),
        message: "Mobile number must be exactly 10 digits",
      },
    },
    clientId: { type: String },
  },
  { timestamps: true }
);

export const Waitlist =
  models.Waitlist || mongoose.model("Waitlist", WaitlistSchema);
