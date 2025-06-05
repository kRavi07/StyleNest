export interface OrderData {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  variantInfo?: {
    [key: string]: string;
  };
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export const getOrders = (): OrderData[] => {
  return [
    {
      id: "o1",
      orderNumber: "ORD-2023-0001",
      customer: {
        id: "c1",
        name: "Olivia Martin",
        email: "olivia.martin@email.com"
      },
      status: "delivered",
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      total: 1999.00,
      subtotal: 1899.00,
      tax: 100.00,
      shipping: 0,
      discount: 0,
      items: [
        {
          id: "oi1",
          productId: "p1",
          name: "Modern Ergonomic Chair",
          sku: "CHAIR-001",
          price: 299.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
          id: "oi2",
          productId: "p2",
          name: "Premium Wireless Headphones",
          sku: "AUDIO-002-BLK",
          price: 249.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          variantInfo: {
            color: "Black"
          }
        },
        {
          id: "oi3",
          productId: "p5",
          name: "Professional DSLR Camera",
          sku: "CAMERA-005",
          price: 1299.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
      ],
      shippingAddress: {
        firstName: "Olivia",
        lastName: "Martin",
        address1: "123 Main St",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "United States",
        phone: "415-555-1234"
      },
      billingAddress: {
        firstName: "Olivia",
        lastName: "Martin",
        address1: "123 Main St",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "United States",
        phone: "415-555-1234"
      },
      createdAt: "2023-06-15T10:00:00Z",
      updatedAt: "2023-06-18T14:30:00Z"
    },
    {
      id: "o2",
      orderNumber: "ORD-2023-0002",
      customer: {
        id: "c2",
        name: "Jackson Lee",
        email: "jackson.lee@email.com"
      },
      status: "shipped",
      paymentStatus: "paid",
      paymentMethod: "PayPal",
      total: 39.00,
      subtotal: 35.99,
      tax: 3.01,
      shipping: 0,
      discount: 0,
      items: [
        {
          id: "oi4",
          productId: "p6",
          name: "Stainless Steel Water Bottle",
          sku: "BOTTLE-006-BLU",
          price: 35.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/4000083/pexels-photo-4000083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          variantInfo: {
            color: "Blue"
          }
        }
      ],
      shippingAddress: {
        firstName: "Jackson",
        lastName: "Lee",
        address1: "456 Oak Ave",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "United States",
        phone: "512-555-6789"
      },
      billingAddress: {
        firstName: "Jackson",
        lastName: "Lee",
        address1: "456 Oak Ave",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "United States",
        phone: "512-555-6789"
      },
      createdAt: "2023-06-16T11:15:00Z",
      updatedAt: "2023-06-17T09:45:00Z"
    },
    {
      id: "o3",
      orderNumber: "ORD-2023-0003",
      customer: {
        id: "c3",
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com"
      },
      status: "processing",
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      total: 299.00,
      subtotal: 279.98,
      tax: 19.02,
      shipping: 0,
      discount: 0,
      items: [
        {
          id: "oi5",
          productId: "p4",
          name: "Organic Cotton T-Shirt",
          sku: "APPAREL-004-M-BLU",
          price: 29.99,
          quantity: 2,
          image: "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          variantInfo: {
            size: "Medium",
            color: "Blue"
          }
        },
        {
          id: "oi6",
          productId: "p3",
          name: "Smart Home Hub",
          sku: "SMARTHOME-003",
          price: 129.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/4219528/pexels-photo-4219528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
          id: "oi7",
          productId: "p7",
          name: "Bluetooth Fitness Tracker",
          sku: "FITNESS-007",
          price: 89.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/4426283/pexels-photo-4426283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
      ],
      shippingAddress: {
        firstName: "Isabella",
        lastName: "Nguyen",
        address1: "789 Pine St",
        address2: "Apt 4B",
        city: "Seattle",
        state: "WA",
        postalCode: "98101",
        country: "United States",
        phone: "206-555-9012"
      },
      billingAddress: {
        firstName: "Isabella",
        lastName: "Nguyen",
        address1: "789 Pine St",
        address2: "Apt 4B",
        city: "Seattle",
        state: "WA",
        postalCode: "98101",
        country: "United States",
        phone: "206-555-9012"
      },
      createdAt: "2023-06-17T14:30:00Z",
      updatedAt: "2023-06-17T15:00:00Z"
    },
    {
      id: "o4",
      orderNumber: "ORD-2023-0004",
      customer: {
        id: "c4",
        name: "William Kim",
        email: "will@email.com"
      },
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "Bank Transfer",
      total: 99.00,
      subtotal: 89.99,
      tax: 9.01,
      shipping: 0,
      discount: 0,
      items: [
        {
          id: "oi8",
          productId: "p7",
          name: "Bluetooth Fitness Tracker",
          sku: "FITNESS-007",
          price: 89.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/4426283/pexels-photo-4426283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
      ],
      shippingAddress: {
        firstName: "William",
        lastName: "Kim",
        address1: "101 Maple Dr",
        city: "Chicago",
        state: "IL",
        postalCode: "60601",
        country: "United States",
        phone: "312-555-3456"
      },
      billingAddress: {
        firstName: "William",
        lastName: "Kim",
        address1: "101 Maple Dr",
        city: "Chicago",
        state: "IL",
        postalCode: "60601",
        country: "United States",
        phone: "312-555-3456"
      },
      createdAt: "2023-06-18T09:20:00Z",
      updatedAt: "2023-06-18T09:20:00Z"
    },
    {
      id: "o5",
      orderNumber: "ORD-2023-0005",
      customer: {
        id: "c5",
        name: "Sofia Davis",
        email: "sofia.davis@email.com"
      },
      status: "cancelled",
      paymentStatus: "refunded",
      paymentMethod: "Credit Card",
      total: 39.00,
      subtotal: 35.99,
      tax: 3.01,
      shipping: 0,
      discount: 0,
      items: [
        {
          id: "oi9",
          productId: "p6",
          name: "Stainless Steel Water Bottle",
          sku: "BOTTLE-006-BLK",
          price: 35.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/4000083/pexels-photo-4000083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          variantInfo: {
            color: "Black"
          }
        }
      ],
      shippingAddress: {
        firstName: "Sofia",
        lastName: "Davis",
        address1: "202 Cedar Ln",
        city: "Boston",
        state: "MA",
        postalCode: "02108",
        country: "United States",
        phone: "617-555-7890"
      },
      billingAddress: {
        firstName: "Sofia",
        lastName: "Davis",
        address1: "202 Cedar Ln",
        city: "Boston",
        state: "MA",
        postalCode: "02108",
        country: "United States",
        phone: "617-555-7890"
      },
      notes: "Customer requested cancellation due to ordering the wrong color.",
      createdAt: "2023-06-18T13:40:00Z",
      updatedAt: "2023-06-19T10:15:00Z"
    },
    {
      id: "o6",
      orderNumber: "ORD-2023-0006",
      customer: {
        id: "c6",
        name: "Ethan Roberts",
        email: "ethan.roberts@email.com"
      },
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "Credit Card",
      total: 324.98,
      subtotal: 299.98,
      tax: 25.00,
      shipping: 0,
      discount: 0,
      items: [
        {
          id: "oi10",
          productId: "p2",
          name: "Premium Wireless Headphones",
          sku: "AUDIO-002-WHT",
          price: 249.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          variantInfo: {
            color: "White"
          }
        },
        {
          id: "oi11",
          productId: "p8",
          name: "Handcrafted Ceramic Mug",
          sku: "MUG-008",
          price: 24.99,
          quantity: 2,
          image: "https://images.pexels.com/photos/1566308/pexels-photo-1566308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
      ],
      shippingAddress: {
        firstName: "Ethan",
        lastName: "Roberts",
        address1: "303 Elm St",
        city: "Denver",
        state: "CO",
        postalCode: "80202",
        country: "United States",
        phone: "303-555-1234"
      },
      billingAddress: {
        firstName: "Ethan",
        lastName: "Roberts",
        address1: "303 Elm St",
        city: "Denver",
        state: "CO",
        postalCode: "80202",
        country: "United States",
        phone: "303-555-1234"
      },
      createdAt: "2023-06-19T16:05:00Z",
      updatedAt: "2023-06-19T16:05:00Z"
    },
    {
      id: "o7",
      orderNumber: "ORD-2023-0007",
      customer: {
        id: "c7",
        name: "Ava Thompson",
        email: "ava.thompson@email.com"
      },
      status: "processing",
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      total: 354.98,
      subtotal: 329.98,
      tax: 25.00,
      shipping: 0,
      discount: 0,
      items: [
        {
          id: "oi12",
          productId: "p1",
          name: "Modern Ergonomic Chair",
          sku: "CHAIR-001",
          price: 299.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
          id: "oi13",
          productId: "p8",
          name: "Handcrafted Ceramic Mug",
          sku: "MUG-008",
          price: 24.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/1566308/pexels-photo-1566308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
      ],
      shippingAddress: {
        firstName: "Ava",
        lastName: "Thompson",
        address1: "404 Birch Ave",
        city: "Portland",
        state: "OR",
        postalCode: "97201",
        country: "United States",
        phone: "503-555-5678"
      },
      billingAddress: {
        firstName: "Ava",
        lastName: "Thompson",
        address1: "404 Birch Ave",
        city: "Portland",
        state: "OR",
        postalCode: "97201",
        country: "United States",
        phone: "503-555-5678"
      },
      createdAt: "2023-06-20T11:30:00Z",
      updatedAt: "2023-06-20T12:15:00Z"
    },
    {
      id: "o8",
      orderNumber: "ORD-2023-0008",
      customer: {
        id: "c8",
        name: "Noah Garcia",
        email: "noah.garcia@email.com"
      },
      status: "shipped",
      paymentStatus: "paid",
      paymentMethod: "PayPal",
      total: 149.99,
      subtotal: 139.99,
      tax: 10.00,
      shipping: 0,
      discount: 0,
      items: [
        {
          id: "oi14",
          productId: "p3",
          name: "Smart Home Hub",
          sku: "SMARTHOME-003",
          price: 129.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/4219528/pexels-photo-4219528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
          id: "oi15",
          productId: "p4",
          name: "Organic Cotton T-Shirt",
          sku: "APPAREL-004-S-BLU",
          price: 29.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          variantInfo: {
            size: "Small",
            color: "Blue"
          }
        }
      ],
      shippingAddress: {
        firstName: "Noah",
        lastName: "Garcia",
        address1: "505 Spruce Ct",
        city: "Miami",
        state: "FL",
        postalCode: "33101",
        country: "United States",
        phone: "305-555-9012"
      },
      billingAddress: {
        firstName: "Noah",
        lastName: "Garcia",
        address1: "505 Spruce Ct",
        city: "Miami",
        state: "FL",
        postalCode: "33101",
        country: "United States",
        phone: "305-555-9012"
      },
      createdAt: "2023-06-21T09:45:00Z",
      updatedAt: "2023-06-22T14:20:00Z"
    }
  ];
};