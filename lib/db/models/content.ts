import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    content: { type: String, trim: true },
    featuredImage: { type: String, trim: true },
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Content ||
  mongoose.model("Content", ContentSchema);
