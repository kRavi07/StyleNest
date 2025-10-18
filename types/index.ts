import { IOptionType, IProduct, IVariant } from "@/lib/db/models/product";
import { ShippingAddress } from "./checkout";
import { IAddress } from "@/lib/db/models/address";

export interface ProfileResponse {
  _id: string;
  name: string;
  email: string;
  mobileno: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type OptionValue = {
  name: string;
  value: string;
};

export interface Variant extends Omit<IVariant, "_id"> {
  _id: string;
  images: string[];
}

export interface Product
  extends Omit<IProduct, "_id" | "variants" | "category"> {
  _id: string;
  variants: Variant[];
  category: {
    _id: string;
    name: string;
  };
}

export type VariantResponse = {
  variants: Variant[];
};

export type ProductListView = {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  category: string;
  subcategory: string;
  images: string[];
  featured: boolean;
  rating: number;
  reviews: number;
  isNewProduct?: boolean;
  isSale?: boolean;
};

// Order types
export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantInfo?: Record<string, any>;
  sku?: string;
  _id: string;
};

export type Order = {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  trackingNumber?: string;
};

export type ProductVariant = {
  name: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  optionValues: [{ name: String; value: String }];
  attributes?: Record<string, string>;
};

// User types
export type Address = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  type?: "home" | "work" | "other";
  isPrimary?: boolean;
};

export interface AddressResponse extends IAddress {
  _id: string;
}

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  addresses: Address[];
  orders: Order[];
  wishlist: string[];
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export interface PaymentResponse {
  method?: string; // Card, UPI, Wallet, Netbanking
  card?: {
    last4: string;
    network: string;
    name?: string;
    issuer?: string;
    type?: string;
  };
  upi?: {
    vpa: string;
  };
  wallet?: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
