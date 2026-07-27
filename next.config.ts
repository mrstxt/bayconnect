import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prod build'da React'ning ikki marta render qilishini tekshiruvchi rejim
  // faqat dev'da kerak — bu default, lekin aniq yozib qo'yamiz.
  reactStrictMode: true,

  // Response'larda "X-Powered-By: Next.js" sarlavhasini olib tashlaymiz.
  poweredByHeader: false,

  // Har bir URL uchun bitta kanonik shakl (SEO + keshni ikkilantirmaslik).
  trailingSlash: false,

  // Rasm optimallashtirish: logo PNG → AVIF/WebP ga aylanadi.
  images: {
    formats: ["image/avif", "image/webp"],
    // Logo kichkina — keraksiz katta variantlar generatsiya qilinmasin.
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  experimental: {
    // Ko'p eksportli paketlardan faqat ishlatilgani bundle'ga tushadi.
    optimizePackageImports: ["drizzle-orm"],
  },

  // Statik asset'lar uchun uzoq muddatli kesh + xavfsizlik sarlavhalari.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
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

  // Eski /providers katalog manzilini /experts'ga 308 bilan yo'naltiramiz
  // (redirect() bilan render qilishdan ko'ra ancha tez).
  async redirects() {
    return [
      { source: "/providers", destination: "/experts", permanent: true },
    ];
  },
};

export default nextConfig;
