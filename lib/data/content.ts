export interface ContentData {
  id: string;
  title: string;
  slug: string;
  type: "page" | "blog" | "navigation";
  status: "published" | "draft" | "scheduled";
  author: string;
  description?: string;
  content?: string;
  featuredImage?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export const getContent = (): ContentData[] => {
  return [
    {
      id: "content1",
      title: "Homepage",
      slug: "/",
      type: "page",
      status: "published",
      author: "Admin",
      description: "Main landing page",
      seo: {
        title: "Welcome to Our Store | Premium Products",
        description: "Discover our premium selection of products. Fast shipping, excellent service.",
        keywords: ["shop", "store", "products", "ecommerce"]
      },
      createdAt: "2023-01-15T12:00:00Z",
      updatedAt: "2023-06-10T09:30:00Z",
      publishedAt: "2023-01-20T10:00:00Z"
    },
    {
      id: "content2",
      title: "About Us",
      slug: "/about",
      type: "page",
      status: "published",
      author: "Admin",
      description: "Company information and history",
      seo: {
        title: "About Our Company | Our Story",
        description: "Learn about our company history, mission, and values.",
        keywords: ["about", "company", "history", "mission"]
      },
      createdAt: "2023-01-16T14:30:00Z",
      updatedAt: "2023-05-22T11:15:00Z",
      publishedAt: "2023-01-20T10:05:00Z"
    },
    {
      id: "content3",
      title: "Contact Us",
      slug: "/contact",
      type: "page",
      status: "published",
      author: "Admin",
      description: "Contact information and form",
      seo: {
        title: "Contact Us | Get in Touch",
        description: "Have questions? Contact our support team for assistance.",
        keywords: ["contact", "support", "help", "customer service"]
      },
      createdAt: "2023-01-16T15:45:00Z",
      updatedAt: "2023-04-05T13:20:00Z",
      publishedAt: "2023-01-20T10:10:00Z"
    },
    {
      id: "content4",
      title: "10 Essential Home Office Products",
      slug: "/blog/10-essential-home-office-products",
      type: "blog",
      status: "published",
      author: "Sarah Johnson",
      description: "Discover the must-have products for your home office setup",
      featuredImage: "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      seo: {
        title: "10 Essential Home Office Products | Blog",
        description: "Elevate your home office with these 10 essential products for comfort and productivity.",
        keywords: ["home office", "ergonomic", "productivity", "work from home"]
      },
      createdAt: "2023-03-10T09:15:00Z",
      updatedAt: "2023-06-15T14:30:00Z",
      publishedAt: "2023-03-15T11:00:00Z"
    },
    {
      id: "content5",
      title: "How to Choose the Perfect Headphones",
      slug: "/blog/how-to-choose-perfect-headphones",
      type: "blog",
      status: "published",
      author: "Alex Rodriguez",
      description: "A comprehensive guide to selecting headphones based on your needs",
      featuredImage: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      seo: {
        title: "How to Choose the Perfect Headphones | Guide",
        description: "Find the ideal headphones for your lifestyle with our comprehensive buying guide.",
        keywords: ["headphones", "audio", "buying guide", "wireless"]
      },
      createdAt: "2023-04-05T11:30:00Z",
      updatedAt: "2023-06-18T10:45:00Z",
      publishedAt: "2023-04-10T14:20:00Z"
    },
    {
      id: "content6",
      title: "Summer Collection Preview",
      slug: "/blog/summer-collection-preview",
      type: "blog",
      status: "draft",
      author: "Jessica Chen",
      description: "Sneak peek at our upcoming summer product line",
      featuredImage: "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      seo: {
        title: "Summer Collection Preview | New Arrivals Coming Soon",
        description: "Get a first look at our upcoming summer collection featuring new designs and colors.",
        keywords: ["summer", "collection", "preview", "new arrivals", "fashion"]
      },
      createdAt: "2023-06-20T15:45:00Z",
      updatedAt: "2023-06-22T09:30:00Z"
    },
    {
      id: "content7",
      title: "Shipping & Returns",
      slug: "/shipping-returns",
      type: "page",
      status: "published",
      author: "Admin",
      description: "Policies for shipping and returns",
      seo: {
        title: "Shipping & Returns Policy | Customer Information",
        description: "Information about our shipping methods, delivery times, and return policies.",
        keywords: ["shipping", "returns", "delivery", "policy"]
      },
      createdAt: "2023-01-18T13:10:00Z",
      updatedAt: "2023-05-15T11:20:00Z",
      publishedAt: "2023-01-20T10:15:00Z"
    },
    {
      id: "content8",
      title: "Privacy Policy",
      slug: "/privacy-policy",
      type: "page",
      status: "published",
      author: "Admin",
      description: "Privacy policies and data handling information",
      seo: {
        title: "Privacy Policy | Data Protection Information",
        description: "Learn how we protect your personal information and respect your privacy.",
        keywords: ["privacy", "data", "GDPR", "policy"]
      },
      createdAt: "2023-01-18T14:25:00Z",
      updatedAt: "2023-05-01T09:15:00Z",
      publishedAt: "2023-01-20T10:20:00Z"
    },
    {
      id: "content9",
      title: "Terms of Service",
      slug: "/terms-of-service",
      type: "page",
      status: "published",
      author: "Admin",
      description: "Terms and conditions for using our services",
      seo: {
        title: "Terms of Service | Legal Information",
        description: "Read our terms and conditions for using our website and services.",
        keywords: ["terms", "conditions", "legal", "service"]
      },
      createdAt: "2023-01-18T16:00:00Z",
      updatedAt: "2023-05-01T09:30:00Z",
      publishedAt: "2023-01-20T10:25:00Z"
    },
    {
      id: "content10",
      title: "Main Navigation",
      slug: "main-nav",
      type: "navigation",
      status: "published",
      author: "Admin",
      description: "Primary website navigation menu",
      createdAt: "2023-01-19T10:00:00Z",
      updatedAt: "2023-06-15T14:45:00Z",
      publishedAt: "2023-01-20T10:30:00Z"
    },
    {
      id: "content11",
      title: "Footer Navigation",
      slug: "footer-nav",
      type: "navigation",
      status: "published",
      author: "Admin",
      description: "Footer menu links",
      createdAt: "2023-01-19T11:30:00Z",
      updatedAt: "2023-06-15T15:00:00Z",
      publishedAt: "2023-01-20T10:35:00Z"
    },
    {
      id: "content12",
      title: "Products Showcase",
      slug: "/products-showcase",
      type: "page",
      status: "draft",
      author: "Admin",
      description: "Featured products display page",
      seo: {
        title: "Featured Products | Best Sellers and New Arrivals",
        description: "Explore our collection of featured products, best sellers, and new arrivals.",
        keywords: ["products", "featured", "best sellers", "new arrivals"]
      },
      createdAt: "2023-06-19T13:40:00Z",
      updatedAt: "2023-06-21T09:15:00Z"
    },
    {
      id: "content13",
      title: "Black Friday Sale Announcement",
      slug: "/blog/black-friday-sale-announcement",
      type: "blog",
      status: "scheduled",
      author: "Marketing Team",
      description: "Details about our upcoming Black Friday sales event",
      featuredImage: "https://images.pexels.com/photos/5876369/pexels-photo-5876369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      seo: {
        title: "Black Friday Sale Announcement | Huge Discounts Coming Soon",
        description: "Get ready for our biggest sale of the year! Exclusive deals and discounts on Black Friday.",
        keywords: ["Black Friday", "sale", "discount", "promotion", "deals"]
      },
      createdAt: "2023-06-22T11:00:00Z",
      updatedAt: "2023-06-22T14:30:00Z"
    }
  ];
};