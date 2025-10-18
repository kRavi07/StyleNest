import mongoose, { Schema, InferSchemaType } from "mongoose";
import connectToDatabase from "../mongoose";

await connectToDatabase();

const RefreshTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  tokenHash: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  userAgent: String,
  ipAddress: String,
});

export type RefreshTokenDoc = InferSchemaType<typeof RefreshTokenSchema>;

export default (mongoose.models
  .RefreshToken as mongoose.Model<RefreshTokenDoc>) ||
  mongoose.model<RefreshTokenDoc>("RefreshToken", RefreshTokenSchema);
