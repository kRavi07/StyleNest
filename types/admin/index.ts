import { IPayment } from "@/lib/db/models/razorpay-payments";

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface OrderSummary {
  customer: Customer;
  _id: string;
  orderNumber: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  total: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}
export interface CustomerOrder extends OrderSummary {
  itemsCount: number;
  customer: Customer;
}

export interface PaymentDetails extends IPayment {
  _id: string;
}

export interface OrderSummaryWithPayment extends OrderSummary {
  payment: PaymentDetails;
}
