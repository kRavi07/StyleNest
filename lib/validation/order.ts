import { z } from "zod";

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address1: z.string().min(1, "Address1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  landmark: z.string().optional(), // only in billingAddress
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  sku: z.string().optional(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  orderNumber: z.string().min(1),
  customer: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
  }),
  status: z
    .enum([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ])
    .optional()
    .default("pending"),
  paymentStatus: z
    .enum(["paid", "pending", "failed", "refunded"])
    .optional()
    .default("pending"),
  paymentMethod: z.string().min(1),
  total: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  discount: z.number().nonnegative().optional().default(0),
  items: z.array(orderItemSchema).min(1),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  notes: z.string().optional(),
});
