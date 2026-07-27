import Link from "next/link";
import { Logo } from "./Logo";
import { EXPERT_CATEGORIES, TRANSFER_TYPES, PARTNER_NAME, PARTNER_URL } from "@/lib/brand";
import { ExternalLinkIcon } from "./Icon";

const linkCls = "text-[15px] text-[#123f34] hover:text-[#006b55] transition";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#123f34]/[0.06] bg-[#f7f2ed]">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <a
          href={PARTNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[8px] bg-gradient-to-br from-[#0717b8] via-[#0d2097] to-[#123f34] text-white p-6 md:p-8 mb-14"
        >
          <div>
            <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/55">
              Hamkorimiz
            </div>
            <h3 className="mt-2 text-[22px] md:text-[26px] font-semibold tracking-tight">
              Tayyor tur paketlarini {PARTNER_NAME} saytida ko'ring
            </h3>
            <p className="mt-1.5 text-[14px] text-white/68 max-w-lg">
              Ipak Yo'li, tog' sarguzashtlari va boshqa marshrutlar bo'yicha tayyor paketlar —
              rasmiy hamkorimiz {PARTNER_NAME} platformasida.
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white text-[#123f34] px-5 py-3 text-[14px] font-semibold group-hover:bg-[#ffc400] transition">
            {PARTNER_NAME}.vercel.app
            <ExternalLinkIcon size={15} strokeWidth={2} />
          </span>
        </a>

        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#5f6864]">
              bayConnect — O'zbekiston va Markaziy Osiyo bo'ylab ishonchli turizm xizmatlarini
              topish uchun marketplace.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold tracking-[0.08em] uppercase text-[#7b827f]">
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
            <h4 className="text-xs font-semibold tracking-[0.08em] uppercase text-[#7b827f]">
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
            <h4 className="text-xs font-semibold tracking-[0.08em] uppercase text-[#7b827f]">
              Kashf qiling
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={PARTNER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[15px] text-[#123f34] hover:text-[#0717b8] transition"
                >
                  Turlar ({PARTNER_NAME})
                  <ExternalLinkIcon size={12} strokeWidth={2} />
                </a>
              </li>
              <li>
                <Link href="/hotels" className={linkCls}>Mehmonxonalar</Link>
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
            <h4 className="text-xs font-semibold tracking-[0.08em] uppercase text-[#7b827f]">
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
                <span className="text-[15px] text-[#123f34]">Maxfiylik</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#123f34]/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[13px] text-[#7b827f]">
            Copyright © {new Date().getFullYear()} bayConnect. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-[13px] text-[#7b827f]">O'zbekiston · Markaziy Osiyo</p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 text-[12px] font-medium text-[#7b827f]">
            <span className="w-1 h-1 rounded-full bg-[#006b55]" />
            Powered by
            <span className="font-semibold text-[#123f34]">bayTrip</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
