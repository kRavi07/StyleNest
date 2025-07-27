import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";
import Category from "./category";

/*
export interface ProductDocument extends Document {
  name: string;
  slug: string;
  shortDescription: string;
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
  gender: string;
  variants?: {
    name: string;
    sku: string;
    price: number;
    stock: number;
    images: string[];
    optionValues: [{ name: String; value: String }];
    attributes: [
      {
        name: string;
        value: string;
      }
    ];
  }[];
  attributes: [
    {
      name: string;
      value: string;
    }
  ];
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
    shortDescription: {
      type: String,
      required: [true, "Please provide a short description"],
      maxlength: [200, "Description cannot be more than 200 characters"],
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
    gender: {
      type: String,
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
    hasVariants: {
      type: Boolean,
      default: false,
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
          attributes: [
            {
              name: String,
              value: String,
            },
          ],
        },
      ],
      default: [],
    },
    attributes: {
      type: [
        {
          name: String,
          value: String,
        },
      ],
      default: [],
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
  mongoose.model<ProductDocument>("Product", ProductSchema);*/

function generateOptionTypesFromVariants(variants: IVariant[]): IOptionType[] {
  const optionMap = new Map<string, Set<string>>();

  for (const variant of variants) {
    const optionValues = variant.optionValues;

    // Handle Map type (defensive)
    if (optionValues instanceof Map) {
      const entries = Array.from(optionValues.entries());
      for (const [name, value] of entries) {
        if (!optionMap.has(name)) {
          optionMap.set(name, new Set());
        }
        optionMap.get(name)!.add(value);
      }
    }
    // Handle plain object
    else if (typeof optionValues === "object" && optionValues !== null) {
      for (const [name, value] of Object.entries(optionValues)) {
        if (!optionMap.has(name)) {
          optionMap.set(name, new Set());
        }
        optionMap.get(name)!.add(value);
      }
    }
  }

  return Array.from(optionMap.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values),
  }));
}

export interface IOptionType {
  name: string;
  values: string[];
}

export interface IOptionValue {
  name: string;
  value: string;
}

export interface IAttribute {
  name: string;
  value: string;
}

export interface IVariant {
  _id: Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  images: string[];
  optionValues: Record<string, string>;
  attributes?: IAttribute[];
  isActive?: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price?: number;
  mrp?: number;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
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
    title: string;
    description: string;
    keywords: string;
  };
  deletedAt?: Date;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OptionValueSchema = new Schema<IOptionValue>(
  {
    name: { type: String, required: [true, "Option name is required"] },
    value: { type: String, required: [true, "Option value is required"] },
  },
  { _id: false }
);

const AttributeSchema = new Schema<IAttribute>(
  {
    name: { type: String, required: [true, "Attribute name is required"] },
    value: { type: String, required: [true, "Attribute value is required"] },
  },
  { _id: false }
);

const VariantSchema = new Schema<IVariant>(
  {
    name: {
      type: String,
      required: [true, "Variant name is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be non-negative"],
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"],
      min: [0, "MRP must be non-negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    images: [{ type: String }],
    optionValues: {
      type: Map,
      of: String,
      required: [true, "Option values are required"],
      validate: {
        validator: (map: Map<string, string>) => map.size > 0,
        message: "At least one option value is required",
      },
    },
    attributes: { type: [AttributeSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const OptionTypeSchema = new Schema<IOptionType>(
  {
    name: { type: String, required: [true, "Option type name is required"] },
    values: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one value is required for an option type",
      },
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      index: true,
    },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    price: {
      type: Number,
      optional: true,
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"],
      min: [0, "MRP must be non-negative"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: Category,
      required: [true, "Category is required"],
      index: true,
    },
    subcategory: { type: Schema.Types.ObjectId, ref: Category },
    images: { type: [String], default: [] },
    inventory: {
      type: Number,
      default: 0,
      min: [0, "Inventory cannot be negative"],
    },
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

// Full-text search
ProductSchema.index({
  name: "text",
  slug: "text",
  "seo.title": "text",
  "seo.keywords": "text",
  "seo.description": "text",
});

// Compound index for category + visibility
ProductSchema.index({ category: 1, isActive: 1, featured: -1 });

console.log("🔥 Product pre-save going to be triggered");
ProductSchema.pre("save", function (next) {
  console.log("Variants:");
  console.log(this.variants);
  console.log("hasVariants: ", this.hasVariants);
  if (this.hasVariants && this.variants && this.variants.length > 0) {
    const optionTypes = generateOptionTypesFromVariants(this.variants);
    console.log(optionTypes);
    this.optionTypes = optionTypes;

    const prices = this.variants.map((v) => v.price);
    this.price = Math.min(...prices);
    const mrps = this.variants.map((v) => v.mrp);
    this.mrp = Math.max(...mrps);
  } else {
    this.optionTypes = [];
  }
  next();
});
export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
