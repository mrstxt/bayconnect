import Link from "next/link";
import { Logo } from "./Logo";
import {
  EXPERT_CATEGORIES,
  TRANSFER_TYPES,
  PARTNER_NAME,
  PARTNER_URL,
  DESTINATIONS,
  SUPPORTED_LANGS,
} from "@/lib/brand";
import { ExternalLinkIcon, HandshakeIcon, GlobeIcon, ShieldIcon, RouteIcon, MapIcon } from "./Icon";

const YEAR = new Date().getFullYear();

const linkCls = "text-[14px] text-white/58 transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="defer-paint dark-panel relative mt-24 overflow-hidden text-white">
      {/* Milliy ornament: tepada rang chizig'i */}
      <div className="h-[3px] bg-gradient-to-r from-[#c8930a] via-[#1b4a8a] to-[#0d7377]" />

      {/* Islomiy to'r naqshi — fon */}
      <div className="dot-grid-light" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-conic-gradient(from 22.5deg at 50% 50%, white 0deg 45deg, transparent 45deg 90deg)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-16">

        {/* bayTrip hamkor promo */}
        <a
          href={PARTNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="baytrip-footer-card group mb-14 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center md:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-[#e9c46a] ring-1 ring-white/16 sm:flex">
              <HandshakeIcon size={24} strokeWidth={1.6} />
            </span>
            <div>
              <div className="inline-flex rounded-full bg-[#c8930a] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#0d0d1a]">
                bayTrip
              </div>
              <h3 className="mt-1.5 text-[21px] font-semibold tracking-tight md:text-[24px]">
                Tayyor tur paketlarini {PARTNER_NAME} saytida ko'ring
              </h3>
              <p className="mt-1 max-w-lg text-[14px] text-white/55">
                Ipak Yo'li marshrutlari, tog' sarguzashtlari — rasmiy hamkorimiz {PARTNER_NAME}
                platformasida.
              </p>
            </div>
          </div>
          <span className="baytrip-button shrink-0 !px-5 !py-3 text-[14px]">
            {PARTNER_NAME}.vercel.app
            <ExternalLinkIcon size={14} strokeWidth={2} />
          </span>
        </a>

        {/* Asosiy footer grid */}
        <div className="grid gap-10 md:grid-cols-12">

          {/* Brand kolonna */}
          <div className="md:col-span-4">
            <Logo light />
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/55">
              bayConnect — O'zbekiston va Markaziy Osiyo bo'ylab ishonchli
              turizm xizmatlarini topish uchun global marketplace.
            </p>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/40">
              The trusted platform for discovering Uzbekistan's finest guides,
              transfers and cultural experiences.
            </p>

            {/* Til ko'rsatgichi */}
            <div className="mt-5 flex items-center gap-2">
              <GlobeIcon size={13} strokeWidth={2} className="text-white/40" />
              <div className="flex gap-1">
                {SUPPORTED_LANGS.map((l) => (
                  <span
                    key={l.code}
                    className="rounded-lg bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[11px] font-bold text-white/50"
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Brend teglar */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {["Gidlar", "Transfer", "Mehmonxona", "Tajribalar"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11.5px] font-semibold text-white/50"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Mutaxassislar */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/35 mb-4">
              Mutaxassislar
            </h4>
            <ul className="space-y-2.5">
              {EXPERT_CATEGORIES.map((c) => (
                <li key={c.key}>
                  <Link href={`/experts?category=${c.key}`} className={linkCls}>
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/hotels" className={linkCls}>Mehmonxonalar</Link>
              </li>
            </ul>
          </div>

          {/* Transfer */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/35 mb-4">
              Transfer
            </h4>
            <ul className="space-y-2.5">
              {TRANSFER_TYPES.map((t) => (
                <li key={t.key}>
                  <Link href={`/transfer?type=${t.key}`} className={linkCls}>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Manzillar */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/35 mb-4">
              Manzillar
            </h4>
            <ul className="space-y-2.5">
              {DESTINATIONS.slice(0, 5).map((d) => (
                <li key={d.key}>
                  <Link href={`/destinations/${d.key}`} className={`${linkCls} inline-flex items-center gap-1.5`}>
                    <span className="text-[12px]">{d.emoji}</span>
                    {d.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/destinations" className={`${linkCls} font-semibold text-[#e9c46a]/80`}>
                  Barchasi →
                </Link>
              </li>
            </ul>
          </div>

          {/* Platforma */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/35 mb-4">
              Platforma
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href={PARTNER_URL} target="_blank" rel="noopener noreferrer"
                  className="baytrip-footer-link inline-flex items-center gap-1">
                  Turlar ({PARTNER_NAME})
                  <ExternalLinkIcon size={11} strokeWidth={2} />
                </a>
              </li>
              <li><Link href="/experiences" className={linkCls}>Tajribalar</Link></li>
              <li><Link href="/itineraries" className={linkCls}>Marshrutlar</Link></li>
              <li><Link href="/visa-info" className={linkCls}>Viza ma'lumoti</Link></li>
              <li><Link href="/stats" className={linkCls}>Statistika</Link></li>
              <li><Link href="/blog" className={linkCls}>Blog</Link></li>
              <li><Link href="/favorites" className={linkCls}>Sevimlilar</Link></li>
            </ul>

            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/35 mt-6 mb-3">
              Kompaniya
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/register" className={linkCls}>Mutaxassis bo'lish</Link></li>
              <li><Link href="/community" className={linkCls}>BayCommunity</Link></li>
              <li><a href="mailto:hello@bayconnect.uz" className={linkCls}>Aloqa</a></li>
              <li><span className={`${linkCls} cursor-default`}>Maxfiylik</span></li>
            </ul>
          </div>
        </div>

        {/* Milliy ornament divider */}
        <div className="mt-14 ornament-divider">
          <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/25 px-4">
            🕌 O'zbekiston · Ipak Yo'li · Markaziy Osiyo 🕌
          </span>
        </div>

        {/* Alt footer */}
        <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[13px] text-white/38">
            Copyright © {YEAR} bayConnect. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-4 text-[13px] text-white/38">
            <span>O'zbekiston · Central Asia</span>
            <span className="flex items-center gap-1">
              <ShieldIcon size={11} strokeWidth={2} />
              Secure platform
            </span>
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-4 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 text-[12px] font-medium text-white/32">
            <span className="h-1 w-1 rounded-full bg-[#c8930a]" />
            Powered by{" "}
            <span className="font-semibold text-white/60">bayTrip</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
