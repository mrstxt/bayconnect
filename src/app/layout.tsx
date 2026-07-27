import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollTop } from "@/components/ScrollTop";

export const metadata: Metadata = {
  title: "bayClub — Sayohatingiz uchun eng zo'r hamroh",
  description:
    "bayClub — O'zbekiston bo'ylab gidlar, transferlar, fotograflar va boshqa turizm mutaxassislarini topish uchun premium marketplace.",
  openGraph: {
    title: "bayClub",
    description: "Turizm mutaxassislarini topishning eng oddiy yo'li.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col bg-[#fffaf5] text-[#123f34] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollTop />
      </body>
    </html>
  );
}
