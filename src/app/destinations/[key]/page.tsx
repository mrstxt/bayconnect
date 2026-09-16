import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DESTINATIONS, EXPERIENCES, categoryGradient } from "@/lib/brand";
import { CheckIcon, PinIcon, SunIcon, UsersIcon, RouteIcon, SparklesIcon, ShieldIcon, GuideIcon, ClockIcon, StarIcon, CrownIcon } from "@/components/Icon";
import { NationalDivider, ArchFrame, Badge } from "@/components/ui";

export const revalidate = 3600;

export async function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ key: d.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const dest = DESTINATIONS.find((d) => d.key === key);
  if (!dest) return { title: "Destination not found | bayConnect" };

  return {
    title: `${dest.labelEn} Travel Guide — ${dest.taglineEn} | bayConnect`,
    description: dest.descriptionEn,
    alternates: { canonical: `/destinations/${key}` },
    openGraph: {
      title: `${dest.labelEn} — ${dest.taglineEn}`,
      description: dest.descriptionEn,
    },
  };
}

const GRAD_MAP: Record<string, string> = {
  lapis:  "from-[#2a6bc7] via-[#1b4a8a] to-[#0f2f5c]",
  zar:    "from-[#f0b429] via-[#c8930a] to-[#9a6e07]",
  gilem:  "from-[#e05535] via-[#c1440e] to-[#8b2500]",
  feroza: "from-[#14a9ae] via-[#0d7377] to-[#095559]",
};

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const dest = DESTINATIONS.find((d) => d.key === key);
  if (!dest) notFound();

  const relatedExperiences = EXPERIENCES.filter(
    (e) => e.city === dest.city ||
           e.city.toLowerCase().includes(dest.city.toLowerCase()) ||
           dest.city.toLowerCase().includes(e.city.toLowerCase())
  ).slice(0, 3);

  const gradClass = GRAD_MAP[dest.color] ?? GRAD_MAP.lapis;
  const otherDests = DESTINATIONS.filter((d) => d.key !== dest.key).slice(0, 3);

  // JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: dest.labelEn,
    description: dest.descriptionEn,
    geo: { "@type": "GeoCoordinates", addressCountry: "UZ" },
    ...(dest.unescoSite ? { isAccessibleForFree: true } : {}),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO COVER ─────────────────────────────────────────────── */}
      <div className={`relative h-[52vh] min-h-[340px] md:h-[60vh] bg-gradient-to-br ${gradClass} overflow-hidden`}>
        {/* Islomiy to'r naqshi */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "repeating-conic-gradient(from 22.5deg at 50% 50%, white 0deg 45deg, transparent 45deg 90deg)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        {/* Arch SVG siluet */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 900 320" fill="none" className="w-full opacity-18">
            <path d="M60 320 L60 160 Q60 70 180 70 Q300 70 300 160 L300 320" stroke="white" strokeWidth="2.5" fill="none"/>
            <path d="M300 320 L300 120 Q300 20 450 20 Q600 20 600 120 L600 320" stroke="white" strokeWidth="4" fill="none"/>
            <path d="M600 320 L600 160 Q600 70 720 70 Q840 70 840 160 L840 320" stroke="white" strokeWidth="2.5" fill="none"/>
            {[180,450,720].map((cx,i)=>(
              <g key={i}>
                <circle cx={cx} cy={i===1?20:70} r="6" fill="rgba(233,196,106,0.8)"/>
                <circle cx={cx} cy={i===1?20:70} r="14" stroke="rgba(233,196,106,0.3)" strokeWidth="1.5" fill="none"/>
              </g>
            ))}
            <line x1="0" y1="318" x2="900" y2="318" stroke="rgba(233,196,106,0.35)" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* Maydon emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-[96px] drop-shadow-2xl block animate-float-slow">
              {dest.emoji}
            </span>
          </div>
        </div>

        {/* UNESCO badge */}
        {dest.unescoSite && (
          <div className="absolute top-5 left-5">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 border border-white/25 px-3 py-1.5 text-[12px] font-black text-white backdrop-blur-sm">
              🏛 UNESCO World Heritage
            </span>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="absolute top-5 right-5">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1 rounded-xl bg-black/20 border border-white/15 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm transition hover:bg-black/30"
          >
            ← All Destinations
          </Link>
        </div>

        {/* Milliy rang chizig'i — pastda */}
        <div className="national-strip absolute bottom-0 left-0 right-0" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">

        {/* ── SARLAVHA ────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <div>
            {/* Tagline */}
            <div className="badge-zar mb-3 w-fit">
              <CrownIcon size={12} strokeWidth={2} />
              {dest.taglineEn} · {dest.tagline}
            </div>

            {/* Shahar nomi */}
            <h1
              className="text-[38px] md:text-[56px] font-black tracking-tight text-[#1a1a2e] leading-[1.04]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {dest.labelEn}
              <span className="block text-[24px] md:text-[32px] font-bold text-[#6b6b7b] mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}>
                {dest.label} · {dest.city}
              </span>
            </h1>

            {/* Meta info strip */}
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="badge-lapis">
                <SunIcon size={12} strokeWidth={2} />
                Best: {dest.bestMonths.join(", ")}
              </span>
              <span className="badge-feroza">
                🌡 {dest.avgTempC}°C avg
              </span>
              {dest.distanceFromTashkentKm > 0 && (
                <span className="badge-lapis">
                  <RouteIcon size={12} strokeWidth={2} />
                  {dest.distanceFromTashkentKm} km from Tashkent
                </span>
              )}
              {dest.unescoSite && (
                <span className="badge-zar">🏛 UNESCO</span>
              )}
            </div>

            {/* Tavsif — inglizcha */}
            <p className="mt-6 text-[17px] leading-relaxed text-[#4a5568]">
              {dest.descriptionEn}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6b6b7b]">
              {dest.description}
            </p>

            <NationalDivider label="Highlights" />

            {/* Diqqatga sazovor joylar */}
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {dest.highlightsEn.map((h, i) => (
                <div key={h} className="flex items-center gap-3 rounded-xl border border-[#1b4a8a]/08 bg-white/70 p-3.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-[12px] font-black"
                    style={{ background: categoryGradient(dest.color) }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="text-[14px] font-bold text-[#1a1a2e]">{h}</div>
                    {dest.highlights[i] && (
                      <div className="text-[12px] text-[#6b6b7b]">{dest.highlights[i]}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── O'NG PANEL — Bron va guides ─────────────────────── */}
          <div className="space-y-4">
            {/* Guide topish CTA */}
            <div className="surface-apple medallion-bg ornament-border p-5">
              <div className="relative z-10">
                <div className="badge-feroza mb-3 w-fit">
                  <GuideIcon size={12} strokeWidth={2} />
                  Find a local guide
                </div>
                <h3
                  className="text-[18px] font-black text-[#1a1a2e] mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Explore {dest.labelEn} with a local expert
                </h3>
                <p className="text-[13px] text-[#6b6b7b] mb-4">
                  Certified local guides who know every corner of {dest.labelEn}.
                  Speak English, Russian and more.
                </p>
                <Link
                  href={`/experts?category=guide&city=${dest.city}`}
                  className="btn-primary w-full !py-3 !rounded-xl text-[14px] text-center block"
                >
                  Find Guides in {dest.labelEn}
                </Link>
                <Link
                  href={`/transfer?city=${dest.city}`}
                  className="btn-ghost w-full !py-2.5 !rounded-xl text-[13px] text-center block mt-2"
                >
                  Book Transfer →
                </Link>
              </div>
            </div>

            {/* Visa info mini */}
            <div className="rounded-xl border border-[#1b4a8a]/10 bg-[#1b4a8a]/04 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldIcon size={15} strokeWidth={2} className="text-[#1b4a8a]" />
                <span className="text-[13px] font-bold text-[#1b4a8a]">Visa Information</span>
              </div>
              <p className="text-[12.5px] text-[#6b6b7b]">
                Most travelers can visit Uzbekistan with e-visa (3 days) or visa-free.
              </p>
              <Link href="/visa-info" className="link-national mt-2 inline-block text-[12px]">
                Check your visa requirements →
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Best season",      value: dest.bestMonths.slice(0,2).join(" – ") },
                { label: "Avg temperature",  value: `${dest.avgTempC}°C` },
                { label: "UNESCO site",      value: dest.unescoSite ? "Yes ✓" : "No" },
                { label: "From Tashkent",    value: dest.distanceFromTashkentKm > 0 ? `${dest.distanceFromTashkentKm} km` : "Capital" },
              ].map((s) => (
                <div key={s.label} className="metric-card p-3 text-center">
                  <div className="text-[16px] font-black text-[#1a1a2e]">{s.value}</div>
                  <div className="mt-0.5 text-[10px] font-semibold text-[#6b6b7b]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── EXPERIENCES ─────────────────────────────────────────── */}
        {relatedExperiences.length > 0 && (
          <div className="mt-16">
            <NationalDivider label="Local Experiences" />
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {relatedExperiences.map((exp) => {
                const eGrad: Record<string,string> = {
                  gilem:"linear-gradient(145deg,#e05535,#c1440e)",
                  zar:"linear-gradient(145deg,#f0b429,#c8930a)",
                  lapis:"linear-gradient(145deg,#2a6bc7,#1b4a8a)",
                  feroza:"linear-gradient(145deg,#14a9ae,#0d7377)",
                  orange:"linear-gradient(145deg,#e05535,#c1440e)",
                };
                return (
                  <Link
                    key={exp.key}
                    href="/experiences"
                    className="experience-card-premium group p-5"
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_8px_22px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-110"
                      style={{ background: eGrad[exp.color] ?? eGrad.lapis }}
                    >
                      <span className="text-[26px]">{exp.emoji}</span>
                    </div>
                    <h3
                      className="mt-3 text-[15px] font-black text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors"
                      style={{ fontFamily:"'Playfair Display', serif" }}
                    >
                      {exp.titleEn}
                    </h3>
                    <p className="mt-1 text-[11px] text-[#6b6b7b]">{exp.title}</p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#6b6b7b]">
                      <ClockIcon size={11} strokeWidth={2} />
                      {exp.durationEn}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PRACTICAL INFO ──────────────────────────────────────── */}
        <div className="mt-16">
          <NationalDivider label="Practical Information" />
          <div className="mt-6 grid md:grid-cols-2 gap-5">
            <div className="surface-apple p-6">
              <h3
                className="text-[18px] font-black text-[#1a1a2e] mb-4"
                style={{ fontFamily:"'Playfair Display', serif" }}
              >
                Getting there
              </h3>
              <ul className="space-y-2.5">
                {[
                  dest.distanceFromTashkentKm === 0
                    ? "Main international hub — Tashkent International Airport"
                    : `${dest.distanceFromTashkentKm} km from Tashkent — train or flight available`,
                  "High-speed train from Tashkent (Afrosiyob) for Samarkand/Bukhara",
                  "Private transfer available 24/7 through bayConnect",
                  "Domestic flights available from Tashkent",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-[#1a1a2e]">
                    <CheckIcon size={13} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#0d7377]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-apple p-6">
              <h3
                className="text-[18px] font-black text-[#1a1a2e] mb-4"
                style={{ fontFamily:"'Playfair Display', serif" }}
              >
                Best time to visit
              </h3>
              <div className="grid grid-cols-2 gap-2">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => {
                    const isBest = (dest.bestMonths as readonly string[]).includes(m);
                    return (
                    <div
                      key={m}
                      className={`rounded-lg px-3 py-2 text-center text-[12px] font-semibold ${
                        isBest
                          ? "bg-[#0d7377]/10 text-[#0d7377] border border-[#0d7377]/20"
                          : "bg-white/50 text-[#6b6b7b] border border-[#1b4a8a]/06"
                      }`}
                    >
                      {m}
                      {isBest && (
                        <span className="ml-1">✓</span>
                      )}
                    </div>
                  )})}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOSHQA MANZILLAR ────────────────────────────────────── */}
        <div className="mt-16">
          <NationalDivider label="Other Destinations" />
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {otherDests.map((d) => {
              const miniGrad = GRAD_MAP[d.color] ?? GRAD_MAP.lapis;
              return (
                <Link
                  key={d.key}
                  href={`/destinations/${d.key}`}
                  className="destination-card group flex items-center gap-3 p-4"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${miniGrad} text-[24px]`}>
                    {d.emoji}
                  </div>
                  <div>
                    <div
                      className="text-[15px] font-black text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors"
                      style={{ fontFamily:"'Playfair Display', serif" }}
                    >
                      {d.labelEn}
                    </div>
                    <div className="text-[11px] text-[#6b6b7b]">{d.taglineEn}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── FINAL CTA ───────────────────────────────────────────── */}
        <div className="mt-14 rounded-[28px] overflow-hidden">
          <ArchFrame className="bg-feroza-gradient p-8 md:p-12">
            <div className="text-center text-white">
              <div className="text-[12px] font-black uppercase tracking-[0.14em] text-white/70 mb-3">
                Ready to visit {dest.labelEn}?
              </div>
              <h2
                className="text-[26px] md:text-[34px] font-black text-white mb-3"
                style={{ fontFamily:"'Playfair Display', serif" }}
              >
                Start planning your trip today
              </h2>
              <p className="text-white/75 text-[15px] mb-6 max-w-xl mx-auto">
                Find local guides, book transfers and discover unique experiences
                in {dest.labelEn} — all on bayConnect.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/experts?category=guide&city=${dest.city}`}
                  className="btn-gold !px-8 !py-3.5 text-[14px] !rounded-xl"
                >
                  Find a Guide
                </Link>
                <Link
                  href="/itineraries"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/22 bg-white/10 px-8 py-3.5 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
                >
                  <RouteIcon size={15} strokeWidth={2} />
                  See Itineraries
                </Link>
              </div>
            </div>
          </ArchFrame>
        </div>
      </div>
    </div>
  );
}
