import type { Metadata } from "next";
import Link from "next/link";
import { EXPERIENCES, DESTINATIONS, categoryGradient } from "@/lib/brand";
import { SectionHeading } from "@/components/ui";
import { ClockIcon, PinIcon, SparklesIcon, FireIcon, CheckIcon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Unique Uzbek Experiences — Silk Weaving, Plov Cooking & More | bayConnect",
  description:
    "Authentic hands-on experiences in Uzbekistan: ikat silk weaving, Uzbek bread baking, pottery in Rishtan, horseback riding and more with local artisans.",
  alternates: { canonical: "/experiences" },
  openGraph: {
    title: "Unique Uzbek Experiences | bayConnect",
    description: "Hands-on cultural experiences with Uzbek artisans and masters.",
  },
};

export const revalidate = 3600;

const CATEGORY_LABELS: Record<string, { uz: string; en: string; color: string }> = {
  craft:    { uz: "Hunarmandchilik", en: "Crafts",        color: "#1b4a8a" },
  culinary: { uz: "Oshpazlik",       en: "Culinary Arts", color: "#c8930a" },
  outdoor:  { uz: "Ochiq havoda",    en: "Outdoor",       color: "#0d7377" },
  art:      { uz: "San'at",          en: "Arts",          color: "#c1440e" },
  cultural: { uz: "Madaniyat",       en: "Cultural",      color: "#1b4a8a" },
  adventure:{ uz: "Sarguzasht",      en: "Adventure",     color: "#0d7377" },
};

const CATEGORY_FILTERS = [
  { key: "", labelEn: "All",         labelUz: "Barchasi" },
  { key: "craft",    labelEn: "Crafts",        labelUz: "Hunarmandchilik" },
  { key: "culinary", labelEn: "Culinary",      labelUz: "Oshpazlik" },
  { key: "outdoor",  labelEn: "Outdoor",       labelUz: "Ochiq havo" },
  { key: "art",      labelEn: "Arts",          labelUz: "San'at" },
];

const GRAD_MAP: Record<string, string> = {
  gilem:  "linear-gradient(145deg,#e05535,#c1440e)",
  zar:    "linear-gradient(145deg,#f0b429,#c8930a)",
  lapis:  "linear-gradient(145deg,#2a6bc7,#1b4a8a)",
  feroza: "linear-gradient(145deg,#14a9ae,#0d7377)",
  orange: "linear-gradient(145deg,#e05535,#c1440e)",
};

export default function ExperiencesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">

      {/* Hero sarlavha */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="destination-hero-badge mx-auto mb-5">
          <SparklesIcon size={13} strokeWidth={2} />
          Experiences
        </div>
        <h1 className="text-[36px] md:text-[54px] font-black tracking-[-0.02em] leading-[1.04] text-[#1a1a2e]">
          Live Uzbekistan,{" "}
          <span className="text-gradient-national">don't just see it</span>
        </h1>
        <p className="mt-5 text-[17px] md:text-[19px] leading-relaxed text-[#6b6b7b] max-w-2xl mx-auto">
          Hands-on cultural experiences with local artisans — weave silk, bake bread,
          throw pottery, ride horses and cook plov. These moments last a lifetime.
        </p>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-8 -mx-1 px-1">
        {CATEGORY_FILTERS.map((cat) => (
          <a
            key={cat.key || "all"}
            href={cat.key ? `/experiences?cat=${cat.key}` : "/experiences"}
            className="shrink-0 chip-apple px-4 py-2 text-[13px] font-semibold text-[#1a1a2e] inline-flex items-center gap-1.5"
          >
            {cat.labelEn}
            {cat.labelUz !== cat.labelEn && (
              <span className="text-[#6b6b7b] font-normal">· {cat.labelUz}</span>
            )}
          </a>
        ))}
      </div>

      {/* Experiences grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {EXPERIENCES.map((exp) => {
          const catInfo  = CATEGORY_LABELS[exp.category] ?? CATEGORY_LABELS.craft;
          const gradient = GRAD_MAP[exp.color] ?? GRAD_MAP.lapis;
          const destInfo = DESTINATIONS.find((d) => d.city === exp.city || d.city.includes(exp.city));

          return (
            <div key={exp.key} className="experience-card group flex flex-col">
              {/* Cover */}
              <div
                className="relative h-36 flex items-center justify-center overflow-hidden rounded-t-[22px]"
                style={{ background: gradient }}
              >
                {/* Naqsh */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "repeating-conic-gradient(from 22.5deg at 50% 50%, white 0deg 45deg, transparent 45deg 90deg)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <span className="text-[52px] drop-shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-110">
                  {exp.emoji}
                </span>
                {/* Kategoriya badge */}
                <span
                  className="absolute top-3 left-3 rounded-lg px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: "rgba(0,0,0,0.22)" }}
                >
                  {catInfo.en}
                </span>
              </div>

              {/* Mazmun */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-[15px] font-black tracking-tight text-[#1a1a2e] leading-tight group-hover:text-[#0d7377] transition-colors">
                  {exp.titleEn}
                  <span className="block text-[12px] font-medium text-[#6b6b7b] mt-0.5">{exp.title}</span>
                </h3>

                <p className="mt-2 text-[12.5px] leading-relaxed text-[#6b6b7b] line-clamp-2">
                  {exp.descriptionEn}
                </p>

                <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b6b7b]">
                      <ClockIcon size={11} strokeWidth={2} />
                      {exp.durationEn}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b6b7b]">
                      <PinIcon size={11} strokeWidth={2} />
                      {exp.city}
                    </span>
                  </div>
                  <Link
                    href={`/experts?category=guide&city=${destInfo?.city ?? exp.city}`}
                    className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-[#0d7377] px-3 py-1.5 text-[11.5px] font-bold text-white shadow-[0_6px_16px_rgba(13,115,119,0.25)] transition hover:-translate-y-px"
                  >
                    Book
                    <FireIcon size={11} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info banner — hunarmandchilik merosi */}
      <div className="mt-14 rounded-[28px] overflow-hidden">
        <div className="bg-gradient-to-br from-[#1b4a8a] via-[#0f2f5c] to-[#0a1d3d] p-8 md:p-12 relative">
          {/* Ornament naqsh */}
          <div className="absolute inset-0 opacity-06"
            style={{
              backgroundImage: "repeating-conic-gradient(from 22.5deg at 50% 50%, rgba(255,255,255,0.5) 0deg 45deg, transparent 45deg 90deg)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#e9c46a] mb-3">
                UNESCO Intangible Heritage
              </div>
              <h2 className="text-[28px] md:text-[36px] font-black tracking-tight text-white leading-[1.06]">
                Ancient crafts, kept alive
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/70">
                Uzbek ikat silk, Rishtan ceramics and Bukhara gold embroidery are UNESCO
                Intangible Cultural Heritage. When you participate, you help preserve
                these traditions for future generations.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Silk Weaving", "Ceramics", "Gold Embroidery", "Plov Cooking"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-xl bg-white/10 border border-white/16 px-3 py-1.5 text-[12px] font-semibold text-white">
                    <CheckIcon size={10} strokeWidth={2.5} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-3">
              {[
                { emoji: "🧵", title: "Margilan",  sub: "Ikat silk capital" },
                { emoji: "🏺", title: "Rishtan",   sub: "Ceramics village" },
                { emoji: "🪡", title: "Bukhara",   sub: "Gold embroidery" },
              ].map((i) => (
                <div key={i.title} className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/12 px-4 py-3">
                  <span className="text-[22px]">{i.emoji}</span>
                  <div>
                    <div className="text-[13px] font-bold text-white">{i.title}</div>
                    <div className="text-[11px] text-white/60">{i.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-[15px] text-[#6b6b7b] mb-4">
          Want to book a specific experience? Find local guides and artisans.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/experts?category=guide" className="btn-primary !px-8 !py-3.5 text-[14px]">
            Find Guides
          </Link>
          <Link href="/destinations" className="btn-ghost !px-8 !py-3.5 text-[14px]">
            Browse Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}
