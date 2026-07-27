import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { CITIES } from "@/lib/brand";
import { EmptyState, SectionHeading } from "@/components/ui";
import { listProviders } from "@/lib/queries";
import { HotelIcon } from "@/components/Icon";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  city?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
}>;

export default async function HotelsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const list = await listProviders({
    category: "hotel",
    city: sp.city,
    q: sp.q,
    min: sp.min,
    max: sp.max,
    sort: sp.sort,
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionHeading
        eyebrow="Joylashuv"
        title="Mehmonxonalar"
        subtitle="Butik mehmonxonalardan zamonaviy 4* mehmonxonalargacha — sizga qulay joyni tanlang."
      />

      <div className="surface-apple mt-8 grid gap-3 p-4 sm:grid-cols-3">
        <PanelStat value={`${list.length}`} label="Mehmonxona" />
        <PanelStat value={sp.city || "Hamma"} label="Shahar" />
        <PanelStat value={sp.sort || "rating"} label="Saralash" />
      </div>

      <form className="filter-panel mt-8 p-4 md:p-5">
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Mehmonxona nomi yoki tavsif"
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
            <input name="min" type="number" min="0" defaultValue={sp.min ?? ""} placeholder="Min $/kun" className="input-apple" />
          </div>
          <div className="md:col-span-2">
            <input name="max" type="number" min="0" defaultValue={sp.max ?? ""} placeholder="Max $/kun" className="input-apple" />
          </div>
          <div className="md:col-span-2">
            <select name="sort" defaultValue={sp.sort ?? "rating"} className="input-apple">
              <option value="rating">Yuqori reyting</option>
              <option value="reviews">Ko'p sharh</option>
              <option value="price_asc">Arzonroq</option>
              <option value="price_desc">Qimmatroq</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#86868b]">{list.length} ta mehmonxona</p>
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

      {list.length === 0 ? (
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
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((p) => (
            <ProviderCard key={p.id} p={p} />
          ))}
        </div>
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
