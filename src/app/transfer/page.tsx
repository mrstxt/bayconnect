import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { CITIES, TRANSFER_TYPES } from "@/lib/brand";
import { EmptyState, SectionHeading } from "@/components/ui";
import { listProviders } from "@/lib/queries";
import { TransferTypeIcon, GlobeGridIcon, CarIcon, UsersIcon } from "@/components/Icon";

export const dynamic = "force-dynamic";

const TRANSFER_KEYS = TRANSFER_TYPES.map((t) => t.key);

type SearchParams = Promise<{
  type?: string;
  city?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
}>;

export default async function TransferPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const activeType =
    sp.type && TRANSFER_KEYS.includes(sp.type as (typeof TRANSFER_KEYS)[number]) ? sp.type : "";

  const list = await listProviders({
    category: "transfer",
    subCategory: activeType || undefined,
    city: sp.city,
    q: sp.q,
    min: sp.min,
    max: sp.max,
    sort: sp.sort,
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionHeading
        eyebrow="Transport"
        title="Transfer xizmatlari"
        subtitle="Yengil avtodan avtobusgacha — sizga qulay transport turini tanlang."
      />

      <div className="surface-apple mt-8 grid gap-3 p-4 sm:grid-cols-3">
        <PanelStat value={`${list.length}`} label="Transport" />
        <PanelStat value={activeType || "Barchasi"} label="Tur" />
        <PanelStat value={sp.city || "Hamma"} label="Shahar" />
      </div>

      {/* Vehicle type cards */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <TypeCard
          label="Barchasi"
          icon={<GlobeGridIcon size={28} />}
          capacity="Har qanday"
          href={makeHref(sp, { type: "" })}
          active={!activeType}
        />
        {TRANSFER_TYPES.map((t) => (
          <TypeCard
            key={t.key}
            label={t.label}
            icon={<TransferTypeIcon type={t.key} size={28} />}
            capacity={`${t.capacity} kishi`}
            href={makeHref(sp, { type: t.key })}
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
              defaultValue={sp.q ?? ""}
              placeholder="Kompaniya yoki tavsif"
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
            <input name="min" type="number" min="0" defaultValue={sp.min ?? ""} placeholder="Min $" className="input-apple" />
          </div>
          <div className="md:col-span-2">
            <input name="max" type="number" min="0" defaultValue={sp.max ?? ""} placeholder="Max $" className="input-apple" />
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
          <p className="text-[13px] text-[#86868b]">{list.length} ta natija</p>
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

      {list.length === 0 ? (
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
  return `/transfer${qs ? `?${qs}` : ""}`;
}
