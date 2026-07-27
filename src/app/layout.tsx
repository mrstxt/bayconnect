import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollTop } from "@/components/ScrollTop";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  // metadataBase bo'lmasa OG rasm va canonical URL'lar nisbiy qoladi
  // va ijtimoiy tarmoqlarda preview ishlamaydi.
  metadataBase: new URL(siteUrl()),
  title: {
    default: "bayConnect — Sayohat xizmatlari bilan bog'lovchi platforma",
    // Ichki sahifalar o'z sarlavhasini beradi, brend avtomatik qo'shiladi.
    template: "%s | bayConnect",
  },
  description:
    "bayConnect — O'zbekiston bo'ylab gidlar, transferlar, fotograflar va boshqa turizm mutaxassislarini topish uchun premium marketplace.",
  applicationName: "bayConnect",
  keywords: [
    "O'zbekiston turizm",
    "gid",
    "tarjimon",
    "transfer",
    "mehmonxona",
    "Samarqand",
    "Buxoro",
    "Xiva",
  ],
  authors: [{ name: "bayConnect" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "bayConnect",
    description: "Turizm mutaxassislarini topishning eng oddiy yo'li.",
    url: "/",
    siteName: "bayConnect",
    locale: "uz_UZ",
    type: "website",
    images: [{ url: "/bayconnect.png", width: 1200, height: 630, alt: "bayConnect" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "bayConnect",
    description: "Turizm mutaxassislarini topishning eng oddiy yo'li.",
    images: ["/bayconnect.png"],
  },
  icons: { icon: "/bayconnect.png", apple: "/bayconnect.png" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#006b55",
  width: "device-width",
  initialScale: 1,
  // Foydalanuvchi zoom qila olishi kerak (a11y) — maximumScale bloklanmaydi.
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col bg-[#fff7ef] text-[#123f34] antialiased">
        <a href="#main" className="skip-link">
          Asosiy kontentga o'tish
        </a>
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
