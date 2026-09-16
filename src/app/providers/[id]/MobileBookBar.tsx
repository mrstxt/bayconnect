"use client";

import { formatPrice } from "@/lib/brand";

export function MobileBookBar({ price }: { price: number }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-black/[0.06] px-5 py-3 flex items-center justify-between gap-4">
      <div>
        <div className="text-[11px] text-[#86868b] leading-none">Kunlik narx</div>
        <div className="text-[19px] font-semibold tracking-tight leading-tight">
          {formatPrice(price)}
        </div>
      </div>
      <button
        type="button"
        onClick={() =>
          document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className="btn-primary !py-3 !px-6 text-[14px]"
      >
        Zayavka yuborish
      </button>
    </div>
  );
}
