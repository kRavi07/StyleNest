import { IOrder } from "@/lib/db/models/order";
import { PaymentResponse } from "./index";

export type ORDER_STATUS =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderDetails extends IOrder {
  _id: string;
  payment: PaymentResponse;
}
