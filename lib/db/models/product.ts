import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Category from "./category";

export interface IOptionType {
  name: string;
  values: string[];
}

export interface IAttribute {
  name: string;
  value: string;
}

export interface IVariant {
  _id: Types.ObjectId | string;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  images: string[] | (string | File)[];
  optionValues: Record<string, string>;
  attributes?: IAttribute[];
  isActive?: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  mrp: number;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  images: string[];
  inventory: number;
  featured: boolean;
  rating: number;
  reviews: number;
  isNewProduct: boolean;
  isSale: boolean;
  isActive: boolean;
  gender: string;
  hasVariants: boolean;
  variants: IVariant[];
  optionTypes: IOptionType[];
  specifications: IAttribute[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  deletedAt?: Date;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Simplified schemas
const AttributeSchema = new Schema<IAttribute>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const VariantSchema = new Schema<IVariant>(
  {
    name: { type: String, required: true, trim: true },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    images: [String],
    optionValues: {
      type: Map,
      of: String,
      required: true,
      validate: [
        (map: Map<string, string>) => map.size > 0,
        "At least one option value required",
      ],
    },
    attributes: { type: [AttributeSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const OptionTypeSchema = new Schema<IOptionType>(
  {
    name: { type: String, required: true },
    values: {
      type: [String],
      required: true,
      validate: [
        (arr: string[]) => arr.length > 0,
        "At least one value required",
      ],
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    category: {
      type: Schema.Types.ObjectId,
      ref: Category,
      required: true,
      index: true,
    },
    subcategory: { type: Schema.Types.ObjectId, ref: Category },
    images: { type: [String], default: [] },
    inventory: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    isNewProduct: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    gender: {
      type: String,
      enum: ["male", "female", "girl", "boy", "unisex"],
      default: "unisex",
    },
    hasVariants: { type: Boolean, default: false },
    variants: { type: [VariantSchema], default: [] },
    optionTypes: { type: [OptionTypeSchema], default: [] },
    specifications: { type: [AttributeSchema], default: [] },
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: { type: String, trim: true },
    },
    deletedAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Essential indexes only
ProductSchema.index({ name: "text", description: "text", "seo.title": "text" });
ProductSchema.index({ price: 1, createdAt: -1 });
ProductSchema.index({ category: 1, isActive: 1 });

// Simplified pre-save hook
ProductSchema.pre("save", function (next) {
  if (this.hasVariants && this.variants?.length > 0) {
    // Generate option types from variants
    const optionMap = new Map<string, Set<string>>();

    this.variants.forEach((variant) => {
      if (variant.optionValues) {
        // Handle both Map and plain object cases
        const optionEntries =
          variant.optionValues instanceof Map
            ? Array.from(variant.optionValues.entries())
            : Object.entries(variant.optionValues);

        optionEntries.forEach(([name, value]) => {
          if (!optionMap.has(name)) optionMap.set(name, new Set());
          optionMap.get(name)!.add(value);
        });
      }
    });

    this.optionTypes = Array.from(optionMap.entries()).map(
      ([name, values]) => ({
        name,
        values: Array.from(values),
      })
    );

    // Set min price and max MRP
    const prices = this.variants.map((v) => v.price);
    const mrps = this.variants.map((v) => v.mrp);
    this.price = Math.min(...prices);
    this.mrp = Math.max(...mrps);
  }
  next();
});

const Product =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
