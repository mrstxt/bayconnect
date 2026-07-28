import Link from "next/link";
import { Logo } from "./Logo";
import { EXPERT_CATEGORIES, TRANSFER_TYPES, PARTNER_NAME, PARTNER_URL } from "@/lib/brand";
import { ExternalLinkIcon, HandshakeIcon } from "./Icon";

// Modul yuklanganda bir marta hisoblanadi (ISR revalidate'da yangilanadi).
const YEAR = new Date().getFullYear();

const linkCls =
  "text-[15px] text-white/60 transition hover:text-white";

export function Footer() {
  return (
    <footer className="defer-paint dark-panel relative mt-24 overflow-hidden text-white">
      <div className="dot-grid-light" />

      <div className="relative mx-auto max-w-6xl px-5 py-16">
        {/* Hamkor promosi */}
        <a
          href={PARTNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="baytrip-footer-card group mb-14 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center md:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-[#f3c85a] ring-1 ring-white/18 sm:flex">
              <HandshakeIcon size={24} strokeWidth={1.6} />
            </span>
            <div>
              <div className="inline-flex rounded-full bg-[#f3c85a] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#17392e]">
                bayTrip
              </div>
              <h3 className="mt-1.5 text-[21px] font-semibold tracking-tight md:text-[25px]">
                Tayyor tur paketlarini {PARTNER_NAME} saytida ko'ring
              </h3>
              <p className="mt-1 max-w-lg text-[14px] text-white/55">
                Ipak Yo'li, tog' sarguzashtlari va boshqa marshrutlar bo'yicha tayyor paketlar —
                rasmiy hamkorimiz {PARTNER_NAME} platformasida.
              </p>
            </div>
          </div>
          <span className="baytrip-button shrink-0 !px-5 !py-3 text-[14px]">
            {PARTNER_NAME}.vercel.app
            <ExternalLinkIcon size={15} strokeWidth={2} />
          </span>
        </a>

        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo light />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/55">
              bayConnect — O'zbekiston va Markaziy Osiyo bo'ylab ishonchli turizm xizmatlarini
              topish uchun marketplace.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {["Gidlar", "Transfer", "Mehmonxona"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[11.5px] font-semibold text-white/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">
              Mutaxassislar
            </h4>
            <ul className="mt-4 space-y-2.5">
              {EXPERT_CATEGORIES.map((c) => (
                <li key={c.key}>
                  <Link href={`/experts?category=${c.key}`} className={linkCls}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">
              Transfer
            </h4>
            <ul className="mt-4 space-y-2.5">
              {TRANSFER_TYPES.map((t) => (
                <li key={t.key}>
                  <Link href={`/transfer?type=${t.key}`} className={linkCls}>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">
              Kashf qiling
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={PARTNER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="baytrip-footer-link inline-flex items-center gap-1"
                >
                  Turlar ({PARTNER_NAME})
                  <ExternalLinkIcon size={12} strokeWidth={2} />
                </a>
              </li>
              <li>
                <Link href="/hotels" className={linkCls}>Mehmonxonalar</Link>
              </li>
              <li>
                <Link href="/stats" className={linkCls}>Statistika</Link>
              </li>
              <li>
                <Link href="/blog" className={linkCls}>Blog</Link>
              </li>
              <li>
                <Link href="/favorites" className={linkCls}>Sevimlilar</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">
              Kompaniya
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/register" className={linkCls}>Mutaxassis bo'lish</Link>
              </li>
              <li>
                <a href="mailto:hello@bayconnect.uz" className={linkCls}>Aloqa</a>
              </li>
              <li>
                <span className="text-[15px] text-white/60">Maxfiylik</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-[13px] text-white/45">
            Copyright © {YEAR} bayConnect. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-[13px] text-white/45">O'zbekiston · Markaziy Osiyo</p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 text-[12px] font-medium text-white/40">
            <span className="h-1 w-1 rounded-full bg-[#ffc400]" />
            Powered by
            <span className="font-semibold text-white/75">bayTrip</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
