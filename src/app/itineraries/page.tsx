import type { Metadata } from "next";
import Link from "next/link";
import { ITINERARIES, DESTINATIONS } from "@/lib/brand";
import { RouteIcon, CalendarIcon, PinIcon, CheckIcon, SparklesIcon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Uzbekistan Itineraries — Silk Road 10-day, Heritage 14-day | bayConnect",
  description:
    "Ready-made Uzbekistan travel itineraries: Classic Silk Road 10 days, Deep Heritage 14 days, Crafts & Culture 7 days. Book local guides for each route.",
  alternates: { canonical: "/itineraries" },
  openGraph: {
    title: "Uzbekistan Travel Itineraries | bayConnect",
    description: "Curated Silk Road itineraries from 7 to 14 days.",
  },
};

export const revalidate = 3600;

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy:     { label: "Easy",     color: "text-[#0d7377] bg-[#0d7377]/08" },
  moderate: { label: "Moderate", color: "text-[#c8930a] bg-[#c8930a]/08" },
  hard:     { label: "Hard",     color: "text-[#c1440e] bg-[#c1440e]/08" },
};

const GRAD_MAP: Record<string, string> = {
  lapis:  "from-[#2a6bc7] via-[#1b4a8a] to-[#0f2f5c]",
  zar:    "from-[#f0b429] via-[#c8930a] to-[#9a6e07]",
  gilem:  "from-[#e05535] via-[#c1440e] to-[#8b2500]",
  feroza: "from-[#14a9ae] via-[#0d7377] to-[#095559]",
};

export default function ItinerariesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="destination-hero-badge mx-auto mb-5">
          <RouteIcon size={13} strokeWidth={2} />
          Itineraries
        </div>
        <h1 className="text-[36px] md:text-[54px] font-black tracking-[-0.02em] leading-[1.04] text-[#1a1a2e]">
          Your perfect{" "}
          <span className="text-gradient-national">Uzbekistan journey</span>
        </h1>
        <p className="mt-5 text-[17px] md:text-[19px] leading-relaxed text-[#6b6b7b] max-w-2xl mx-auto">
          Expertly crafted routes combining the best cities, experiences and cultural
          highlights. From 7 to 14 days — there's an itinerary for every traveler.
        </p>
      </div>

      {/* Marshrut kartalari */}
      <div className="grid md:grid-cols-3 gap-6 mb-14">
        {ITINERARIES.map((iti) => {
          const diff = DIFFICULTY_LABELS[iti.difficulty] ?? DIFFICULTY_LABELS.easy;
          const gradClass = GRAD_MAP[iti.color] ?? GRAD_MAP.lapis;
          const dests = iti.destinations
            .map((k) => DESTINATIONS.find((d) => d.key === k))
            .filter(Boolean);

          return (
            <div key={iti.key} className="service-card group flex flex-col overflow-hidden">
              {/* Cover */}
              <div className={`relative h-40 bg-gradient-to-br ${gradClass} flex flex-col items-center justify-center overflow-hidden`}>
                {/* Naqsh */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "repeating-conic-gradient(from 22.5deg at 50% 50%, white 0deg 45deg, transparent 45deg 90deg)",
                    backgroundSize: "28px 28px",
                  }}
                />
                {/* Kunlar */}
                <div className="relative z-10 text-center">
                  <div className="text-[48px] font-black text-white leading-none">{iti.days}</div>
                  <div className="text-[14px] font-bold text-white/80">days</div>
                </div>
                {/* Qiyinlik */}
                <span className={`absolute top-3 right-3 rounded-lg px-2.5 py-1 text-[10px] font-bold ${diff.color} bg-white/90`}>
                  {diff.label}
                </span>
              </div>

              {/* Mazmun */}
              <div className="flex flex-1 flex-col p-5">
                {/* Sarlavha */}
                <h2 className="text-[20px] font-black tracking-tight text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors leading-tight">
                  {iti.titleEn}
                </h2>
                <p className="text-[13px] text-[#6b6b7b] mt-0.5">{iti.title}</p>

                {/* Yo'nalish */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {dests.map((d, i) => d && (
                    <span key={d.key} className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1a1a2e]">
                      {i > 0 && <span className="text-[#6b6b7b]">→</span>}
                      <span className="text-[14px]">{d.emoji}</span>
                      {d.labelEn}
                    </span>
                  ))}
                </div>

                {/* Tavsif */}
                <p className="mt-3 text-[13px] leading-relaxed text-[#6b6b7b] line-clamp-2">
                  {iti.descriptionEn}
                </p>

                {/* Kimlar uchun */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {iti.bestForEn.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1 rounded-lg bg-[#1b4a8a]/06 px-2 py-0.5 text-[11px] font-semibold text-[#1b4a8a]">
                      <SparklesIcon size={9} strokeWidth={2} />
                      {b}
                    </span>
                  ))}
                </div>

                {/* Narx + CTA */}
                <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-[#6b6b7b]">From</div>
                    <div className="text-[20px] font-black text-[#1a1a2e]">
                      ${iti.priceFrom.toLocaleString()}
                    </div>
                  </div>
                  <Link
                    href={`/experts?category=tour_agent`}
                    className="btn-primary !py-2.5 !px-5 text-[13px]"
                  >
                    Book now
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nima kiradi */}
      <div className="surface-apple-strong girih-pattern p-8 md:p-12 mb-10">
        <div className="relative z-10">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0d7377] mb-3">
            What's typically included
          </div>
          <h2 className="text-[26px] md:text-[34px] font-black tracking-tight text-[#1a1a2e] mb-8">
            Everything you need for the Silk Road
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🕌", title: "UNESCO Site Visits",      desc: "Registan, Itchan Kala, Ark Citadel and more" },
              { icon: "🧑‍🏫", title: "Licensed Local Guide",    desc: "English/Russian speaking certified guide" },
              { icon: "🚗", title: "Private Transfers",       desc: "Comfortable A/C vehicle between cities" },
              { icon: "🏨", title: "Hotel Accommodation",     desc: "3–4 star hotels in central locations" },
              { icon: "🍽️", title: "Culinary Experiences",    desc: "Plov cooking class and bazaar food tours" },
              { icon: "🎨", title: "Craft Workshops",         desc: "Silk weaving or pottery masterclass" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl border border-[#1b4a8a]/08 bg-white/70 p-4">
                <span className="text-[22px] shrink-0">{item.icon}</span>
                <div>
                  <div className="text-[14px] font-bold text-[#1a1a2e]">{item.title}</div>
                  <div className="mt-0.5 text-[12.5px] text-[#6b6b7b]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom marshrut CTA */}
      <div className="rounded-[24px] bg-gradient-to-br from-[#c8930a] via-[#c8930a] to-[#9a6e07] p-8 md:p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-08"
          style={{
            backgroundImage: "repeating-conic-gradient(from 22.5deg at 50% 50%, white 0deg 45deg, transparent 45deg 90deg)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10">
          <div className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#0d0d1a]/60 mb-2">
            Need a custom route?
          </div>
          <h3 className="text-[26px] md:text-[32px] font-black text-[#0d0d1a] mb-3">
            Build your own Uzbekistan trip
          </h3>
          <p className="text-[#0d0d1a]/70 text-[15px] mb-6 max-w-xl mx-auto">
            Our tour operators will design a custom itinerary based on your interests,
            budget and travel dates. Get a personalised quote within 24 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/experts?category=tour_agent" className="btn-secondary !px-8 !py-3.5 text-[14px]">
              Find a Tour Operator
            </Link>
            <Link href="/experts?category=guide" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#0d0d1a]/20 bg-transparent px-8 py-3.5 text-[14px] font-semibold text-[#0d0d1a] transition hover:bg-[#0d0d1a]/08">
              Find a Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
