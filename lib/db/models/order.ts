import { Address } from "@/types";
import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: {
    productId: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    image?: string;
    variantInfo?: Record<string, string>;
  }[];
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "pending", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        sku: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: String,
        variantInfo: {
          type: Map,
          of: String,
        },
      },
    ],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address1: { type: String, required: true },
      address2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: String,
    },
    billingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address1: { type: String, required: true },
      address2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      landmark: { type: String },
      phone: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
