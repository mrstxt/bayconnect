"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { NAV_ITEMS } from "@/lib/brand";
import { FAVORITES_EVENT } from "@/lib/favorites";
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
}: {
  href: string;
  label: string;
  external: boolean;
  active: boolean;
  variant: "desktop" | "mobile";
}) {
  const desktopCls = `px-3.5 py-2 rounded-full text-[13px] font-medium transition inline-flex items-center gap-1 ${
    active ? "bg-[#eaf4ef] text-[#006b55]" : "text-[#123f34]/75 hover:text-[#006b55] hover:bg-[#123f34]/[0.04]"
  }`;
  const mobileCls = `px-3 py-3 rounded-2xl text-[15px] font-medium transition flex items-center justify-between ${
    active ? "bg-[#eaf4ef] text-[#006b55]" : "text-[#123f34] hover:bg-[#123f34]/[0.04]"
  }`;

  const content = (
    <span className={variant === "mobile" ? "inline-flex items-center gap-1.5" : "inline-flex items-center gap-1"}>
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
    <Link href={href} className={variant === "desktop" ? desktopCls : mobileCls}>
      {content}
    </Link>
  );
}

function FavoritesLink({ variant }: { variant: "desktop" | "mobile" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const raw =
          window.localStorage.getItem("bayconnect:favorites") ??
          window.localStorage.getItem("bayclub:favorites");
        const arr = raw ? JSON.parse(raw) : [];
        setCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setCount(0);
      }
    };
    read();
    window.addEventListener(FAVORITES_EVENT, read);
    window.addEventListener("bayclub:favorites-changed", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, read);
      window.removeEventListener("bayclub:favorites-changed", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  if (variant === "mobile") {
    return (
      <Link
        href="/favorites"
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
      aria-label="Sevimlilar"
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full text-[#123f34] hover:bg-[#123f34]/[0.04] transition"
    >
      <HeartIcon size={17} strokeWidth={1.8} />
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 text-[9px] font-bold bg-[#ff6b4a] text-white rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "glass border-b border-[#123f34]/[0.06] shadow-[0_1px_0_rgba(18,63,52,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 h-[60px] flex items-center justify-between gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
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
            className="ml-1 px-4 py-2 rounded-full text-[13px] font-semibold text-white bg-[#006b55] hover:bg-[#005541] transition"
          >
            Hamkor bo'lish
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <FavoritesLink variant="desktop" />
          <button
            type="button"
            aria-label="Menyu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#123f34]/[0.04] hover:bg-[#123f34]/[0.08] transition"
          >
            <span className="relative block w-4 h-3">
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
              />
            ))}
            <FavoritesLink variant="mobile" />
          </div>
          <div className="mt-3">
            <Link href="/register" className="btn-secondary w-full !py-3 text-sm !bg-[#006b55] hover:!bg-[#005541]">
              Hamkor bo'lish
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
