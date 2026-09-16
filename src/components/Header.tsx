"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { PARTNER_URL, SUPPORTED_LANGS } from "@/lib/brand";
import { useFavoritesCount } from "@/lib/useFavorites";
import { HeartIcon, ExternalLinkIcon, ChevronDownIcon } from "./Icon";
import type { LangCode } from "@/lib/i18n";
import { getT, SUPPORTED_LANG_CODES } from "@/lib/i18n";

/* --------------------------------------------------------------------------
   Til cookie'ni o'qish / yozish (client-side)
   -------------------------------------------------------------------------- */
function getStoredLang(): LangCode {
  if (typeof document === "undefined") return "uz";
  const match = document.cookie.match(/(?:^|; )bay_lang=([^;]*)/);
  if (match && SUPPORTED_LANG_CODES.includes(match[1] as LangCode)) {
    return match[1] as LangCode;
  }
  return "uz";
}

function setLangCookie(lang: LangCode) {
  document.cookie = `bay_lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

/* --------------------------------------------------------------------------
   Yordamchi funksiyalar
   -------------------------------------------------------------------------- */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/* --------------------------------------------------------------------------
   Nav link komponenti
   -------------------------------------------------------------------------- */
function NavLink({
  href,
  label,
  external,
  active,
  variant,
  onNavigate,
}: {
  href: string;
  label: string;
  external?: boolean;
  active: boolean;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const desktopCls = `px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 inline-flex items-center gap-1 ${
    active
      ? "bg-[#0d7377]/10 text-[#0d7377] shadow-sm ring-1 ring-[#0d7377]/15"
      : "text-[#1a1a2e]/70 hover:text-[#0d7377] hover:bg-[#0d7377]/06"
  }`;
  const mobileCls = `px-3 py-3 rounded-xl text-[15px] font-medium transition-all flex items-center justify-between ${
    active
      ? "bg-[#0d7377]/10 text-[#0d7377]"
      : "text-[#1a1a2e] hover:bg-[#1a1a2e]/04"
  }`;

  const content = (
    <span className={variant === "mobile" ? "inline-flex items-center gap-2" : "inline-flex items-center gap-1"}>
      {label}
      {external ? <ExternalLinkIcon size={variant === "mobile" ? 13 : 11} strokeWidth={2} /> : null}
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={variant === "desktop"
          ? "baytrip-nav-link px-3 py-1.5 rounded-lg text-[13px] font-bold transition inline-flex items-center gap-1"
          : "baytrip-nav-link px-3 py-3 rounded-xl text-[15px] font-bold transition flex items-center justify-between"}
      >
        {content}
        {variant === "mobile" && (
          <span className="rounded-full bg-[#c8930a]/15 px-2 py-0.5 text-[10px] font-black text-[#7a5500]">
            bayTrip
          </span>
        )}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={variant === "desktop" ? desktopCls : mobileCls}
    >
      {content}
    </Link>
  );
}

/* --------------------------------------------------------------------------
   Sevimlilar linki
   -------------------------------------------------------------------------- */
function FavoritesLink({ variant, onNavigate }: { variant: "desktop" | "mobile"; onNavigate?: () => void }) {
  const count = useFavoritesCount();

  if (variant === "mobile") {
    return (
      <Link
        href="/favorites"
        onClick={onNavigate}
        className="px-3 py-3 rounded-xl text-[15px] font-medium text-[#1a1a2e] hover:bg-[#1a1a2e]/04 flex items-center justify-between"
      >
        <span>Sevimlilar</span>
        {count > 0 && (
          <span className="text-[11px] font-semibold bg-[#e05535] text-white rounded-full px-2 py-0.5">
            {count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/favorites"
      aria-label={count > 0 ? `Sevimlilar (${count})` : "Sevimlilar"}
      className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#1a1a2e]/70 hover:bg-[#1a1a2e]/06 transition"
    >
      <HeartIcon size={16} strokeWidth={1.8} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 text-[9px] font-bold bg-[#e05535] text-white rounded-full w-4 h-4 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

/* --------------------------------------------------------------------------
   Til tanlash komponenti
   -------------------------------------------------------------------------- */
function LangSwitcher({ variant }: { variant: "desktop" | "mobile" }) {
  const router = useRouter();
  const [lang, setLang] = useState<LangCode>("uz");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(getStoredLang());
  }, []);

  // Tashqariga bosganda yopamiz
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = useCallback((code: LangCode) => {
    setLangCookie(code);
    setLang(code);
    setOpen(false);
    router.refresh();
  }, [router]);

  const current = SUPPORTED_LANGS.find((l) => l.code === lang) ?? SUPPORTED_LANGS[0];

  if (variant === "mobile") {
    return (
      <div className="px-3 py-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.10em] text-[#6b6b7b] mb-2">Til / Language</div>
        <div className="lang-switcher w-full">
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className={`lang-switcher-btn flex-1 text-center ${lang === l.code ? "active" : ""}`}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#1b4a8a]/10 bg-[#faf4e8]/85 text-[12px] font-bold text-[#1a1a2e]/70 hover:bg-white hover:border-[#1b4a8a]/18 transition"
      >
        <span className="text-[14px]">{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <ChevronDownIcon size={11} strokeWidth={2.5} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 min-w-[130px] rounded-xl border border-[#1b4a8a]/10 bg-white shadow-[0_8px_30px_rgba(27,74,138,0.12)] overflow-hidden z-50"
        >
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={lang === l.code}
              onClick={() => handleSelect(l.code)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-semibold text-left transition ${
                lang === l.code
                  ? "bg-[#0d7377]/08 text-[#0d7377]"
                  : "text-[#1a1a2e] hover:bg-[#1a1a2e]/04"
              }`}
            >
              <span className="text-[16px]">{l.flag}</span>
              <span>{l.label}</span>
              {lang === l.code && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0d7377]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Asosiy nav elementlar — yangi bo'limlar bilan
   -------------------------------------------------------------------------- */
const MAIN_NAV = [
  { href: "/",             label: "Bosh sahifa",   external: false },
  { href: "/destinations", label: "Manzillar",     external: false },
  { href: "/experiences",  label: "Tajribalar",    external: false },
  { href: "/experts",      label: "Mutaxassislar", external: false },
  { href: "/transfer",     label: "Transfer",      external: false },
  { href: "/hotels",       label: "Mehmonxonalar", external: false },
  { href: "/itineraries",  label: "Marshrutlar",   external: false },
  { href: "/visa-info",    label: "Viza",          external: false },
  { href: "/blog",         label: "Blog",          external: false },
] as const;

/* --------------------------------------------------------------------------
   HEADER
   -------------------------------------------------------------------------- */
export function Header() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /* Scroll effekti — React re-render'siz */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let ticking = false;
    let lastState: boolean | null = null;
    const apply = () => {
      ticking = false;
      const scrolled = window.scrollY > 8;
      if (scrolled === lastState) return;
      lastState = scrolled;
      el.classList.toggle("header-scrolled", scrolled);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Sahifa almashganda menyuni yopamiz */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* Escape + scroll lock */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <header
      ref={headerRef}
      className={`site-header sticky top-0 z-50 transition-all duration-300 ${open ? "header-scrolled" : ""}`}
    >
      {/* Milliy ornament chizig'i — tepada */}
      <div className="h-[3px] bg-gradient-to-r from-[#1b4a8a] via-[#c8930a] to-[#0d7377]" />

      {/* Asosiy nav satr */}
      <div className="mx-auto max-w-7xl px-5 h-[58px] flex items-center justify-between gap-3">

        {/* Logo */}
        <Logo priority />

        {/* Desktop navigatsiya — o'rtada */}
        <nav
          className="hidden xl:flex items-center gap-0.5 flex-1 justify-center overflow-x-auto scrollbar-none"
          aria-label="Asosiy menyu"
        >
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              external={item.external}
              active={isActive(pathname, item.href)}
              variant="desktop"
            />
          ))}
          <a
            href={PARTNER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="baytrip-nav-link ml-1 px-3 py-1.5 rounded-lg text-[13px] font-bold transition inline-flex items-center gap-1"
          >
            Turlar
            <ExternalLinkIcon size={11} strokeWidth={2} />
          </a>
        </nav>

        {/* O'ng tomondagi tugmalar */}
        <div className="hidden xl:flex items-center gap-2">
          <LangSwitcher variant="desktop" />
          <FavoritesLink variant="desktop" />
          <Link
            href="/register"
            className="ml-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#109498] to-[#0d7377] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.20)_inset,0_8px_22px_rgba(13,115,119,0.30)] transition hover:-translate-y-px hover:brightness-110"
          >
            Hamkor bo'lish
          </Link>
        </div>

        {/* Mobil o'ng tugmalar */}
        <div className="flex items-center gap-1.5 xl:hidden">
          <LangSwitcher variant="desktop" />
          <FavoritesLink variant="desktop" />
          <button
            type="button"
            aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#1a1a2e]/05 hover:bg-[#1a1a2e]/09 transition"
          >
            <span className="relative block w-4 h-3" aria-hidden="true">
              <span className={`absolute left-0 right-0 h-[1.5px] bg-[#1a1a2e] transition-all duration-200 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 right-0 top-1.5 h-[1.5px] bg-[#1a1a2e] transition-all duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 right-0 h-[1.5px] bg-[#1a1a2e] transition-all duration-200 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobil menyu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className={`xl:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[680px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-5 pt-2 border-t border-[#1b4a8a]/07 bg-[#faf4e8]/96 backdrop-blur-xl">
          {/* Milliy naqsh divider */}
          <div className="ornament-divider mb-3">
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#c8930a]/60">
              bayConnect
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                external={item.external}
                active={isActive(pathname, item.href)}
                variant="mobile"
                onNavigate={closeMenu}
              />
            ))}
            <a
              href={PARTNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="baytrip-nav-link px-3 py-3 rounded-xl text-[15px] font-bold transition flex items-center justify-between"
            >
              <span className="inline-flex items-center gap-2">
                Tur paketlar
                <ExternalLinkIcon size={13} strokeWidth={2} />
              </span>
              <span className="rounded-full bg-[#c8930a]/15 px-2 py-0.5 text-[10px] font-black text-[#7a5500]">
                bayTrip
              </span>
            </a>
            <FavoritesLink variant="mobile" onNavigate={closeMenu} />
          </div>

          {/* Til tanlash — mobil */}
          <LangSwitcher variant="mobile" />

          <div className="mt-3">
            <Link
              href="/register"
              onClick={closeMenu}
              className="btn-primary w-full !py-3 text-[14px] rounded-xl"
            >
              Hamkor bo'lish
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
