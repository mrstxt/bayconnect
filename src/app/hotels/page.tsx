import type { Metadata } from "next";
import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { Pagination } from "@/components/Pagination";
import { CITIES } from "@/lib/brand";
import { EmptyState, SectionHeading } from "@/components/ui";
import { listProviders, PAGE_SIZE } from "@/lib/queries";
import { HotelIcon } from "@/components/Icon";
import {
  buildHref,
  safePage,
  safePrice,
  safeQuery,
  safeSort,
  type ListSearchParams,
} from "@/lib/searchParams";

export const metadata: Metadata = {
  title: "Mehmonxonalar — butik va zamonaviy joylashuv | bayConnect",
  description:
    "Toshkent, Samarqand, Buxoro va Xivadagi butik hamda zamonaviy mehmonxonalarni narx va reyting bo'yicha solishtiring.",
  alternates: { canonical: "/hotels" },
};

export const revalidate = 120;

const SORT_LABELS: Record<string, string> = {
  rating: "Reyting",
  reviews: "Sharhlar",
  price_asc: "Arzon",
  price_desc: "Qimmat",
  newest: "Yangi",
};

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const sp = await searchParams;

  const city = sp.city && CITIES.includes(sp.city as (typeof CITIES)[number]) ? sp.city : undefined;
  const q = safeQuery(sp.q);
  const min = safePrice(sp.min);
  const max = safePrice(sp.max);
  const sort = safeSort(sp.sort);
  const page = safePage(sp.page);

  const { items, total, totalPages } = await listProviders({
    category: "hotel",
    city,
    q,
    min,
    max,
    sort,
    page,
  });

  const clean = { city, q, min, max, sort: sp.sort, page: String(page) };
  const rangeFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeTo = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionHeading
        eyebrow="Joylashuv"
        title="Mehmonxonalar"
        subtitle="Butik mehmonxonalardan zamonaviy 4* mehmonxonalargacha — sizga qulay joyni tanlang."
      />

      <div className="surface-apple mt-8 grid gap-3 p-4 sm:grid-cols-3">
        <PanelStat value={String(total)} label="Mehmonxona" />
        <PanelStat value={city || "Hamma"} label="Shahar" />
        <PanelStat value={SORT_LABELS[sort] ?? "Reyting"} label="Saralash" />
      </div>

      <form className="filter-panel mt-8 p-4 md:p-5">
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <input
              name="q"
              defaultValue={q ?? ""}
              maxLength={80}
              placeholder="Mehmonxona nomi yoki tavsif"
              aria-label="Qidiruv"
              className="input-apple"
            />
          </div>
          <div className="md:col-span-2">
            <select name="city" defaultValue={city ?? ""} aria-label="Shahar" className="input-apple">
              <option value="">Barcha shaharlar</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <input
              name="min"
              type="number"
              min="0"
              inputMode="numeric"
              defaultValue={min ?? ""}
              placeholder="Min $/kun"
              aria-label="Eng past narx"
              className="input-apple"
            />
          </div>
          <div className="md:col-span-2">
            <input
              name="max"
              type="number"
              min="0"
              inputMode="numeric"
              defaultValue={max ?? ""}
              placeholder="Max $/kun"
              aria-label="Eng yuqori narx"
              className="input-apple"
            />
          </div>
          <div className="md:col-span-2">
            <select name="sort" defaultValue={sort} aria-label="Saralash" className="input-apple">
              <option value="rating">Yuqori reyting</option>
              <option value="reviews">Ko'p sharh</option>
              <option value="price_asc">Arzonroq</option>
              <option value="price_desc">Qimmatroq</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#86868b]">
            {total > 0 ? `${rangeFrom}–${rangeTo} / ${total} ta mehmonxona` : "Natija yo'q"}
          </p>
          <div className="flex gap-2">
            <Link
              href="/hotels"
              className="chip-apple px-4 py-2.5 text-[13px] font-semibold text-[#123f34] hover:bg-[#eaf4ef] transition"
            >
              Tozalash
            </Link>
            <button type="submit" className="btn-primary !py-2.5 !px-5 text-[13px] !shadow-none">
              Filtrlash
            </button>
          </div>
        </div>
      </form>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<HotelIcon size={28} />}
            title="Mehmonxona topilmadi"
            description="Boshqa shahar yoki narx diapazonini tanlab ko'ring."
            action={
              <Link href="/hotels" className="btn-secondary !py-2.5 !px-5 text-[13px]">
                Filtrlarni tozalash
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p) => (
              <ProviderCard key={p.id} p={p} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            makeHref={(n) => buildHref("/hotels", clean, { page: n })}
          />
        </>
      )}
    </div>
  );
}

function PanelStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/72 px-4 py-3 ring-1 ring-[#006b55]/10">
      <div className="text-[20px] font-semibold tracking-tight text-[#123f34]">{value}</div>
      <div className="mt-0.5 text-[12px] font-medium text-[#7b827f]">{label}</div>
    </div>
  );
}
