import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Helps catch bugs in development

  // Enable static HTML export (optional)
  // Uncomment if you're exporting a static site (no SSR)
  // output: 'export',

  images: {
    domains: ["yourcdn.com", "res.cloudinary.com"], // Add trusted image domains
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["*", "localhost"], // Specify allowed origins for server actions
    }, // For App Router with Server Actions
    typedRoutes: true, // Type-safe routes (Next.js 14+)
  },

  typescript: {
    // Ignore TypeScript build errors in production (optional)
    ignoreBuildErrors: false,
  },

  eslint: {
    // Ignore ESLint errors during build (optional)
    ignoreDuringBuilds: false,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
