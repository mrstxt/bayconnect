import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { providers, reviews } from "@/db/schema";
import { desc, eq, ne, and } from "drizzle-orm";
import {
  categoryLabel,
  coverBg,
  formatPrice,
  formatRating,
} from "@/lib/brand";
import { ProviderCard } from "@/components/ProviderCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Badge } from "@/components/ui";
import { CategoryIcon, StarIcon, CheckBadgeIcon, SparkleIcon } from "@/components/Icon";
import { BookingForm } from "./BookingForm";
import { MobileBookBar } from "./MobileBookBar";

export const dynamic = "force-dynamic";

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const providerId = Number(id);
  if (!Number.isFinite(providerId)) notFound();

  const [p] = await db.select().from(providers).where(eq(providers.id, providerId));
  if (!p) notFound();

  const [reviewList, similar] = await Promise.all([
    db
      .select()
      .from(reviews)
      .where(eq(reviews.providerId, providerId))
      .orderBy(desc(reviews.createdAt))
      .limit(20),
    db
      .select()
      .from(providers)
      .where(and(eq(providers.category, p.category), ne(providers.id, p.id)))
      .orderBy(desc(providers.rating))
      .limit(3),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:py-12">
      <div className="flex items-center gap-2 text-[13px] text-[#86868b]">
        <Link href="/providers" className="hover:text-[#1d1d1f] transition">
          Mutaxassislar
        </Link>
        <span>/</span>
        <span className="text-[#1d1d1f]">{p.fullName}</span>
      </div>

      {/* Cover */}
      <div
        className={`relative mt-5 h-56 md:h-72 rounded-[36px] overflow-hidden ${coverBg(p.coverColor)} apple-shadow`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="animate-float flex h-28 w-28 items-center justify-center rounded-[34px] bg-white/90 text-[#123f34] shadow-sm md:h-32 md:w-32">
            <CategoryIcon category={p.category} subCategory={p.subCategory} size={58} strokeWidth={1.55} />
          </span>
        </div>
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="glass rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#1d1d1f]">
            {categoryLabel(p.category)}
          </span>
          {p.verified ? (
            <span className="glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold text-emerald-700">
              <CheckBadgeIcon size={13} strokeWidth={2} /> Verified
            </span>
          ) : null}
        </div>
        <FavoriteButton providerId={p.id} className="absolute top-4 right-4 !w-10 !h-10" />
      </div>

      <div className="mt-8 grid lg:grid-cols-12 gap-8">
        {/* Main */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.05]">
                {p.fullName}
              </h1>
              <p className="mt-2 text-[15px] text-[#86868b]">
                {p.city}, {p.country} · {p.experienceYears} yil tajriba
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#fff6d7] px-3.5 py-2">
              <span className="inline-flex items-center gap-1 text-[#9c6a00] font-semibold">
                <StarIcon size={14} /> {formatRating(p.rating)}
              </span>
              <span className="text-[13px] text-[#7b827f]">{p.reviewsCount} sharh</span>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/[0.06] bg-white p-6 md:p-7">
            <h2 className="text-[13px] font-semibold tracking-[0.12em] uppercase text-[#86868b]">
              Haqida
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed text-[#1d1d1f]/90">{p.bio}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-[28px] border border-black/[0.06] bg-[#f5f5f7] p-6">
              <h3 className="text-[13px] font-semibold tracking-[0.12em] uppercase text-[#86868b]">
                Tillar
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {(p.languages ?? []).map((l) => (
                  <Badge key={l} tone="blue">
                    {l}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-black/[0.06] bg-[#f5f5f7] p-6">
              <h3 className="text-[13px] font-semibold tracking-[0.12em] uppercase text-[#86868b]">
                Yo'nalishlar
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {(p.tags ?? []).map((t) => (
                  <Badge key={t} tone="orange">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/[0.06] bg-white p-6 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[20px] font-semibold tracking-tight">Mijozlar sharhlari</h2>
              <span className="text-[13px] text-[#86868b]">{reviewList.length} ta</span>
            </div>

            {reviewList.length === 0 ? (
              <p className="mt-4 text-[15px] text-[#86868b]">Hozircha sharhlar yo'q.</p>
            ) : (
              <ul className="mt-5 space-y-4">
                {reviewList.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl bg-[#f5f5f7] border border-black/[0.04] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-[15px]">{r.authorName}</span>
                      <span className="inline-flex items-center gap-0.5 text-[#ffc400]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            size={13}
                            filled={i < r.rating}
                            className={i < r.rating ? "text-[#ffc400]" : "text-black/15"}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Booking card */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <div
            id="booking-form"
            className="scroll-mt-24 lg:sticky lg:top-24 rounded-[32px] border border-black/[0.06] bg-white p-6 apple-shadow-lg"
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-[13px] text-[#86868b]">Kunlik narx</div>
                <div className="mt-1 text-[36px] font-semibold tracking-tight leading-none">
                  {formatPrice(p.pricePerDay)}
                </div>
              </div>
              <Badge tone="green">{p.experienceYears}+ yil</Badge>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-[#f5f5f7] p-4">
              <InfoRow label="Telefon" value={p.phone} />
              <InfoRow label="Email" value={p.email} />
              <InfoRow label="Shahar" value={`${p.city}, ${p.country}`} />
            </div>

            <div className="mt-6 border-t border-black/[0.06] pt-6">
              <h3 className="text-[17px] font-semibold tracking-tight">Zayavka yuborish</h3>
              <p className="mt-1 text-[13px] text-[#86868b]">
                Mutaxassis tez orada siz bilan bog'lanadi.
              </p>
              <BookingForm providerId={p.id} />
            </div>
          </div>
        </aside>
      </div>

      <div className="h-20 lg:hidden" />
      <MobileBookBar price={p.pricePerDay} />

      {/* Similar */}
      {similar.length > 0 ? (
        <div className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[12px] font-semibold tracking-[0.14em] uppercase text-[#ff8a00]">
                O'xshashlar
              </div>
              <h2 className="mt-2 text-[28px] font-semibold tracking-tight">
                Shu yo'nalishdagi boshqalar
              </h2>
            </div>
            <Link
              href={`/providers?category=${p.category}`}
              className="text-[14px] font-semibold text-[#0071e3] hover:underline underline-offset-4"
            >
              Barchasi →
            </Link>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similar.map((s) => (
              <ProviderCard key={s.id} p={s} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[13px]">
      <span className="text-[#86868b]">{label}</span>
      <span className="font-semibold text-[#1d1d1f] text-right break-all">{value}</span>
    </div>
  );
}
