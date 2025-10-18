import mongoose from "mongoose";

export interface ICard {
  id?: string;
  entity?: string;
  name?: string;
  last4?: string;
  network?: string;
  type?: string; // credit / debit
  issuer?: string;
  international?: boolean;
  emi?: boolean;
  sub_type?: string;
  token_iin?: string | null;
}

export interface IUpi {
  payer_account_type?: string;
  vpa?: string;
  flow?: string; // collect / intent
}

export interface IAcquirerData {
  auth_code?: string | null;
  rrn?: string | null;
  transaction_id?: string | null;
}

export interface IPayment {
  id: string; // Razorpay payment_id
  entity: "payment";

  amount: number; // in paise
  currency: string;

  status: "created" | "authorized" | "captured" | "failed" | "refunded";

  order_id: string; // Razorpay order_id
  invoice_id?: string | null;
  international?: boolean;

  method?: "card" | "netbanking" | "wallet" | "upi" | "emi" | "other";

  amount_refunded?: number;
  refund_status?: string | null;

  captured?: boolean;
  description?: string;

  card_id?: string | null;
  card?: ICard | null;

  bank?: string | null;
  wallet?: string | null;
  vpa?: string | null; // top-level UPI string

  upi?: IUpi | null;

  email?: string | null;
  contact?: string | null;

  notes?: Record<string, any>[] | Record<string, any>;

  fee?: number;
  tax?: number;

  error_code?: string | null;
  error_description?: string | null;
  error_source?: string | null;
  error_step?: string | null;
  error_reason?: string | null;

  acquirer_data?: IAcquirerData | null;

  created_at: Date;

  // Useful for auditing
  raw_response?: Record<string, any>;
}

const CardSchema = new mongoose.Schema(
  {
    id: { type: String },
    entity: { type: String },
    name: { type: String },
    last4: { type: String },
    network: { type: String },
    type: { type: String }, // credit / debit
    issuer: { type: String },
    international: { type: Boolean },
    emi: { type: Boolean },
    sub_type: { type: String },
    token_iin: { type: String, default: null },
  },
  { _id: false }
);

const UpiSchema = new mongoose.Schema(
  {
    payer_account_type: { type: String },
    vpa: { type: String },
    flow: { type: String }, // collect / intent
  },
  { _id: false }
);

const AcquirerDataSchema = new mongoose.Schema(
  {
    auth_code: { type: String, default: null },
    rrn: { type: String, default: null },
    transaction_id: { type: String, default: null },
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // Razorpay payment_id
    entity: { type: String, default: "payment" },

    amount: { type: Number, required: true }, // in paise
    currency: { type: String, required: true },

    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      required: true,
    },

    order_id: { type: String, required: true }, // Razorpay order_id
    invoice_id: { type: String, default: null },
    international: { type: Boolean, default: false },

    method: {
      type: String,
      enum: ["card", "netbanking", "wallet", "upi", "emi", "other"],
    },

    amount_refunded: { type: Number, default: 0 },
    refund_status: { type: String, default: null },

    captured: { type: Boolean, default: false },
    description: { type: String },

    card_id: { type: String, default: null },
    card: { type: CardSchema, default: null },

    bank: { type: String, default: null },
    wallet: { type: String, default: null },
    vpa: { type: String, default: null }, // UPI string

    upi: { type: UpiSchema, default: null }, // Detailed UPI payload

    email: { type: String, default: null },
    contact: { type: String, default: null },

    notes: { type: mongoose.Schema.Types.Mixed, default: [] },

    fee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },

    error_code: { type: String, default: null },
    error_description: { type: String, default: null },
    error_source: { type: String, default: null },
    error_step: { type: String, default: null },
    error_reason: { type: String, default: null },

    acquirer_data: { type: AcquirerDataSchema, default: null },

    created_at: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Payments ||
  mongoose.model<IPayment>("Payments", PaymentSchema);
