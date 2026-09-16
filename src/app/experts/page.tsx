import type { Metadata } from "next";
import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { Pagination } from "@/components/Pagination";
import { EXPERT_CATEGORIES, CITIES } from "@/lib/brand";
import { EmptyState, SectionHeading } from "@/components/ui";
import { listProviders, PAGE_SIZE } from "@/lib/queries";
import { CategoryIcon, SearchIcon, PlusIcon } from "@/components/Icon";
import {
  buildHref,
  safePage,
  safePrice,
  safeQuery,
  safeSort,
  type ListSearchParams,
} from "@/lib/searchParams";

export const metadata: Metadata = {
  title: "Turizm mutaxassislari — gid, tarjimon, fotograf | bayConnect",
  description:
    "O'zbekiston bo'ylab tekshirilgan gidlar, tarjimonlar, fotograflar va tur agentlarini shahar, narx va reyting bo'yicha toping.",
  alternates: { canonical: "/experts" },
};

/** Ro'yxat 2 daqiqada yangilanadi — har so'rovda DB'ga borish shart emas. */
export const revalidate = 120;

const EXPERT_KEYS = EXPERT_CATEGORIES.map((c) => c.key);
const EXPERT_KEY_SET = new Set<string>(EXPERT_KEYS);

export default async function ExpertsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const sp = await searchParams;

  const activeCategory = sp.category && EXPERT_KEY_SET.has(sp.category) ? sp.category : "";
  const city = sp.city && CITIES.includes(sp.city as (typeof CITIES)[number]) ? sp.city : undefined;
  const q = safeQuery(sp.q);
  const min = safePrice(sp.min);
  const max = safePrice(sp.max);
  const sort = safeSort(sp.sort);
  const page = safePage(sp.page);

  const { items, total, totalPages } = await listProviders({
    category: activeCategory || [...EXPERT_KEYS],
    city,
    q,
    min,
    max,
    sort,
    page,
  });

  // URL yasashda faqat tozalangan qiymatlar ishlatiladi.
  const clean = { category: activeCategory, city, q, min, max, sort: sp.sort, page: String(page) };
  const rangeFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeTo = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionHeading
        eyebrow="Odamlar"
        title="Turizm mutaxassislari"
        subtitle="Gidlar, tarjimonlar, fotograflar va tur agentlari — sayohatingiz uchun eng zo'r hamroh."
        action={
          <Link
            href="/register"
            className="btn-secondary !py-2.5 !px-5 text-[13px] inline-flex items-center gap-1.5"
          >
            <PlusIcon size={15} strokeWidth={2} /> Ro'yxatdan o'tish
          </Link>
        }
      />

      <div className="metric-panel mt-8 grid gap-3 p-4 sm:grid-cols-3">
        <PanelStat value={String(total)} label="Natija" />
        <PanelStat value={activeCategory ? "Filter" : "Barchasi"} label="Kategoriya" />
        <PanelStat value={city || "Hamma"} label="Shahar" />
      </div>

      {/* Category chips */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        <CategoryChip
          label="Barchasi"
          href={buildHref("/experts", clean, { category: "", page: undefined })}
          active={!activeCategory}
        />
        {EXPERT_CATEGORIES.map((c) => (
          <CategoryChip
            key={c.key}
            label={c.label}
            icon={<CategoryIcon category={c.key} size={15} strokeWidth={1.8} />}
            href={buildHref("/experts", clean, { category: c.key, page: undefined })}
            active={activeCategory === c.key}
          />
        ))}
      </div>

      {/* Filters */}
      <form className="filter-panel mt-6 p-4 md:p-5">
        <input type="hidden" name="category" value={activeCategory} />
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <input
              name="q"
              defaultValue={q ?? ""}
              maxLength={80}
              placeholder="Ism, tavsif yoki kalit so'z"
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
              <option value="rating">Eng yuqori reyting</option>
              <option value="reviews">Ko'p sharh</option>
              <option value="price_asc">Arzonroq</option>
              <option value="price_desc">Qimmatroq</option>
              <option value="newest">Yangi</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#86868b]">
            {total > 0 ? `${rangeFrom}–${rangeTo} / ${total} ta natija` : "Natija yo'q"}
          </p>
          <div className="flex gap-2">
            <Link
              href="/experts"
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
            icon={<SearchIcon size={28} />}
            title="Hech narsa topilmadi"
            description="Filtrlarni biroz kengaytiring yoki boshqa shaharni tanlab ko'ring."
            action={
              <Link href="/experts" className="btn-secondary !py-2.5 !px-5 text-[13px]">
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
            makeHref={(n) => buildHref("/experts", clean, { page: n })}
          />
        </>
      )}
    </div>
  );
}

function PanelStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric-card px-4 py-3">
      <div className="text-[20px] font-semibold tracking-tight text-[#123f34]">{value}</div>
      <div className="mt-0.5 text-[12px] font-medium text-[#7b827f]">{label}</div>
    </div>
  );
}

function CategoryChip({
  label,
  icon,
  href,
  active,
}: {
  label: string;
  icon?: React.ReactNode;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold transition ${
        active ? "chip-apple-active" : "chip-apple text-[#123f34] hover:border-[#006b55]/30"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
