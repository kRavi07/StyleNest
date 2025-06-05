import mongoose, { Schema, Document, ObjectId } from "mongoose";
import Category from "./category";
export interface ProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  category: ObjectId;
  subcategory: ObjectId;
  images: string[];
  inventory: number;
  inventoryStatsus: string;
  featured: boolean;
  rating: number;
  reviews: number;
  isNewProduct: boolean;
  isSale: boolean;
  isActive: boolean;
  variantAttribute?: string[];
  variants?: {
    name: string;
    sku: string;
    price: number;
    stock: number;
    images: string[];
    optionValues: [{ name: String; value: String }];
    attributes: Record<string, string>;
  }[];
  attributes: Record<string, string>;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isArchivred?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date;
  archivedAt?: Date;
}

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a product slug"],
      maxlength: [100, "Name cannot be more than 100 characters"],
      minlength: [3, "Slug must be at least 3 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    mrp: {
      type: Number,
      required: [true, "Please provide MRP"],
    },
    category: {
      required: [true, "Please provide a category"],
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      validate: {
        validator: async function (value: string) {
          const category = await mongoose.models.Category.findById(value);
          return !!category; // Ensure category exists
        },
        message: "Category does not exist",
      },
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      validate: {
        validator: async function (value: string) {
          const category = await Category.findById(value);
          return !!category;
        },
        message: "Category does not exist",
      },
    },
    variantAttribute: {
      type: [String],
      default: [],
    },
    variants: {
      type: [
        {
          name: String,
          sku: String,
          price: Number,
          stock: Number,
          images: [String],
          optionValues: [{ name: String, value: String }],
          attributes: {
            type: Map,
            of: String,
          },
        },
      ],
      default: [],
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    seo: {
      title: String,
      description: String,
      keywords: String,
    },

    images: {
      type: [String],
      required: [true, "Please provide at least one image"],
    },
    inventory: {
      type: Number,
      required: [true, "Please provide inventory count"],
      default: 0,
    },
    inventoryStatsus: {
      type: String,
      enum: ["in-stock", "out-of-stock", "pre-order"],
      default: "in-stock",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    isArchivred: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    archivedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema);
