"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "./Icon";

export function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Yuqoriga qaytish"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-5 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-[#1d1d1f] text-white shadow-lg transition-all duration-300 hover:bg-black hover:-translate-y-0.5 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUpIcon size={16} strokeWidth={2} />
    </button>
  );
}
