import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollTop } from "@/components/ScrollTop";
import { SplashScreen } from "@/components/SplashScreen";
import { siteUrl } from "@/lib/site";

/* Google Fonts — Next.js font optimization (zero layout shift) */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "bayConnect 2.0 — Discover the Silk Road | Uzbekistan Tourism Platform",
    template: "%s | bayConnect",
  },
  description:
    "bayConnect is Uzbekistan's premier tourism marketplace. Find verified guides, translators, photographers, transfers and hotels across the Silk Road cities — Samarkand, Bukhara, Khiva and more.",
  applicationName: "bayConnect",
  keywords: [
    "Uzbekistan tourism",
    "Samarkand guide",
    "Bukhara tour",
    "Khiva travel",
    "Silk Road",
    "Uzbekistan e-visa",
    "gid",
    "tarjimon",
    "transfer",
    "mehmonxona",
    "O'zbekiston turizm",
  ],
  authors: [{ name: "bayConnect" }],
  alternates: { canonical: "/" },
  icons: {
    icon:     "/bayconnect.png",
    shortcut: "/bayconnect.png",
    apple:    "/bayconnect.png",
  },
  openGraph: {
    title:       "bayConnect 2.0 — Discover the Silk Road",
    description: "Uzbekistan's premier tourism marketplace — guides, transfers, hotels and unique local experiences.",
    url:         "/",
    siteName:    "bayConnect",
    locale:      "en_US",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "bayConnect 2.0 — Discover the Silk Road",
    description: "Uzbekistan's premier tourism marketplace.",
  },
  robots: {
    index:      true,
    follow:     true,
    googleBot:  { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0f2f5c",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#fdf8f0] text-[#1a1a2e] antialiased">
        {/* Skip nav — a11y */}
        <a href="#main" className="skip-link">
          Asosiy kontentga o'tish
        </a>

        {/* Welcome Splash — faqat birinchi tashrifda, 3 soniya */}
        <SplashScreen />

        <Header />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />
        <ScrollTop />
      </body>
    </html>
  );
}
