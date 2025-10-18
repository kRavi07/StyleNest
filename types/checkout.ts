import { Address } from "@/types";
export interface ShippingAddress extends Address {
  _id?: string;
}

export interface ShippingRate {
  type: string;
  name: string;
  rate: number;
  estimatedDays: string;
  description: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentMethod: "razorpay" | "cod";
  shippingRate: ShippingRate;
  useSameBillingAddress: boolean;
}
