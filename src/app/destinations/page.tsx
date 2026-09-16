import type { Metadata } from "next";
import Link from "next/link";
import { DESTINATIONS } from "@/lib/brand";
import { Section, SectionHeading } from "@/components/ui";
import { PinIcon, SunIcon, RouteIcon, CrownIcon, CheckIcon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Uzbekistan Destinations — Samarkand, Bukhara, Khiva | bayConnect",
  description:
    "Discover Uzbekistan's UNESCO World Heritage cities. Plan your trip to Samarkand's Registan, Bukhara's ancient medrasas and Khiva's walled Itchan Kala.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "Uzbekistan Destinations | bayConnect",
    description: "UNESCO heritage cities of the Silk Road — plan your journey.",
  },
};

export const revalidate = 3600;

const COLOR_MAP: Record<string, { bg: string; text: string; badge: string; ring: string }> = {
  lapis: {
    bg:    "bg-gradient-to-br from-[#2a6bc7] via-[#1b4a8a] to-[#0f2f5c]",
    text:  "text-white",
    badge: "bg-white/20 text-white",
    ring:  "ring-[#1b4a8a]/20",
  },
  zar: {
    bg:    "bg-gradient-to-br from-[#f0b429] via-[#c8930a] to-[#9a6e07]",
    text:  "text-[#0d0d1a]",
    badge: "bg-black/10 text-[#0d0d1a]",
    ring:  "ring-[#c8930a]/20",
  },
  gilem: {
    bg:    "bg-gradient-to-br from-[#e05535] via-[#c1440e] to-[#8b2500]",
    text:  "text-white",
    badge: "bg-white/20 text-white",
    ring:  "ring-[#c1440e]/20",
  },
  feroza: {
    bg:    "bg-gradient-to-br from-[#14a9ae] via-[#0d7377] to-[#095559]",
    text:  "text-white",
    badge: "bg-white/20 text-white",
    ring:  "ring-[#0d7377]/20",
  },
};

function getColors(color: string) {
  return COLOR_MAP[color] ?? COLOR_MAP.lapis;
}

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">

      {/* Sarlavha */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="destination-hero-badge mx-auto mb-5">
          <PinIcon size={13} strokeWidth={2} />
          Manzillar
        </div>
        <h1 className="text-[36px] md:text-[54px] font-black tracking-[-0.02em] leading-[1.04] text-[#1a1a2e]">
          O'zbekistonning{" "}
          <span className="text-gradient-national">eng go'zal</span>{" "}
          shaharlari
        </h1>
        <p className="mt-5 text-[17px] md:text-[19px] leading-relaxed text-[#6b6b7b] max-w-2xl mx-auto">
          Registon maydonidan Ichan-Qal'a devorlari ichigacha — UNESCO jahon merosi ob'ektlari va
          ming yillik tarixning tirik guvohlari.
        </p>
        {/* Ko'p tilli hint */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[13px] text-[#6b6b7b]">
          {["Discover", "Kashf eting", "Откройте"].map((w) => (
            <span key={w} className="inline-flex items-center gap-1.5 rounded-full border border-[#1b4a8a]/10 bg-white px-3 py-1 font-semibold">
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Milliy ornament divider */}
      <div className="ornament-divider my-10">
        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#c8930a]/60 px-4">
          🕌 UNESCO Ipak Yo'li 🕌
        </span>
      </div>

      {/* Destinatsiyalar grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DESTINATIONS.map((dest) => {
          const colors = getColors(dest.color);
          return (
            <Link
              key={dest.key}
              href={`/destinations/${dest.key}`}
              className={`destination-card group relative flex flex-col overflow-hidden ring-1 ${colors.ring}`}
            >
              {/* Cover gradient */}
              <div className={`relative h-44 ${colors.bg} flex items-center justify-center overflow-hidden`}>
                {/* Milliy to'r naqsh */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "repeating-conic-gradient(from 22.5deg at 50% 50%, white 0deg 45deg, transparent 45deg 90deg)",
                    backgroundSize: "28px 28px",
                  }}
                />
                {/* Katta emoji */}
                <span className="text-[64px] drop-shadow-lg transition-transform duration-500 group-hover:scale-110 relative z-10">
                  {dest.emoji}
                </span>
                {/* UNESCO badge */}
                {dest.unescoSite && (
                  <span className={`absolute top-3 left-3 rounded-lg px-2.5 py-1 text-[10px] font-black tracking-[0.08em] uppercase ${colors.badge}`}>
                    🏛️ UNESCO
                  </span>
                )}
                {/* Masofa */}
                {dest.distanceFromTashkentKm > 0 && (
                  <span className={`absolute top-3 right-3 rounded-lg px-2.5 py-1 text-[10px] font-bold ${colors.badge}`}>
                    {dest.distanceFromTashkentKm} km
                  </span>
                )}
              </div>

              {/* Karta tafsilotlari */}
              <div className="relative z-10 flex flex-1 flex-col p-5">
                {/* Tagline */}
                <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#c8930a] mb-1">
                  {dest.taglineEn}
                </div>

                {/* Shahar nomi */}
                <h2 className="text-[22px] font-black tracking-tight text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors">
                  {dest.labelEn}
                  <span className="ml-2 text-[16px] font-medium text-[#6b6b7b]">· {dest.label}</span>
                </h2>

                {/* Tavsif */}
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#6b6b7b] line-clamp-2">
                  {dest.descriptionEn}
                </p>

                {/* Diqqatga sazovor joylar */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dest.highlightsEn.slice(0, 3).map((h) => (
                    <span key={h} className="inline-flex items-center gap-1 rounded-lg bg-[#1b4a8a]/06 px-2 py-0.5 text-[11px] font-semibold text-[#1b4a8a]">
                      <CheckIcon size={9} strokeWidth={2.5} />
                      {h}
                    </span>
                  ))}
                </div>

                {/* Pastki qator */}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[12px] text-[#6b6b7b]">
                    <span className="inline-flex items-center gap-1">
                      <SunIcon size={12} strokeWidth={2} />
                      {dest.bestMonths.slice(0, 2).join(" – ")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CrownIcon size={12} strokeWidth={2} />
                      {dest.avgTempC}°C
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0d7377] group-hover:gap-2 transition-all">
                    Explore
                    <RouteIcon size={13} strokeWidth={2} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info blok — chet elliklarga */}
      <div className="mt-14 surface-apple-strong girih-pattern p-8 md:p-12">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0d7377] mb-3">
              Why Uzbekistan?
            </div>
            <h2 className="text-[28px] md:text-[38px] font-black tracking-tight text-[#1a1a2e] leading-[1.06]">
              Heart of the{" "}
              <span className="text-gradient-national">Silk Road</span>
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#6b6b7b]">
              Uzbekistan is home to 3 UNESCO World Heritage sites — Samarkand, Bukhara and Khiva.
              Every city tells 2,500+ years of history through its architecture, bazaars and
              living traditions.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { num: "3",    label: "UNESCO sites" },
                { num: "2500+", label: "Years of history" },
                { num: "40+",  label: "Nationalities" },
                { num: "365",  label: "Days sunshine/yr" },
              ].map((s) => (
                <div key={s.label} className="metric-card p-4">
                  <div className="text-[26px] font-black text-gradient-national">{s.num}</div>
                  <div className="mt-0.5 text-[12px] font-semibold text-[#6b6b7b]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { icon: "✈️", title: "Easy to reach", desc: "Direct flights from UAE, Russia, Turkey, China, Germany" },
              { icon: "🛂", title: "Visa-free / E-Visa", desc: "60+ countries visa-free, 90+ countries e-visa in 3 days" },
              { icon: "🌡️", title: "Best season", desc: "April–May & September–October — mild weather, festivals" },
              { icon: "💰", title: "Affordable", desc: "Budget-friendly destination — top quality at low cost" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl border border-[#1b4a8a]/08 bg-white/70 p-4">
                <span className="text-[22px] mt-0.5">{item.icon}</span>
                <div>
                  <div className="text-[14px] font-bold text-[#1a1a2e]">{item.title}</div>
                  <div className="mt-0.5 text-[13px] text-[#6b6b7b]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-[15px] text-[#6b6b7b] mb-4">
          Ready to explore? Find local guides for every destination.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/experts?category=guide" className="btn-primary !px-8 !py-3.5 text-[14px]">
            Find a Guide
          </Link>
          <Link href="/itineraries" className="btn-ghost !px-8 !py-3.5 text-[14px]">
            Browse Itineraries
          </Link>
        </div>
      </div>
    </div>
  );
}
