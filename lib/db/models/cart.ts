/* eslint-disable no-unused-vars */
import mongoose, { Document, Schema, Model, model, Types } from "mongoose";

// Snapshot info for UI rendering and resilience
export interface CartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  title: string;
  image: string;
  variant?: string;
  variantId?: string; // Optional variant ID for products with variants
}

export interface CartDocument extends Document {
  user: Types.ObjectId;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
  calculateTotals: () => void;
  isEmpty: boolean; // virtual
}

const cartItemSchema = new Schema<CartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    price: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    variantId: {
      type: String,
    },
    variant: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new Schema<CartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate totals: total quantity and total price
cartSchema.methods.calculateTotals = function (this: CartDocument) {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

// Pre-save hook to always recalculate totals
cartSchema.pre<CartDocument>("save", function (next) {
  this.calculateTotals();
  next();
});

cartSchema.virtual("isEmpty").get(function (this: CartDocument) {
  return this.items.length === 0;
});

export default mongoose.models.Cart || model<CartDocument>("Cart", cartSchema);
