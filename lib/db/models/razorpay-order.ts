// models/RazorpayOrder.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: Record<string, any>;
  field?: string;
  createdAt?: Date;
}

export interface IRazorpayOrder extends Document {
  razorpayOrderId: string; // order_RHDBzj5xgi4U1B
  entity: string; // "order"
  amount: number;
  amount_due: number;
  amount_paid: number;
  currency: string;
  attempts: number;
  status: string; // "created", "paid", "attempted", etc.
  offer_id?: string | null;
  receipt?: string;
  notes: Record<string, any>;
  created_at: number; // from Razorpay (epoch seconds)

  // error handling
  error?: IRazorpayError;

  // local tracking
  lastAttemptAt?: Date;
  isFinalized: boolean; // if true, no more retries
  createdAt: Date;
  updatedAt: Date;
}

const RazorpayErrorSchema = new Schema<IRazorpayError>(
  {
    code: { type: String },
    description: { type: String },
    source: { type: String },
    step: { type: String },
    reason: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    field: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const RazorpayOrderSchema = new Schema<IRazorpayOrder>(
  {
    razorpayOrderId: { type: String, required: true, unique: true },
    entity: { type: String, default: "order" },
    amount: { type: Number, required: true },
    amount_due: { type: Number },
    amount_paid: { type: Number, default: 0 },
    currency: { type: String },
    attempts: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["created", "attempted", "paid", "failed"],
      default: "created",
    },
    offer_id: { type: String, default: null },
    receipt: { type: String },
    notes: { type: Schema.Types.Mixed, default: {} },
    created_at: { type: Number, required: true }, // epoch timestamp from Razorpay

    error: { type: RazorpayErrorSchema, default: null },

    lastAttemptAt: { type: Date },
    isFinalized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.RazorpayOrder ||
  mongoose.model<IRazorpayOrder>("RazorpayOrder", RazorpayOrderSchema);
