import { z } from "zod";

export const CartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
});

export const RemoveCartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const WishlistItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
});

export const CreateOrderSchema = z.object({
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.enum(["razorpay", "cod"]).default("razorpay"),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled", "shipped", "delivered"]),
});

export const PaymentVerificationSchema = z.object({
  razorpayOrderId: z.string().min(1, "Razorpay order ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  paymentId: z.string().min(1, "Payment ID is required"),
  signature: z.string().min(1, "Signature is required"),
});

export const ShippingRatesSchema = z.object({
  pinCode: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
});
