// Product types
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  images: string[];
  inventory: number;
  sizes: string[];
  colors: string[];
  featured: boolean;
  rating: number;
  reviews: number;
  isNewProduct?: boolean;
  isSale?: boolean;
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
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
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
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

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
