// models/VariantAttribute.ts
import { Schema, model, models } from "mongoose";

const VariantAttributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // standardize like "color", "size"
    },
    label: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Color", "Size" (for UI display)
    },
    values: {
      type: [String],
      required: true,
      validate: [(v: string[]) => v.length > 0, "At least one value required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const VariantAttribute =
  models.VariantAttribute || model("VariantAttribute", VariantAttributeSchema);
