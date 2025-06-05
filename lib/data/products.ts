export interface ProductData {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  comparePrice?: number;
  category: string;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  tags: string[];
  image?: string;
  images: string[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    [key: string]: string;
  };
}

export const getProducts = (): ProductData[] => {
  return [
    {
      id: "p1",
      name: "Modern Ergonomic Chair",
      description: "A comfortable chair designed for long work sessions",
      sku: "CHAIR-001",
      price: 299.99,
      comparePrice: 349.99,
      category: "Furniture",
      stock: 45,
      status: "in-stock",
      tags: ["office", "chair", "ergonomic"],
      image: "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      images: [
        "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      createdAt: "2023-01-15T12:00:00Z",
      updatedAt: "2023-05-20T14:30:00Z",
    },
    {
      id: "p2",
      name: "Premium Wireless Headphones",
      description: "High-quality sound with noise cancellation",
      sku: "AUDIO-002",
      price: 249.99,
      category: "Electronics",
      stock: 28,
      status: "in-stock",
      tags: ["audio", "wireless", "headphones"],
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      images: [
        "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      variants: [
        {
          id: "v1",
          name: "Black",
          sku: "AUDIO-002-BLK",
          price: 249.99,
          stock: 18,
          attributes: {
            color: "Black"
          }
        },
        {
          id: "v2",
          name: "White",
          sku: "AUDIO-002-WHT",
          price: 249.99,
          stock: 10,
          attributes: {
            color: "White"
          }
        }
      ],
      createdAt: "2023-02-10T10:15:00Z",
      updatedAt: "2023-06-05T09:45:00Z",
    },
    {
      id: "p3",
      name: "Smart Home Hub",
      description: "Control all your smart devices from one central hub",
      sku: "SMARTHOME-003",
      price: 129.99,
      category: "Smart Home",
      stock: 5,
      status: "low-stock",
      tags: ["smart home", "hub", "automation"],
      image: "https://images.pexels.com/photos/4219528/pexels-photo-4219528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      images: [
        "https://images.pexels.com/photos/4219528/pexels-photo-4219528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      createdAt: "2023-03-01T15:30:00Z",
      updatedAt: "2023-06-10T11:20:00Z",
    },
    {
      id: "p4",
      name: "Organic Cotton T-Shirt",
      description: "Soft, sustainable, and stylish t-shirt",
      sku: "APPAREL-004",
      price: 29.99,
      category: "Apparel",
      stock: 120,
      status: "in-stock",
      tags: ["clothing", "organic", "sustainable"],
      image: "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      images: [
        "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      variants: [
        {
          id: "v3",
          name: "Small / Blue",
          sku: "APPAREL-004-S-BLU",
          price: 29.99,
          stock: 35,
          attributes: {
            size: "Small",
            color: "Blue"
          }
        },
        {
          id: "v4",
          name: "Medium / Blue",
          sku: "APPAREL-004-M-BLU",
          price: 29.99,
          stock: 42,
          attributes: {
            size: "Medium",
            color: "Blue"
          }
        },
        {
          id: "v5",
          name: "Large / Blue",
          sku: "APPAREL-004-L-BLU",
          price: 29.99,
          stock: 43,
          attributes: {
            size: "Large",
            color: "Blue"
          }
        },
      ],
      createdAt: "2023-03-15T09:00:00Z",
      updatedAt: "2023-06-12T16:45:00Z",
    },
    {
      id: "p5",
      name: "Professional DSLR Camera",
      description: "High-resolution photography with advanced features",
      sku: "CAMERA-005",
      price: 1299.99,
      comparePrice: 1499.99,
      category: "Electronics",
      stock: 0,
      status: "out-of-stock",
      tags: ["camera", "photography", "professional"],
      image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      images: [
        "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      createdAt: "2023-04-05T14:20:00Z",
      updatedAt: "2023-06-15T10:30:00Z",
    },
    {
      id: "p6",
      name: "Stainless Steel Water Bottle",
      description: "Keeps drinks cold for 24 hours or hot for 12 hours",
      sku: "BOTTLE-006",
      price: 35.99,
      category: "Home & Kitchen",
      stock: 78,
      status: "in-stock",
      tags: ["water bottle", "sustainable", "stainless steel"],
      image: "https://images.pexels.com/photos/4000083/pexels-photo-4000083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      images: [
        "https://images.pexels.com/photos/4000083/pexels-photo-4000083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      variants: [
        {
          id: "v6",
          name: "Blue",
          sku: "BOTTLE-006-BLU",
          price: 35.99,
          stock: 28,
          attributes: {
            color: "Blue"
          }
        },
        {
          id: "v7",
          name: "Black",
          sku: "BOTTLE-006-BLK",
          price: 35.99,
          stock: 32,
          attributes: {
            color: "Black"
          }
        },
        {
          id: "v8",
          name: "Silver",
          sku: "BOTTLE-006-SLV",
          price: 35.99,
          stock: 18,
          attributes: {
            color: "Silver"
          }
        }
      ],
      createdAt: "2023-04-20T11:10:00Z",
      updatedAt: "2023-06-18T13:25:00Z",
    },
    {
      id: "p7",
      name: "Bluetooth Fitness Tracker",
      description: "Monitor your health and activity with this sleek device",
      sku: "FITNESS-007",
      price: 89.99,
      category: "Fitness",
      stock: 3,
      status: "low-stock",
      tags: ["fitness", "tracker", "bluetooth"],
      image: "https://images.pexels.com/photos/4426283/pexels-photo-4426283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      images: [
        "https://images.pexels.com/photos/4426283/pexels-photo-4426283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      createdAt: "2023-05-02T16:40:00Z",
      updatedAt: "2023-06-20T09:15:00Z",
    },
    {
      id: "p8",
      name: "Handcrafted Ceramic Mug",
      description: "Unique, artisanal mug perfect for your morning coffee",
      sku: "MUG-008",
      price: 24.99,
      category: "Home & Kitchen",
      stock: 42,
      status: "in-stock",
      tags: ["mug", "ceramic", "handcrafted"],
      image: "https://images.pexels.com/photos/1566308/pexels-photo-1566308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      images: [
        "https://images.pexels.com/photos/1566308/pexels-photo-1566308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      createdAt: "2023-05-15T08:50:00Z",
      updatedAt: "2023-06-22T14:10:00Z",
    },
  ];
};