import Link from "next/link";
import { getFeaturedProviders, getProviderStats } from "@/lib/queries";
import { ProviderCard } from "@/components/ProviderCard";
import {
  EXPERT_CATEGORIES,
  TRANSFER_TYPES,
  DESTINATIONS,
  EXPERIENCES,
  ITINERARIES,
  categoryGradient,
  PARTNER_NAME,
  PARTNER_URL,
} from "@/lib/brand";
import { Section, SectionHeading } from "@/components/ui";
import {
  GuideIcon,
  TranslatorIcon,
  PhotographerIcon,
  TourAgentIcon,
  TransferIcon,
  HotelIcon,
  CarIcon,
  TransferTypeIcon,
  CheckIcon,
  UsersIcon,
  ExternalLinkIcon,
  HandshakeIcon,
  PinIcon,
  SearchIcon,
  SparklesIcon,
  RouteIcon,
  ShieldIcon,
  GlobeIcon,
  CrownIcon,
  SunIcon,
  ClockIcon,
  FireIcon,
} from "@/components/Icon";

export const revalidate = 300;

/* ── Kichik yordamchi komponentlar ─────────────────────────────────────── */

function StatCard({
  Icon,
  value,
  label,
}: {
  Icon: (p: { size?: number; strokeWidth?: number }) => React.JSX.Element;
  value: string;
  label: string;
}) {
  return (
    <div className="stat-card medallion-bg group p-5 text-center">
      <div className="relative z-10 mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1b4a8a]/08 text-[#1b4a8a]">
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="relative z-10 text-[28px] font-black tracking-tight text-[#1a1a2e]">{value}</div>
      <div className="relative z-10 mt-1 text-[12px] font-semibold text-[#6b6b7b]">{label}</div>
    </div>
  );
}

function ServiceCard({
  href,
  Icon,
  title,
  titleUz,
  desc,
  color,
  external = false,
}: {
  href: string;
  Icon: (p: { size?: number; strokeWidth?: number }) => React.JSX.Element;
  title: string;
  titleUz: string;
  desc: string;
  color: string;
  external?: boolean;
}) {
  const gradient = categoryGradient(color);
  const inner = (
    <div className="service-card medallion-bg group relative overflow-hidden p-6 md:p-7">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-12 blur-3xl transition group-hover:opacity-22"
        style={{ background: gradient }}
        aria-hidden="true"
      />
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_10px_28px_rgba(0,0,0,0.14)] ring-1 ring-white/20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
        style={{ background: gradient }}
      >
        <Icon size={26} strokeWidth={1.7} />
      </div>
      <h3 className="relative mt-5 text-[18px] font-black tracking-tight text-[#1a1a2e] transition-colors group-hover:text-[#0d7377]">
        {title}
        <span className="ml-2 text-[14px] font-medium text-[#6b6b7b]">{titleUz}</span>
      </h3>
      <p className="relative mt-2 text-[13.5px] leading-relaxed text-[#6b6b7b] line-clamp-3">{desc}</p>
      <div className="relative mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1b4a8a] transition-all group-hover:gap-2.5">
        Ko'proq
        {external && <ExternalLinkIcon size={12} strokeWidth={2} />}
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default async function HomePage() {
  const [featured, stats] = await Promise.all([
    getFeaturedProviders(6),
    getProviderStats(),
  ]);

  const marqueeCities = [
    "Samarqand", "Buxoro", "Xiva", "Toshkent", "Shahrisabz",
    "Chimyon", "Farg'ona", "Nukus", "Termiz", "Qarshi", "Margilan", "Andijon",
  ];

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          HERO — Registon 3-arch motivi + Uzbek national vibe
          ══════════════════════════════════════════════════════════════════ */}
      <section className="identity-hero medallion-bg relative overflow-hidden">

        {/* Fon naqsh qatlamlari */}
        <div className="hero-lapis-panel" aria-hidden="true" />
        <div className="hero-zar-panel"   aria-hidden="true" />

        {/* Silk road dekoratsiyalar */}
        <div className="silk-road-scene" aria-hidden="true" />
        <div className="silk-road-sun animate-float-slow" aria-hidden="true" />
        <div className="silk-road-mountain silk-road-mountain-back" aria-hidden="true" />
        <div className="silk-road-mountain silk-road-mountain-front" aria-hidden="true" />
        <div className="silk-road-path" aria-hidden="true" />

        {/* Registon portal archlari — CSS */}
        <div className="silk-road-arch silk-road-arch-left"  aria-hidden="true" />
        <div className="silk-road-arch silk-road-arch-right" aria-hidden="true" />

        {/* Aylanuvchi halqa ornamentlar */}
        <div
          className="pointer-events-none absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <div className="identity-arc" />
          <div className="identity-arc-coral" />
        </div>

        {/* ── Registon 3-arch SVG — hero pastki qismi ─────────────── */}
        <div
          className="hero-arch-frame pointer-events-none"
          aria-hidden="true"
        >
          <svg viewBox="0 0 900 380" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full">
            {/* Chap arch */}
            <path
              d="M40 380 L40 210 Q40 110 160 110 Q280 110 280 210 L280 380"
              stroke="rgba(27,74,138,0.55)" strokeWidth="3" fill="rgba(27,74,138,0.04)"
            />
            <path
              d="M70 380 L70 228 Q70 145 160 145 Q250 145 250 228 L250 380"
              stroke="rgba(200,147,10,0.35)" strokeWidth="1.5" fill="none"
            />
            {/* O'rta arch — katta */}
            <path
              d="M310 380 L310 160 Q310 40 450 40 Q590 40 590 160 L590 380"
              stroke="rgba(27,74,138,0.70)" strokeWidth="4" fill="rgba(27,74,138,0.05)"
            />
            <path
              d="M345 380 L345 178 Q345 78 450 78 Q555 78 555 178 L555 380"
              stroke="rgba(200,147,10,0.45)" strokeWidth="2" fill="none"
            />
            {/* O'ng arch */}
            <path
              d="M620 380 L620 210 Q620 110 740 110 Q860 110 860 210 L860 380"
              stroke="rgba(27,74,138,0.55)" strokeWidth="3" fill="rgba(27,74,138,0.04)"
            />
            <path
              d="M650 380 L650 228 Q650 145 740 145 Q830 145 830 228 L830 380"
              stroke="rgba(200,147,10,0.35)" strokeWidth="1.5" fill="none"
            />
            {/* Arch tepasidagi nuqtalar */}
            {[160, 450, 740].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy={i === 1 ? 40 : 110} r="6"
                  fill="rgba(200,147,10,0.70)" />
                <circle cx={cx} cy={i === 1 ? 40 : 110} r="12"
                  stroke="rgba(200,147,10,0.30)" strokeWidth="1.5" fill="none" />
                <circle cx={cx} cy={i === 1 ? 40 : 110} r="20"
                  stroke="rgba(200,147,10,0.14)" strokeWidth="1" fill="none" />
              </g>
            ))}
            {/* Poydevor chizig'i */}
            <line x1="0" y1="378" x2="900" y2="378"
              stroke="rgba(200,147,10,0.30)" strokeWidth="1.5" />
          </svg>
        </div>

        {/* ── Asosiy hero mazmun ────────────────────────────────────── */}
        <div className="relative z-20 mx-auto max-w-6xl px-5 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="mx-auto max-w-4xl text-center">

            {/* Top badge */}
            <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-xl border border-[#1b4a8a]/14 bg-white/82 px-4 py-2 text-[12px] font-bold shadow-[0_8px_28px_rgba(27,74,138,0.09)] backdrop-blur-sm">
              <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-[#e05535]" />
              <span className="text-[#0d7377] font-black">bayConnect 2.0</span>
              <span className="text-[#6b6b7b]">·</span>
              <span className="text-[#1b4a8a]">Ipak Yo'li Platformasi</span>
              <span className="text-[#6b6b7b] hidden sm:inline">·</span>
              <span className="text-[#6b6b7b] hidden sm:inline italic font-normal">Silk Road Platform</span>
            </div>

            {/* Asosiy sarlavha — Playfair Display */}
            <h1
              className="animate-fade-up delay-2 mx-auto mt-8 max-w-4xl leading-[1.02] text-[#1a1a2e]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(36px, 7vw, 76px)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              O'zbekistonga{" "}
              <span
                style={{
                  background: "linear-gradient(120deg, #1b4a8a 0%, #0d7377 45%, #c8930a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                xush kelibsiz
              </span>
            </h1>

            {/* Inglizcha tagline */}
            <p
              className="animate-fade-up delay-2 mx-auto mt-2 text-[#6b6b7b]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(18px, 3.5vw, 30px)",
                fontWeight: 700,
                fontStyle: "italic",
                letterSpacing: "0.01em",
              }}
            >
              Welcome to the Heart of the Silk Road
            </p>

            {/* Tavsif */}
            <p className="animate-fade-up delay-3 mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-[#4a5568] md:text-[18px]">
              Gid, tarjimon, fotograf, transfer va mehmonxonalarni bir platformada toping.
              <span className="mt-1 block text-[14px] text-[#6b6b7b] md:text-[16px]">
                Find verified guides, transfers & hotels across Uzbekistan — transparent pricing, real reviews.
              </span>
            </p>

            {/* CTA tugmalar */}
            <div className="animate-fade-up delay-4 mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/experts"
                className="btn-primary !px-8 !py-4 text-[15px] !rounded-xl"
              >
                Browse Experts
              </Link>
              <Link
                href="/destinations"
                className="btn-secondary !px-7 !py-4 text-[15px] !rounded-xl"
              >
                <GlobeIcon size={16} strokeWidth={2} />
                Destinations
              </Link>
              <a
                href={PARTNER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="baytrip-button !px-7 !py-4 text-[15px] !rounded-xl inline-flex items-center gap-2"
              >
                Tour Packages — {PARTNER_NAME}
                <ExternalLinkIcon size={14} strokeWidth={2} />
              </a>
            </div>

            {/* Qidiruv paneli */}
            <div className="hero-command-panel animate-fade-up delay-5 mx-auto mt-8 max-w-3xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="hero-command-input flex min-w-0 flex-1 items-center gap-3">
                  <SearchIcon size={17} strokeWidth={2} className="shrink-0 text-[#0d7377]" />
                  <span className="truncate text-[14px] font-semibold text-[#1a1a2e]/55">
                    Search city, service or guide name...
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/destinations/samarkand" className="hero-command-chip">
                    🕌 Samarkand
                  </Link>
                  <Link href="/transfer" className="hero-command-chip">
                    <TransferIcon size={13} strokeWidth={2} />
                    Transfer
                  </Link>
                  <Link href="/experiences" className="hero-command-chip">
                    <SparklesIcon size={13} strokeWidth={2} />
                    Experiences
                  </Link>
                </div>
              </div>
            </div>

            {/* Ishonch belgilari */}
            <div className="animate-fade-up delay-5 mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
              {[
                { uz: "Tekshirilgan profillar",  en: "Verified profiles" },
                { uz: "Shaffof narxlar",          en: "Transparent pricing" },
                { uz: "Tez zayavka",              en: "Fast booking" },
              ].map((t) => (
                <span key={t.en} className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1a1a2e]/65">
                  <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#0d7377] text-white shadow-[0_4px_10px_rgba(13,115,119,0.30)]">
                    <CheckIcon size={10} strokeWidth={2.8} />
                  </span>
                  {t.uz}
                  <span className="hidden text-[#6b6b7b] font-normal sm:inline">· {t.en}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Tez kirish kartalari */}
          <div className="relative mt-14 md:mt-16">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { href: "/destinations", Icon: GlobeIcon,     title: "Destinations", titleUz: "Manzillar",   sub: "6 UNESCO cities",    external: false, color: "text-[#1b4a8a] bg-[#1b4a8a]/08" },
                { href: "/experiences",  Icon: SparklesIcon,  title: "Experiences",  titleUz: "Tajribalar",  sub: "Hands-on culture",   external: false, color: "text-[#c8930a] bg-[#c8930a]/08" },
                { href: "/visa-info",    Icon: ShieldIcon,    title: "Visa Info",    titleUz: "Viza",        sub: "E-visa in 3 days",   external: false, color: "text-[#0d7377] bg-[#0d7377]/08" },
                { href: PARTNER_URL,     Icon: TourAgentIcon, title: "Tour Packages",titleUz: "Turlar",      sub: PARTNER_NAME,         external: true,  color: "text-[#1b4a8a] bg-[#1b4a8a]/08" },
              ].map((item, i) => (
                item.external ? (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ animationDelay: `${0.4 + (i + 1) * 0.08}s` }}
                    className="quick-access-card quick-access-card-partner animate-fade-up group p-4"
                  >
                    <span className="absolute right-2.5 top-2.5 rounded-lg bg-[#1b4a8a]/06 p-1 text-[#1b4a8a]">
                      <ExternalLinkIcon size={11} strokeWidth={2} />
                    </span>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                      <item.Icon size={22} />
                    </span>
                    <div className="mt-3 text-[15px] font-black tracking-tight text-[#1a1a2e]">{item.title}</div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#1b4a8a]">{item.titleUz} · {item.sub}</div>
                  </a>
                ) : (
                  <Link
                    key={item.title}
                    href={item.href}
                    style={{ animationDelay: `${0.4 + (i + 1) * 0.08}s` }}
                    className="quick-access-card animate-fade-up group p-4"
                  >
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                      <item.Icon size={22} />
                    </span>
                    <div className="mt-3 text-[15px] font-semibold tracking-tight text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors">{item.title}</div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#6b6b7b]">{item.titleUz} · {item.sub}</div>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Shaharlar marquee */}
        <div className="relative border-y border-[#1b4a8a]/[0.07] bg-white/55 py-3 backdrop-blur-sm">
          <div className="overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-3 pr-3">
              {[...marqueeCities, ...marqueeCities].map((city, i) => (
                <Link
                  key={`${city}-${i}`}
                  href={`/experts?city=${city}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#1b4a8a]/[0.07] bg-white/85 px-4 py-1.5 text-[12.5px] font-semibold text-[#1a1a2e]/65 transition hover:border-[#0d7377]/25 hover:text-[#0d7377]"
                  aria-hidden={i >= marqueeCities.length}
                  tabIndex={i >= marqueeCities.length ? -1 : undefined}
                >
                  <PinIcon size={11} strokeWidth={2} className="text-[#0d7377]" />
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          DESTINATIONS — Chet ellik turistlar uchun
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="defer-paint py-16">
        <div className="section-divider mb-8">
          <div className="section-divider-diamond" />
          <SectionHeading
            eyebrow="Manzillar"
            title="Uzbekistan's finest destinations"
            subtitle="UNESCO heritage cities of the Silk Road — every corner tells 2,500 years of history."
            action={
              <Link href="/destinations" className="link-national hidden md:inline-flex text-[14px]">
                All destinations →
              </Link>
            }
          />
          <div className="section-divider-diamond hidden md:block" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DESTINATIONS.slice(0, 6).map((dest) => {
            const gradCls: Record<string, string> = {
              lapis:  "from-[#2a6bc7] to-[#0f2f5c]",
              zar:    "from-[#f0b429] to-[#9a6e07]",
              gilem:  "from-[#e05535] to-[#8b2500]",
              feroza: "from-[#14a9ae] to-[#095559]",
            };
            return (
              <Link
                key={dest.key}
                href={`/destinations/${dest.key}`}
                className="destination-card-premium group relative flex flex-col overflow-hidden"
              >
                {/* Ornament tepasi */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1b4a8a] via-[#c8930a] to-[#0d7377] opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-t-[28px]" />

                {/* Cover */}
                <div className={`relative h-40 bg-gradient-to-br ${gradCls[dest.color] ?? gradCls.lapis} flex items-center justify-center overflow-hidden`}>
                  {/* Islomiy to'r naqshi */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "repeating-conic-gradient(from 22.5deg at 50% 50%, white 0deg 45deg, transparent 45deg 90deg)",
                      backgroundSize: "22px 22px",
                    }}
                  />
                  {/* Arch siluet — SVG */}
                  <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                    <svg viewBox="0 0 200 80" className="w-full opacity-25" fill="none">
                      <path d="M30 80 L30 44 Q30 18 65 18 Q100 18 100 44 L100 80" stroke="white" strokeWidth="2" fill="none"/>
                      <path d="M100 80 L100 36 Q100 6 135 6 Q170 6 170 36 L170 80" stroke="white" strokeWidth="2.5" fill="none"/>
                    </svg>
                  </div>
                  <span className="text-[56px] drop-shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-110">
                    {dest.emoji}
                  </span>
                  {dest.unescoSite && (
                    <span className="badge-zar absolute top-3 left-3 !bg-white/20 !text-white !border-white/25">
                      🏛 UNESCO
                    </span>
                  )}
                  {dest.distanceFromTashkentKm > 0 && (
                    <span className="absolute top-3 right-3 rounded-lg bg-black/18 px-2 py-0.5 text-[10px] font-bold text-white">
                      {dest.distanceFromTashkentKm} km
                    </span>
                  )}
                </div>

                {/* Mazmun */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-[10px] font-black tracking-[0.12em] uppercase text-[#c8930a] mb-1">
                    {dest.taglineEn}
                  </div>
                  <h3
                    className="text-[20px] tracking-tight text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}
                  >
                    {dest.labelEn}
                    <span className="ml-1.5 text-[14px] font-medium text-[#6b6b7b]" style={{ fontFamily: "Inter, sans-serif" }}>
                      · {dest.label}
                    </span>
                  </h3>
                  <p className="mt-1.5 text-[12.5px] text-[#6b6b7b] line-clamp-2">
                    {dest.descriptionEn}
                  </p>
                  <div className="mt-auto pt-4 flex items-center justify-between text-[11.5px] text-[#6b6b7b]">
                    <span className="flex items-center gap-1">
                      <SunIcon size={12} strokeWidth={2} />
                      {dest.bestMonths.slice(0, 2).join(" – ")}
                      <span className="ml-1">{dest.avgTempC}°C</span>
                    </span>
                    <span className="font-bold text-[#0d7377] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          ABOUT — bayConnect haqida
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="py-16">
        <div className="surface-apple-strong medallion-gold-bg ornament-border p-8 md:p-14">
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="badge-feroza mb-4 w-fit">About bayConnect</div>
              <h2
                className="text-[28px] md:text-[40px] tracking-tight leading-[1.06] text-[#1a1a2e]"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}
              >
                The easiest way to plan your{" "}
                <span className="text-gradient-national">Uzbekistan trip</span>
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[#4a5568]">
                bayConnect is Uzbekistan's trusted marketplace — verified guides,
                photographers, translators, transfers and hotels, all in one place.
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6b6b7b]">
                bayConnect — bu O'zbekiston va Markaziy Osiyoning turizm mutaxassislarini
                bir platformada birlashtirgan marketplace.
              </p>
              <div className="mt-7 grid sm:grid-cols-2 gap-3">
                {[
                  { en: "Verified & trusted profiles",       uz: "Tekshirilgan profillar" },
                  { en: "Transparent pricing, no hidden fees",uz: "Shaffof narxlar" },
                  { en: "Real client reviews & ratings",     uz: "Haqiqiy sharhlar" },
                  { en: "Direct contact — no middlemen",     uz: "Vositachisiz aloqa" },
                ].map((t) => (
                  <div key={t.en} className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 shrink-0 rounded-xl bg-feroza-gradient flex items-center justify-center shadow-[0_5px_14px_rgba(13,115,119,0.28)] text-white">
                      <CheckIcon size={12} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1a1a2e]">{t.en}</p>
                      <p className="text-[11px] text-[#6b6b7b]">{t.uz}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard Icon={UsersIcon}    value={`${stats.total}+`}   label="Experts / Mutaxassislar" />
              <StatCard Icon={CheckIcon}    value={`${stats.verified}`} label="Verified / Tasdiqlangan" />
              <StatCard Icon={GuideIcon}    value={`${stats.guides}`}   label="Guides / Gidlar" />
              <StatCard Icon={HotelIcon}    value={`${stats.hotels}`}   label="Hotels / Mehmonxonalar" />
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          EXPERIENCES
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="defer-paint py-16">
        <SectionHeading
          eyebrow="Tajribalar"
          title="Unique local experiences"
          subtitle="Silk weaving, plov cooking, pottery, horse riding — live the culture, don't just see it."
          action={
            <Link href="/experiences" className="link-national hidden md:inline-flex text-[14px]">
              All experiences →
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {EXPERIENCES.slice(0, 4).map((exp) => {
            const gradMap: Record<string, string> = {
              gilem: "linear-gradient(145deg,#e05535,#c1440e)",
              zar:   "linear-gradient(145deg,#f0b429,#c8930a)",
              lapis: "linear-gradient(145deg,#2a6bc7,#1b4a8a)",
              feroza:"linear-gradient(145deg,#14a9ae,#0d7377)",
              orange:"linear-gradient(145deg,#e05535,#c1440e)",
            };
            return (
              <Link
                key={exp.key}
                href="/experiences"
                className="experience-card-premium group p-5 text-center"
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-[0_10px_28px_rgba(0,0,0,0.14)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ background: gradMap[exp.color] ?? gradMap.lapis }}
                >
                  <span className="text-[28px]">{exp.emoji}</span>
                </div>
                <div
                  className="mt-4 text-[15px] font-black tracking-tight text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {exp.titleEn}
                </div>
                <div className="mt-0.5 text-[12px] text-[#6b6b7b]">{exp.title}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b6b7b]">
                  <ClockIcon size={11} strokeWidth={2} />
                  {exp.durationEn}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 text-center md:hidden">
          <Link href="/experiences" className="btn-ghost !px-6 !py-2.5 text-[13px] !rounded-xl">
            All Experiences →
          </Link>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          SERVICES
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="defer-paint py-16">
        <SectionHeading
          eyebrow="Xizmatlar"
          title="Everything for your Uzbekistan journey"
          subtitle="One platform, all services — guides, transfers, hotels and more."
        />
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ServiceCard href="/experts?category=guide"        Icon={GuideIcon}       title="Local Guides"      titleUz="Gidlar"       desc="Registan, Itchan Kala, mountain trails — certified guides for every destination." color="lapis" />
          <ServiceCard href="/experts?category=translator"   Icon={TranslatorIcon}  title="Interpreters"      titleUz="Tarjimonlar"  desc="Simultaneous, consecutive and tour interpretation in 10+ languages." color="dark" />
          <ServiceCard href="/experts?category=photographer" Icon={PhotographerIcon} title="Photographers"    titleUz="Fotograflar"  desc="Travel photography, portraits and drone footage across Uzbekistan." color="gilem" />
          <ServiceCard href="/transfer"                      Icon={TransferIcon}    title="Transfers"         titleUz="Transfer"     desc="Sedan to bus — comfortable transfers for any group size and route." color="feroza" />
          <ServiceCard href="/hotels"                        Icon={HotelIcon}       title="Hotels"            titleUz="Mehmonxonalar" desc="Boutique guesthouses to modern 4-star hotels in prime locations." color="zar" />
          <ServiceCard href={PARTNER_URL} external           Icon={TourAgentIcon}   title="Tour Packages"     titleUz="Tur paketlar" desc={`Ready-made Silk Road itineraries on ${PARTNER_NAME} — our official partner platform.`} color="lapis" />
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          EXPERT CATEGORIES
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="defer-paint py-16">
        <SectionHeading
          eyebrow="Mutaxassislar"
          title="Find your perfect travel companion"
          subtitle="Guides, interpreters, photographers and tour operators."
          action={
            <Link href="/experts" className="link-national hidden md:inline-flex text-[14px]">
              All experts →
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {EXPERT_CATEGORIES.map((c) => {
            const IconMap: Record<string, (p:{size?:number;strokeWidth?:number})=>React.JSX.Element> = {
              guide: GuideIcon, translator: TranslatorIcon, photographer: PhotographerIcon,
              tour_agent: TourAgentIcon, tourism_service: HandshakeIcon,
            };
            const Icon = IconMap[c.key];
            return (
              <Link
                key={c.key}
                href={`/experts?category=${c.key}`}
                className="category-card group relative overflow-hidden p-5 md:p-6"
              >
                {/* Ornament tepasi hover'da */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-t-[24px]"
                  style={{ background: categoryGradient(c.color) }} />
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-14 blur-2xl transition group-hover:opacity-28"
                  style={{ background: categoryGradient(c.color) }}
                  aria-hidden="true"
                />
                <div
                  className="relative h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-[0_8px_22px_rgba(0,0,0,0.10)] transition-transform duration-300 group-hover:scale-105"
                  style={{ background: categoryGradient(c.color) }}
                >
                  {Icon && <Icon size={24} strokeWidth={1.8} />}
                </div>
                <div className="relative mt-4">
                  <div
                    className="text-[16px] font-black tracking-tight text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {c.labelEn}
                  </div>
                  <div className="text-[11px] text-[#6b6b7b] font-semibold mt-0.5">{c.label}</div>
                  <div className="mt-2 text-[12px] text-[#6b6b7b] leading-relaxed line-clamp-2">
                    {c.descriptionEn}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          TRANSFER TYPES
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="defer-paint py-16">
        <SectionHeading
          eyebrow="Transfer"
          title="Sedan to bus — we've got you covered."
          subtitle="Choose the right vehicle for your group and route."
          action={
            <Link href="/transfer" className="link-national hidden md:inline-flex text-[14px]">
              All transfers →
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {TRANSFER_TYPES.map((t) => (
            <Link
              key={t.key}
              href={`/transfer?type=${t.key}`}
              className="transport-card group p-5 text-center"
            >
              <span className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1b4a8a]/08 text-[#1b4a8a] transition duration-300 group-hover:scale-110 group-hover:bg-[#1b4a8a]/14">
                <TransferTypeIcon type={t.key} size={28} />
              </span>
              <div
                className="mt-4 text-[15px] font-black tracking-tight text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t.labelEn}
              </div>
              <div className="mt-0.5 text-[11px] text-[#6b6b7b] font-semibold">{t.label}</div>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-[#6b6b7b]">
                <UsersIcon size={11} /> {t.capacity}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          ITINERARIES
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="defer-paint py-16">
        <SectionHeading
          eyebrow="Marshrutlar"
          title="Ready-made Silk Road itineraries"
          subtitle="Expertly crafted routes from 7 to 14 days."
          action={
            <Link href="/itineraries" className="link-national hidden md:inline-flex text-[14px]">
              All itineraries →
            </Link>
          }
        />
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {ITINERARIES.map((iti) => {
            const gradMap: Record<string,string> = {
              lapis:"from-[#2a6bc7] via-[#1b4a8a] to-[#0f2f5c]",
              zar:  "from-[#f0b429] via-[#c8930a] to-[#9a6e07]",
              gilem:"from-[#e05535] via-[#c1440e] to-[#8b2500]",
            };
            return (
              <Link
                key={iti.key}
                href="/itineraries"
                className="identity-card medallion-bg group p-6"
              >
                {/* Kunlar display */}
                <div className={`h-28 rounded-xl bg-gradient-to-br ${gradMap[iti.color]??gradMap.lapis} flex items-center justify-center mb-5 relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage:"repeating-conic-gradient(from 22.5deg at 50% 50%, white 0deg 45deg, transparent 45deg 90deg)", backgroundSize:"22px 22px" }} />
                  <div className="relative text-center text-white">
                    <div className="text-[42px] font-black leading-none" style={{ fontFamily:"'Playfair Display', serif" }}>
                      {iti.days}
                    </div>
                    <div className="text-[13px] font-semibold opacity-80">days</div>
                  </div>
                </div>
                <h3
                  className="text-[18px] font-black tracking-tight text-[#1a1a2e] group-hover:text-[#0d7377] transition-colors"
                  style={{ fontFamily:"'Playfair Display', serif" }}
                >
                  {iti.titleEn}
                </h3>
                <p className="mt-1 text-[12px] text-[#6b6b7b] font-medium">{iti.title}</p>
                <p className="mt-2 text-[13px] text-[#6b6b7b] line-clamp-2">{iti.descriptionEn}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b6b7b]">From</div>
                    <div className="text-[20px] font-black text-[#1a1a2e]">${iti.priceFrom.toLocaleString()}</div>
                  </div>
                  <RouteIcon size={18} strokeWidth={1.8} className="text-[#0d7377] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          PARTNER — bayTrip
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="defer-paint py-16">
        <a
          href={PARTNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="baytrip-feature group relative block overflow-hidden p-8 text-white apple-shadow-lg md:p-14"
        >
          <div className="baytrip-grid" />
          <div className="baytrip-route-line" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#c8930a] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#0d0d1a] mb-3">
                Rasmiy hamkor · bayTrip
              </div>
              <h2
                className="text-[28px] leading-[1.05] tracking-tight md:text-[38px]"
                style={{ fontFamily:"'Playfair Display', serif", fontWeight:800 }}
              >
                Ready tour packages on {PARTNER_NAME}
              </h2>
              <p className="mt-3 max-w-xl text-[15px] text-white/75">
                Silk Road classics, mountain adventures and cultural immersion tours —
                fully packaged on our partner platform {PARTNER_NAME}.
              </p>
              <span className="baytrip-button mt-7 !px-6 !py-3.5 text-[14px] !rounded-xl inline-flex items-center gap-2">
                Browse Tour Packages
                <ExternalLinkIcon size={14} strokeWidth={2} />
              </span>
            </div>
            <div className="baytrip-orbit hidden min-h-[260px] lg:block" aria-hidden="true">
              <span className="baytrip-orbit-dot baytrip-orbit-dot-main"><TransferIcon size={44} strokeWidth={1.75} /></span>
              <span className="baytrip-orbit-dot baytrip-orbit-dot-yellow"><HotelIcon size={30} strokeWidth={1.8} /></span>
              <span className="baytrip-orbit-dot baytrip-orbit-dot-orange"><PhotographerIcon size={24} strokeWidth={2} /></span>
              <span className="baytrip-chip baytrip-chip-one">
                <TransferIcon size={18} strokeWidth={2} />
                <span><b>Flights & Transfers</b><small>door-to-door</small></span>
              </span>
              <span className="baytrip-chip baytrip-chip-two">
                <HotelIcon size={18} strokeWidth={2} />
                <span><b>Hotels</b><small>hand-picked</small></span>
              </span>
              <span className="baytrip-chip baytrip-chip-three">
                <CarIcon size={18} strokeWidth={2} />
                <span><b>Transfers</b><small>airport pickup</small></span>
              </span>
            </div>
          </div>
        </a>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          TOP EXPERTS
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="defer-paint py-16">
        <SectionHeading
          eyebrow="Tanlanganlar"
          title="Top-rated experts"
          subtitle="Highest-rated guides, photographers and tour specialists."
          action={
            <Link href="/experts" className="link-national hidden md:inline-flex text-[14px]">
              Full catalog →
            </Link>
          }
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <ProviderCard key={p.id} p={p} priority />
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════════════════════ */}
      <section
        className="defer-paint mt-16 border-y border-[#1b4a8a]/[0.07] py-20"
        style={{ background:"linear-gradient(170deg, #faf4e8 0%, #f5efe4 100%)" }}
      >
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            align="center"
            eyebrow="Oddiy jarayon"
            title="3 steps. That's all."
            subtitle="No complexity — find, review and book in minutes."
          />
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { step:"01", icon:"🔍", en:"Search",  uz:"Tanlang",    desc:"Filter by category, city or price to find the right service.", descUz:"Kategoriya, shahar yoki narx bo'yicha mos xizmatni toping." },
              { step:"02", icon:"⭐", en:"Review",  uz:"Tekshiring", desc:"View ratings, real reviews, languages and years of experience.", descUz:"Reyting, sharhlar, tillar va tajribani ko'ring." },
              { step:"03", icon:"📲", en:"Book",    uz:"Bron qiling",desc:"Send a request — the expert will contact you promptly.", descUz:"Zayavka yuboring — mutaxassis tez orada bog'lanadi." },
            ].map((item) => (
              <div key={item.step} className="process-card group p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="badge-feroza">{item.step}</div>
                  <span className="text-[26px]">{item.icon}</span>
                </div>
                <h3
                  className="text-[20px] font-black tracking-tight text-[#1a1a2e]"
                  style={{ fontFamily:"'Playfair Display', serif" }}
                >
                  {item.en}
                  <span className="ml-2 text-[15px] font-medium text-[#6b6b7b]" style={{ fontFamily:"Inter, sans-serif" }}>
                    · {item.uz}
                  </span>
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#6b6b7b]">{item.desc}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#6b6b7b]/65">{item.descUz}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          VISA INFO CTA
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="defer-paint py-16">
        <div className="surface-apple medallion-bg ornament-border p-8 md:p-10">
          <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="badge-lapis mb-3 w-fit">
                <ShieldIcon size={12} strokeWidth={2} />
                Visa Information
              </div>
              <h2
                className="text-[24px] md:text-[30px] tracking-tight text-[#1a1a2e]"
                style={{ fontFamily:"'Playfair Display', serif", fontWeight:800 }}
              >
                Visiting Uzbekistan? Check your visa.
              </h2>
              <p className="mt-2 text-[15px] text-[#6b6b7b]">
                60+ countries visit visa-free. 90+ countries get e-visa in 3 days.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label:"✅ Visa-free",       cls:"badge-feroza" },
                  { label:"💻 E-Visa 3 days",   cls:"badge-lapis" },
                  { label:"🛂 Visa on Arrival",  cls:"badge-zar" },
                ].map((b) => (
                  <span key={b.label} className={b.cls}>{b.label}</span>
                ))}
              </div>
            </div>
            <Link href="/visa-info" className="btn-secondary !px-7 !py-3.5 text-[14px] !rounded-xl shrink-0">
              Check Visa Info →
            </Link>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          FINAL CTA — Hamkor bo'lish
          ══════════════════════════════════════════════════════════════════ */}
      <section className="defer-paint mt-16 dark-panel-national relative overflow-hidden py-20">
        <div className="dot-grid-light" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage:"repeating-conic-gradient(from 22.5deg at 50% 50%, white 0deg 45deg, transparent 45deg 90deg)", backgroundSize:"44px 44px" }}
          aria-hidden="true"
        />
        {/* Milliy rang chizig'i */}
        <div className="national-strip absolute top-0 left-0 right-0" />

        <div className="relative mx-auto max-w-6xl px-5 text-center text-white">
          {/* Ornament divider */}
          <div className="ornament-divider mb-6">
            <span className="px-4 text-[11px] font-bold tracking-[0.14em] uppercase text-white/28">
              🕌 bayConnect 2.0 · Ipak Yo'li Platformasi
            </span>
          </div>

          <div className="badge-zar mx-auto mb-5 w-fit !bg-white/08 !text-[#e9c46a] !border-white/12">
            <CrownIcon size={13} strokeWidth={2} />
            Premium platform for tourism professionals
          </div>

          <h2
            className="text-[32px] md:text-[52px] tracking-tight leading-[1.04]"
            style={{ fontFamily:"'Playfair Display', serif", fontWeight:900 }}
          >
            Join bayConnect as an expert
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-[16px] text-white/65">
            List your services, receive bookings and grow your tourism business.
            <span className="block mt-1 text-white/45">Hamkor bo'ling — yangi mijozlar toping.</span>
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="btn-gold !px-9 !py-4 text-[15px] !rounded-xl">
              Become a Partner
            </Link>
            <Link
              href="/experts"
              className="inline-flex items-center gap-2 rounded-xl border border-white/18 bg-white/07 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/12"
            >
              Browse Experts
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-white/42">
            {["Start from 99,000 so'm/month", "BayCommunity access included", "Cancel anytime"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <CheckIcon size={12} strokeWidth={2.5} className="text-[#e9c46a]" />
                {t}
              </span>
            ))}
          </div>

          {/* Milliy rang chizig'i — pastda */}
          <div className="national-strip absolute bottom-0 left-0 right-0" />
        </div>
      </section>
    </>
  );
}
