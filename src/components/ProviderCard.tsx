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
      className={`provider-card group relative flex h-full flex-col overflow-hidden ${
        priority ? "apple-shadow" : ""
      }`}
    >
      <div className="absolute right-4 top-4 z-20">
        <FavoriteButton providerId={p.id} className="!bg-white/90 shadow-sm" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5">
        {/* Sarlavha qatori: gradient ikonka + kategoriya chipi */}
        <div className="flex items-center gap-3.5 pr-10">
          <span
            className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_10px_24px_rgba(12,43,35,0.16)] ring-1 ring-white/40 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
            style={{ background: categoryGradient(cover) }}
          >
            <CategoryIcon
              category={p.category}
              subCategory={p.subCategory}
              size={24}
              strokeWidth={1.8}
            />
            {p.verified ? (
              <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#006b55] shadow-md ring-1 ring-[#006b55]/15">
                <CheckBadgeIcon size={12} strokeWidth={2.2} />
              </span>
            ) : null}
          </span>

          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#eaf4ef] px-2.5 py-1 text-[11px] font-bold text-[#006b55] ring-1 ring-[#006b55]/10">
              {isTransfer && p.subCategory ? transferLabel(p.subCategory) : categoryLabel(p.category)}
            </span>
            {p.verified ? (
              <span className="rounded-full bg-[#fff8e3] px-2.5 py-1 text-[11px] font-bold text-[#8a6d00] ring-1 ring-[#ffc400]/30">
                Verified
              </span>
            ) : null}
          </div>
        </div>

        {/* Ism + shahar */}
        <h3 className="mt-3.5 truncate text-[18px] font-black tracking-tight text-[#123f34] transition-colors group-hover:text-[#006b55]">
          {p.fullName}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-[#64736e]">
          <PinIcon size={13} strokeWidth={2} className="shrink-0 text-[#006b55]/70" />
          <span className="truncate">
            {p.city}, {p.country}
            {p.experienceYears > 0 ? ` · ${p.experienceYears} yil tajriba` : ""}
          </span>
        </p>

        {/* Bio */}
        <p className="mt-3 min-h-[42px] text-[13.5px] leading-relaxed text-[#526660] line-clamp-2">
          {p.bio}
        </p>

        {/* Teglar */}
        <div className="mt-3 flex min-h-[26px] flex-wrap items-center gap-1.5">
          {(p.tags ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-[#fff7ef] px-2.5 py-1 text-[10.5px] font-semibold text-[#123f34]/70 ring-1 ring-[#ff6b4a]/10"
            >
              {t}
            </span>
          ))}
          {(p.tags ?? []).length > 3 ? (
            <span className="text-[10.5px] font-semibold text-[#7b827f]">
              +{(p.tags ?? []).length - 3}
            </span>
          ) : null}
        </div>

        {/* Pastki qator: narx + reyting */}
        <div className="provider-card-footer mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[21px] font-black tracking-tight leading-none text-[#123f34]">
              {formatPrice(p.pricePerDay)}
            </div>
            <div className="mt-1 text-[11.5px] font-medium text-[#7b827f]">bir kunga</div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-b from-[#fff3c4] to-[#ffe08a] px-2.5 py-1 text-[13px] font-black text-[#8a5d00] ring-1 ring-[#ffc400]/45">
              <StarIcon size={12} />
              {formatRating(p.rating)}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7b827f]">
              {isTransfer && p.capacity > 0 ? (
                <>
                  <UsersIcon size={11} /> {p.capacity} o'rin
                </>
              ) : (
                <>{p.reviewsCount} sharh</>
              )}
            </span>
          </div>
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
