export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  orderCount: number;
  totalSpent: number;
  status: "active" | "inactive" | "new";
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export const getCustomers = (): CustomerData[] => {
  return [
    {
      id: "c1",
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      phone: "415-555-1234",
      location: "San Francisco, CA",
      orderCount: 5,
      totalSpent: 2845.98,
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=28",
      createdAt: "2022-10-15T12:00:00Z",
      updatedAt: "2023-06-18T14:30:00Z"
    },
    {
      id: "c2",
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      phone: "512-555-6789",
      location: "Austin, TX",
      orderCount: 2,
      totalSpent: 189.99,
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=32",
      createdAt: "2023-01-22T09:15:00Z",
      updatedAt: "2023-06-17T09:45:00Z"
    },
    {
      id: "c3",
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      phone: "206-555-9012",
      location: "Seattle, WA",
      orderCount: 8,
      totalSpent: 1243.92,
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=35",
      createdAt: "2022-08-10T15:30:00Z",
      updatedAt: "2023-06-17T15:00:00Z"
    },
    {
      id: "c4",
      name: "William Kim",
      email: "will@email.com",
      phone: "312-555-3456",
      location: "Chicago, IL",
      orderCount: 3,
      totalSpent: 567.49,
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=43",
      createdAt: "2023-02-05T11:45:00Z",
      updatedAt: "2023-06-18T09:20:00Z"
    },
    {
      id: "c5",
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      phone: "617-555-7890",
      location: "Boston, MA",
      orderCount: 1,
      totalSpent: 39.99,
      status: "inactive",
      avatar: "https://i.pravatar.cc/150?img=45",
      notes: "Customer requested account deactivation on 06/19/2023.",
      createdAt: "2023-05-12T14:20:00Z",
      updatedAt: "2023-06-19T10:15:00Z"
    },
    {
      id: "c6",
      name: "Ethan Roberts",
      email: "ethan.roberts@email.com",
      phone: "303-555-1234",
      location: "Denver, CO",
      orderCount: 4,
      totalSpent: 829.96,
      status: "active",
      createdAt: "2022-11-08T10:10:00Z",
      updatedAt: "2023-06-19T16:05:00Z"
    },
    {
      id: "c7",
      name: "Ava Thompson",
      email: "ava.thompson@email.com",
      phone: "503-555-5678",
      location: "Portland, OR",
      orderCount: 6,
      totalSpent: 1154.94,
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=24",
      createdAt: "2022-09-20T13:30:00Z",
      updatedAt: "2023-06-20T12:15:00Z"
    },
    {
      id: "c8",
      name: "Noah Garcia",
      email: "noah.garcia@email.com",
      phone: "305-555-9012",
      location: "Miami, FL",
      orderCount: 2,
      totalSpent: 349.98,
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=60",
      createdAt: "2023-04-15T16:45:00Z",
      updatedAt: "2023-06-22T14:20:00Z"
    },
    {
      id: "c9",
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      phone: "702-555-3456",
      location: "Las Vegas, NV",
      orderCount: 0,
      totalSpent: 0,
      status: "new",
      createdAt: "2023-06-22T09:00:00Z",
      updatedAt: "2023-06-22T09:00:00Z"
    },
    {
      id: "c10",
      name: "Liam Johnson",
      email: "liam.johnson@email.com",
      phone: "404-555-7890",
      location: "Atlanta, GA",
      orderCount: 1,
      totalSpent: 129.99,
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=65",
      createdAt: "2023-05-05T11:20:00Z",
      updatedAt: "2023-06-15T14:10:00Z"
    }
  ];
};