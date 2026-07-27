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
      className={`group relative block p-5 card-compact card-lift ${
        priority ? "apple-shadow" : ""
      }`}
    >
      <div className="absolute right-4 top-4 z-10">
        <FavoriteButton providerId={p.id} />
      </div>

      <div className="flex items-start gap-4 pr-11">
        <span
          className="shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
          style={{ background: categoryGradient(cover) }}
        >
          <CategoryIcon
            category={p.category}
            subCategory={p.subCategory}
            size={27}
            strokeWidth={1.85}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#eaf4ef] px-2.5 py-1 text-[11px] font-semibold text-[#006b55]">
              {isTransfer && p.subCategory ? transferLabel(p.subCategory) : categoryLabel(p.category)}
            </span>
            {p.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckBadgeIcon size={12} strokeWidth={2} />
                Verified
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 truncate text-[18px] font-semibold tracking-tight text-[#123f34] transition-colors group-hover:text-[#006b55]">
            {p.fullName}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-[#7b827f]">
            <PinIcon size={13} strokeWidth={2} />
            {p.city}, {p.country}
          </p>
        </div>
      </div>

      <p className="mt-4 min-h-[42px] text-[14px] leading-relaxed text-[#5f6864] line-clamp-2">
        {p.bio}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(p.tags ?? []).slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-full bg-[#fff7ef] px-2.5 py-1 text-[11px] font-medium text-[#123f34]/75 ring-1 ring-[#123f34]/5"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-[#123f34]/[0.07] pt-4">
        <div>
          <div className="text-[21px] font-semibold tracking-tight text-[#123f34]">
            {formatPrice(p.pricePerDay)}
          </div>
          <div className="text-[12px] text-[#7b827f]">bir kunga</div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#fff6d7] px-2.5 py-1 text-[13px] font-semibold text-[#9c6a00]">
            <StarIcon size={12} />
            {formatRating(p.rating)}
          </div>
          {isTransfer && p.capacity > 0 ? (
            <div className="mt-1 inline-flex items-center justify-end gap-1 text-[11px] text-[#7b827f]">
              <UsersIcon size={11} /> {p.capacity} o'rin
            </div>
          ) : (
            <div className="mt-1 text-[11px] text-[#7b827f]">{p.reviewsCount} sharh</div>
          )}
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
