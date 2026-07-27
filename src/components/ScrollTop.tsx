"use client";

import { useEffect, useRef } from "react";
import { ArrowUpIcon } from "./Icon";

export function ScrollTop() {
  const btnRef = useRef<HTMLButtonElement>(null);

  /**
   * Header'dagi kabi: scroll'da setState qilish o'rniga klass almashtiramiz.
   * Bu komponent har bir sahifada bor, shuning uchun har scroll eventida
   * React render'ini ishga tushirish behuda ish edi.
   */
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    let ticking = false;
    let lastState: boolean | null = null;

    const apply = () => {
      ticking = false;
      const visible = window.scrollY > 480;
      if (visible === lastState) return;
      lastState = visible;
      el.classList.toggle("scrolltop-visible", visible);
      // Ko'rinmayotgan tugma klaviatura/skriner uchun ham mavjud bo'lmasin.
      el.setAttribute("aria-hidden", visible ? "false" : "true");
      el.tabIndex = visible ? 0 : -1;
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

  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="Yuqoriga qaytish"
      aria-hidden="true"
      tabIndex={-1}
      onClick={() => {
        // Foydalanuvchi animatsiyani o'chirgan bo'lsa hurmat qilamiz.
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className="scrolltop-btn fixed bottom-6 right-5 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-[#006b55] text-white shadow-lg transition-all duration-300 hover:bg-[#005a48] hover:-translate-y-0.5"
    >
      <ArrowUpIcon size={16} strokeWidth={2} />
    </button>
  );
}
