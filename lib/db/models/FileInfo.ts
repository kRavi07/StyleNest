// models/File.ts
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
    },
    createdAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const FileInfo =
  mongoose.models.FileInfo || mongoose.model("FileInfo", fileSchema);
