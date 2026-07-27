import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { EXPERT_CATEGORIES, CITIES } from "@/lib/brand";
import { EmptyState, SectionHeading } from "@/components/ui";
import { listProviders } from "@/lib/queries";
import { CategoryIcon, SearchIcon, PlusIcon } from "@/components/Icon";

export const dynamic = "force-dynamic";

const EXPERT_KEYS = EXPERT_CATEGORIES.map((c) => c.key);

type SearchParams = Promise<{
  category?: string;
  city?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
}>;

export default async function ExpertsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const activeCategory =
    sp.category && EXPERT_KEYS.includes(sp.category as (typeof EXPERT_KEYS)[number])
      ? sp.category
      : "";

  const list = await listProviders({
    category: activeCategory ? activeCategory : [...EXPERT_KEYS],
    city: sp.city,
    q: sp.q,
    min: sp.min,
    max: sp.max,
    sort: sp.sort,
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionHeading
        eyebrow="Odamlar"
        title="Turizm mutaxassislari"
        subtitle="Gidlar, tarjimonlar, fotograflar va tur agentlari — sayohatingiz uchun eng zo'r hamroh."
        action={
          <Link href="/register" className="btn-secondary !py-2.5 !px-5 text-[13px] inline-flex items-center gap-1.5">
            <PlusIcon size={15} strokeWidth={2} /> Ro'yxatdan o'tish
          </Link>
        }
      />

      {/* Category chips */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        <CategoryChip label="Barchasi" href={makeHref(sp, { category: "" })} active={!activeCategory} />
        {EXPERT_CATEGORIES.map((c) => (
          <CategoryChip
            key={c.key}
            label={c.label}
            icon={<CategoryIcon category={c.key} size={15} strokeWidth={1.8} />}
            href={makeHref(sp, { category: c.key })}
            active={activeCategory === c.key}
          />
        ))}
      </div>

      {/* Filters */}
      <form className="mt-6 rounded-[8px] border border-[#006b55]/10 bg-[#fff7ef] p-4 md:p-5">
        <input type="hidden" name="category" value={activeCategory} />
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Ism, tavsif yoki kalit so'z"
              className="input-apple"
            />
          </div>
          <div className="md:col-span-2">
            <select name="city" defaultValue={sp.city ?? ""} className="input-apple">
              <option value="">Barcha shaharlar</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <input
              name="min"
              type="number"
              min="0"
              defaultValue={sp.min ?? ""}
              placeholder="Min $"
              className="input-apple"
            />
          </div>
          <div className="md:col-span-2">
            <input
              name="max"
              type="number"
              min="0"
              defaultValue={sp.max ?? ""}
              placeholder="Max $"
              className="input-apple"
            />
          </div>
          <div className="md:col-span-2">
            <select name="sort" defaultValue={sp.sort ?? "rating"} className="input-apple">
              <option value="rating">Eng yuqori reyting</option>
              <option value="reviews">Ko'p sharh</option>
              <option value="price_asc">Arzonroq</option>
              <option value="price_desc">Qimmatroq</option>
              <option value="newest">Yangi</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#86868b]">{list.length} ta natija topildi</p>
          <div className="flex gap-2">
            <Link
              href="/experts"
              className="px-4 py-2.5 rounded-full text-[13px] font-semibold text-[#123f34] bg-white border border-[#006b55]/10 hover:bg-[#eaf4ef] transition"
            >
              Tozalash
            </Link>
            <button type="submit" className="btn-primary !py-2.5 !px-5 text-[13px] !shadow-none">
              Filtrlash
            </button>
          </div>
        </div>
      </form>

      {list.length === 0 ? (
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
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((p) => (
            <ProviderCard key={p.id} p={p} />
          ))}
        </div>
      )}
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
      className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold border transition ${
        active
          ? "bg-[#006b55] text-white border-[#006b55]"
          : "bg-white text-[#123f34] border-[#006b55]/10 hover:border-[#006b55]/30"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function makeHref(
  current: Record<string, string | undefined>,
  override: Record<string, string>,
) {
  const params = new URLSearchParams();
  const merged = { ...current, ...override };
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, String(v));
  }
  const qs = params.toString();
  return `/experts${qs ? `?${qs}` : ""}`;
}
