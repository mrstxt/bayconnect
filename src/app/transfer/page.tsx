import type { Metadata } from "next";
import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { Pagination } from "@/components/Pagination";
import { CITIES, TRANSFER_TYPES, transferLabel } from "@/lib/brand";
import { EmptyState, SectionHeading } from "@/components/ui";
import { listProviders, PAGE_SIZE } from "@/lib/queries";
import { TransferTypeIcon, GlobeGridIcon, CarIcon } from "@/components/Icon";
import {
  buildHref,
  safePage,
  safePrice,
  safeQuery,
  safeSort,
  type ListSearchParams,
} from "@/lib/searchParams";

export const metadata: Metadata = {
  title: "Transfer xizmatlari — aeroport va shaharlararo | bayConnect",
  description:
    "Yengil avtodan avtobusgacha: O'zbekiston bo'ylab aeroport transferi, shaharlararo va guruh transporti xizmatlari.",
  alternates: { canonical: "/transfer" },
};

export const revalidate = 120;

const TRANSFER_KEY_SET = new Set<string>(TRANSFER_TYPES.map((t) => t.key));

export default async function TransferPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const sp = await searchParams;

  const activeType = sp.type && TRANSFER_KEY_SET.has(sp.type) ? sp.type : "";
  const city = sp.city && CITIES.includes(sp.city as (typeof CITIES)[number]) ? sp.city : undefined;
  const q = safeQuery(sp.q);
  const min = safePrice(sp.min);
  const max = safePrice(sp.max);
  const sort = safeSort(sp.sort);
  const page = safePage(sp.page);

  const { items, total, totalPages } = await listProviders({
    category: "transfer",
    subCategory: activeType || undefined,
    city,
    q,
    min,
    max,
    sort,
    page,
  });

  const clean = { type: activeType, city, q, min, max, sort: sp.sort, page: String(page) };
  const rangeFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeTo = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionHeading
        eyebrow="Transport"
        title="Transfer xizmatlari"
        subtitle="Yengil avtodan avtobusgacha — sizga qulay transport turini tanlang."
      />

      <div className="surface-apple mt-8 grid gap-3 p-4 sm:grid-cols-3">
        <PanelStat value={String(total)} label="Transport" />
        <PanelStat value={activeType ? transferLabel(activeType) : "Barchasi"} label="Tur" />
        <PanelStat value={city || "Hamma"} label="Shahar" />
      </div>

      {/* Vehicle type cards */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <TypeCard
          label="Barchasi"
          icon={<GlobeGridIcon size={28} />}
          capacity="Har qanday"
          href={buildHref("/transfer", clean, { type: "", page: undefined })}
          active={!activeType}
        />
        {TRANSFER_TYPES.map((t) => (
          <TypeCard
            key={t.key}
            label={t.label}
            icon={<TransferTypeIcon type={t.key} size={28} />}
            capacity={`${t.capacity} kishi`}
            href={buildHref("/transfer", clean, { type: t.key, page: undefined })}
            active={activeType === t.key}
          />
        ))}
      </div>

      {/* Filters */}
      <form className="filter-panel mt-8 p-4 md:p-5">
        <input type="hidden" name="type" value={activeType} />
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <input
              name="q"
              defaultValue={q ?? ""}
              maxLength={80}
              placeholder="Kompaniya yoki tavsif"
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
              placeholder="Min $"
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
              placeholder="Max $"
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
            {total > 0 ? `${rangeFrom}–${rangeTo} / ${total} ta natija` : "Natija yo'q"}
          </p>
          <div className="flex gap-2">
            <Link
              href="/transfer"
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
            icon={<CarIcon size={28} />}
            title="Transfer topilmadi"
            description="Boshqa transport turini yoki shaharni tanlab ko'ring."
            action={
              <Link href="/transfer" className="btn-secondary !py-2.5 !px-5 text-[13px]">
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
            makeHref={(n) => buildHref("/transfer", clean, { page: n })}
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

function TypeCard({
  label,
  icon,
  capacity,
  href,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  capacity: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-[22px] border p-5 text-center transition apple-shadow ${
        active
          ? "border-[#006b55] bg-[#006b55] text-white"
          : "border-[#006b55]/10 bg-white/85 text-[#123f34] hover:border-[#006b55]/30 hover:-translate-y-0.5"
      }`}
    >
      <span
        className={`mx-auto flex items-center justify-center w-14 h-14 rounded-2xl ${
          active ? "bg-white/10 text-white" : "bg-[#eef1ff] text-[#0717b8]"
        }`}
      >
        {icon}
      </span>
      <div className="mt-3 text-[14px] font-semibold">{label}</div>
      <div className={`mt-0.5 text-[11px] ${active ? "text-white/60" : "text-[#86868b]"}`}>
        {capacity}
      </div>
    </Link>
  );
}
