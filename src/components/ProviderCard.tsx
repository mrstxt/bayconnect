import Link from "next/link";
import { memo } from "react";
import type { ProviderCardRow } from "@/lib/queries";
import {
  categoryGradient,
  categoryLabel,
  formatPrice,
  formatRating,
  transferLabel,
} from "@/lib/brand";
import { FavoriteButton } from "./FavoriteButton";
import { CategoryIcon, CheckBadgeIcon, StarIcon, PinIcon, UsersIcon } from "./Icon";

const ALLOWED_COVERS = new Set(["yellow", "blue", "dark", "orange"]);

function ProviderCardImpl({
  p,
  priority = false,
}: {
  p: ProviderCardRow;
  priority?: boolean;
}) {
  const isTransfer = p.category === "transfer";
  const cover = ALLOWED_COVERS.has(p.coverColor) ? p.coverColor : "orange";

  return (
    <Link
      href={`/providers/${p.id}`}
      className={`provider-card group relative block overflow-hidden ${
        priority ? "apple-shadow" : ""
      }`}
    >
      <div
        className="provider-card-cover"
        style={{ background: categoryGradient(cover) }}
        aria-hidden="true"
      />
      <div className="absolute right-4 top-4 z-20">
        <FavoriteButton providerId={p.id} className="!bg-white/90 shadow-sm" />
      </div>

      <div className="relative z-10 p-5">
        <div className="flex items-start gap-4 pr-11">
        <span
          className="provider-card-icon shrink-0 flex h-16 w-16 items-center justify-center rounded-[22px] text-white ring-1 ring-white/30 shadow-[0_16px_34px_rgba(12,43,35,0.2)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
          style={{ background: categoryGradient(cover) }}
        >
          <CategoryIcon
            category={p.category}
            subCategory={p.subCategory}
            size={31}
            strokeWidth={1.85}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-white/88 px-2.5 py-1 text-[11px] font-bold text-[#006b55] shadow-sm ring-1 ring-[#006b55]/10">
              {isTransfer && p.subCategory ? transferLabel(p.subCategory) : categoryLabel(p.category)}
            </span>
            {p.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50/95 px-2 py-1 text-[11px] font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-600/10">
                <CheckBadgeIcon size={12} strokeWidth={2} />
                Verified
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 truncate text-[19px] font-black tracking-tight text-[#123f34] transition-colors group-hover:text-[#006b55]">
            {p.fullName}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64736e]">
            <PinIcon size={13} strokeWidth={2} />
            {p.city}, {p.country}
          </p>
        </div>
      </div>

      <p className="mt-5 min-h-[44px] text-[14px] leading-relaxed text-[#526660] line-clamp-2">
        {p.bio}
      </p>

      <div className="mt-4 flex min-h-[28px] flex-wrap gap-1.5">
        {(p.tags ?? []).slice(0, 2).map((t) => (
          <span
            key={t}
            className="rounded-full bg-[#fff7ef] px-2.5 py-1 text-[11px] font-semibold text-[#123f34]/75 ring-1 ring-[#ff6b4a]/10"
          >
            {t}
          </span>
        ))}
        {(p.tags ?? []).length > 2 ? (
          <span className="rounded-full bg-[#eaf4ef] px-2.5 py-1 text-[11px] font-semibold text-[#006b55] ring-1 ring-[#006b55]/10">
            +{(p.tags ?? []).length - 2}
          </span>
        ) : null}
      </div>

      <div className="provider-card-footer mt-5 flex items-end justify-between gap-3">
        <div>
          <div className="text-[22px] font-black tracking-tight text-[#123f34]">
            {formatPrice(p.pricePerDay)}
          </div>
          <div className="text-[12px] font-medium text-[#7b827f]">bir kunga</div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-b from-[#fff3c4] to-[#ffe08a] px-3 py-1.5 text-[13px] font-black text-[#8a5d00] ring-1 ring-[#ffc400]/45">
            <StarIcon size={12} />
            {formatRating(p.rating)}
          </div>
          {isTransfer && p.capacity > 0 ? (
            <div className="inline-flex items-center justify-end gap-1 text-[11px] font-semibold text-[#7b827f]">
              <UsersIcon size={11} /> {p.capacity} o'rin
            </div>
          ) : (
            <div className="text-[11px] font-semibold text-[#7b827f]">{p.reviewsCount} sharh</div>
          )}
        </div>
      </div>
      <div className="provider-card-cta mt-4 flex items-center justify-between text-[13px] font-black text-[#006b55]">
        <span>Ko'rish</span>
        <span className="provider-card-arrow">→</span>
      </div>
      </div>
    </Link>
  );
}

/**
 * memo: ro'yxat sahifalarida 12 ta karta bir xil props bilan qayta render
 * bo'lmasligi uchun (masalan Header holati o'zgarganda).
 */
export const ProviderCard = memo(ProviderCardImpl);
