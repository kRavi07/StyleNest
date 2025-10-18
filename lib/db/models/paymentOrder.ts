import mongoose from "mongoose";

export interface IPaymentOrder {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number; // UNIX timestamp
  currency: string;
  entity: string;
  orderId: string; // External payment ID
  notes?: string[];
  offer_id?: string;
  receipt?: string;
  status:
    | "created"
    | "authorized"
    | "captured"
    | "failed"
    | "refunded"
    | "canceled";
}

const PaymentOrderSchema = new mongoose.Schema<IPaymentOrder>(
  {
    amount: { type: Number, required: true },
    amount_due: { type: Number, required: true },
    amount_paid: { type: Number, required: true },
    attempts: { type: Number, required: true },
    created_at: { type: Number, required: true }, // Could use Date if UNIX timestamp not needed
    currency: { type: String, required: true },
    entity: { type: String, required: true },
    orderId: { type: String, required: true, unique: true }, // External payment ID?
    notes: { type: [String], default: [] },
    offer_id: { type: String },
    receipt: { type: String },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PaymentOrder ||
  mongoose.model("PaymentOrder", PaymentOrderSchema);
