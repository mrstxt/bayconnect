import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,

  // Rasm optimallashtirish
  images: {
    formats: ["image/avif", "image/webp"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  experimental: {
    optimizePackageImports: ["drizzle-orm"],
  },

  async headers() {
    return [
      {
        // Barcha sahifalar uchun
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // API route'lari uchun qo'shimcha
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "Pragma",        value: "no-cache" },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://bayconnect.uz",
          },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
      {
        // Statik asset'lar — uzoq muddatli kesh
        source: "/bayconnect.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Eski URL'lar → yangilariga
      { source: "/providers",      destination: "/experts",      permanent: true },
      { source: "/destinations/:key/guide", destination: "/experts?category=guide", permanent: false },
    ];
  },
};

export default nextConfig;
