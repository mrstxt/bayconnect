"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { NAV_ITEMS } from "@/lib/brand";
import { useFavoritesCount } from "@/lib/useFavorites";
import { HeartIcon, ExternalLinkIcon } from "./Icon";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

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
  external: boolean;
  active: boolean;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const desktopCls = `px-3.5 py-2 rounded-full text-[13px] font-medium transition inline-flex items-center gap-1 ${
    active
      ? "bg-white text-[#006b55] shadow-sm ring-1 ring-[#006b55]/10"
      : "text-[#123f34]/75 hover:text-[#006b55] hover:bg-white/60"
  }`;
  const mobileCls = `px-3 py-3 rounded-2xl text-[15px] font-medium transition flex items-center justify-between ${
    active ? "bg-[#eaf4ef] text-[#006b55]" : "text-[#123f34] hover:bg-[#123f34]/[0.04]"
  }`;

  const content = (
    <span
      className={
        variant === "mobile" ? "inline-flex items-center gap-1.5" : "inline-flex items-center gap-1"
      }
    >
      {label}
      {external ? <ExternalLinkIcon size={variant === "mobile" ? 14 : 12} strokeWidth={2} /> : null}
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={variant === "desktop" ? desktopCls : mobileCls}
      >
        {content}
        {variant === "mobile" ? (
          <span className="text-[10px] font-semibold text-[#0717b8] bg-[#eef1ff] px-2 py-0.5 rounded-full">
            Hamkor
          </span>
        ) : null}
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

function FavoritesLink({
  variant,
  onNavigate,
}: {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  // Ilgari bu komponent 3 ta event listener (custom + legacy + storage)
  // ro'yxatdan o'tkazardi va har biri alohida setState chaqirardi.
  const count = useFavoritesCount();

  if (variant === "mobile") {
    return (
      <Link
        href="/favorites"
        onClick={onNavigate}
        className="px-3 py-3 rounded-2xl text-[15px] font-medium text-[#123f34] hover:bg-[#123f34]/[0.04] flex items-center justify-between"
      >
        <span>Sevimlilar</span>
        {count > 0 ? (
          <span className="text-[11px] font-semibold bg-[#ff6b4a] text-white rounded-full px-2 py-0.5">
            {count}
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href="/favorites"
      aria-label={count > 0 ? `Sevimlilar (${count})` : "Sevimlilar"}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full text-[#123f34] hover:bg-[#123f34]/[0.04] transition"
    >
      <HeartIcon size={17} strokeWidth={1.8} />
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 text-[9px] font-bold bg-[#ff6b4a] text-white rounded-full w-4 h-4 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /**
   * Scroll effekti DOM'ga to'g'ridan-to'g'ri klass qo'shish orqali beriladi.
   *
   * Ilgari har bir scroll eventida `setScrolled(...)` chaqirilib, butun Header
   * (va uning barcha bolalari) qayta render bo'lardi — sekin qurilmalarda
   * bu sezilarli "jank" beradi. Endi React render'i umuman ishtirok etmaydi,
   * yangilanish rAF ichida bir marta bajariladi.
   */
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

  // Sahifa almashganda menyuni yopamiz.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Menyu ochiq bo'lsa Escape bilan yopilsin va sahifa scroll bo'lmasin.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <header
      ref={headerRef}
      className={`site-header sticky top-0 z-50 transition-all duration-300 ${
        open ? "header-scrolled" : ""
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 h-[60px] flex items-center justify-between gap-4">
        <Logo priority />

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" aria-label="Asosiy menyu">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              external={item.external}
              active={!item.external && isActive(pathname, item.href)}
              variant="desktop"
            />
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-1">
          <FavoritesLink variant="desktop" />
          <Link
            href="/register"
            className="ml-1 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#0b8267] to-[#006b55] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_10px_24px_rgba(0,107,85,0.3)] transition duration-300 hover:-translate-y-px hover:brightness-110"
          >
            Hamkor bo'lish
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <FavoritesLink variant="desktop" />
          <button
            type="button"
            aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#123f34]/[0.04] hover:bg-[#123f34]/[0.08] transition"
          >
            <span className="relative block w-4 h-3" aria-hidden="true">
              <span
                className={`absolute left-0 right-0 h-[1.5px] bg-[#123f34] transition ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-1.5 h-[1.5px] bg-[#123f34] transition ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-[1.5px] bg-[#123f34] transition ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 pt-1 border-t border-[#123f34]/[0.06] bg-white/95 backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                external={item.external}
                active={!item.external && isActive(pathname, item.href)}
                variant="mobile"
                onNavigate={closeMenu}
              />
            ))}
            <FavoritesLink variant="mobile" onNavigate={closeMenu} />
          </div>
          <div className="mt-3">
            <Link
              href="/register"
              onClick={closeMenu}
              className="btn-primary w-full !py-3 text-sm"
            >
              Hamkor bo'lish
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
