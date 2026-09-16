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

const ALLOWED_COVERS = new Set(["yellow", "blue", "dark", "orange", "lapis", "zar", "gilem", "feroza"]);

function ProviderCardImpl({
  p,
  priority = false,
}: {
  p: ProviderCardRow;
  priority?: boolean;
}) {
  const isTransfer = p.category === "transfer";
  const cover = ALLOWED_COVERS.has(p.coverColor) ? p.coverColor : "lapis";
  const gradient = categoryGradient(cover);

  return (
    <Link
      href={`/providers/${p.id}`}
      className={`provider-card-national group relative flex h-full flex-col overflow-hidden ${
        priority ? "apple-shadow" : ""
      }`}
    >
      {/* Milliy rang chizig'i — tepada, hover'da ko'rinadi */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[26px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, #1b4a8a, #c8930a, #0d7377)` }}
        aria-hidden="true"
      />

      {/* Sevimlilar tugmasi */}
      <div className="absolute right-4 top-4 z-20">
        <FavoriteButton providerId={p.id} className="!bg-white/90 shadow-sm !rounded-xl" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5">

        {/* Sarlavha qatori: gradient ikonka + kategoriya chipi */}
        <div className="flex items-center gap-3.5 pr-10">
          <span
            className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_10px_28px_rgba(0,0,0,0.14)] ring-1 ring-white/30 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
            style={{ background: gradient }}
          >
            <CategoryIcon
              category={p.category}
              subCategory={p.subCategory}
              size={24}
              strokeWidth={1.8}
            />
            {p.verified ? (
              <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#0d7377] shadow-md ring-1 ring-[#0d7377]/18">
                <CheckBadgeIcon size={12} strokeWidth={2.2} />
              </span>
            ) : null}
          </span>

          {/* Badge-lar */}
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="badge-feroza">
              {isTransfer && p.subCategory ? transferLabel(p.subCategory) : categoryLabel(p.category)}
            </span>
            {p.verified ? (
              <span className="badge-zar">
                ✓ Verified
              </span>
            ) : null}
          </div>
        </div>

        {/* Ism */}
        <h3
          className="mt-3.5 truncate text-[19px] font-black tracking-tight text-[#1a1a2e] transition-colors group-hover:text-[#0d7377]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {p.fullName}
        </h3>

        {/* Shahar + tajriba */}
        <p className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-[#6b6b7b]">
          <PinIcon size={13} strokeWidth={2} className="shrink-0 text-[#0d7377]/70" />
          <span className="truncate">
            {p.city}, {p.country}
            {p.experienceYears > 0 ? ` · ${p.experienceYears} yil` : ""}
          </span>
        </p>

        {/* Bio */}
        <p className="mt-3 min-h-[40px] text-[13.5px] leading-relaxed text-[#5a6066] line-clamp-2">
          {p.bio}
        </p>

        {/* Teglar */}
        <div className="mt-3 flex min-h-[26px] flex-wrap items-center gap-1.5">
          {(p.tags ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-lg bg-[#1b4a8a]/06 px-2.5 py-1 text-[10.5px] font-semibold text-[#1b4a8a]/75 ring-1 ring-[#1b4a8a]/08"
            >
              {t}
            </span>
          ))}
          {(p.tags ?? []).length > 3 ? (
            <span className="text-[10.5px] font-semibold text-[#6b6b7b]">
              +{(p.tags ?? []).length - 3}
            </span>
          ) : null}
        </div>

        {/* Pastki qator: narx + reyting */}
        <div className="provider-card-footer mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div
              className="text-[22px] font-black tracking-tight leading-none text-[#1a1a2e]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {formatPrice(p.pricePerDay)}
            </div>
            <div className="mt-1 text-[11px] font-semibold text-[#6b6b7b]">bir kunga / per day</div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {/* Reyting */}
            <span className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-b from-[#f0b429] to-[#c8930a] px-2.5 py-1 text-[13px] font-black text-white shadow-[0_4px_12px_rgba(200,147,10,0.30)]">
              <StarIcon size={12} />
              {formatRating(p.rating)}
            </span>
            {/* Sharh / sig'im */}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b6b7b]">
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

export const ProviderCard = memo(ProviderCardImpl);
