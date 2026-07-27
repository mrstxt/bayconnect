import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { EmptyState, SectionHeading } from "@/components/ui";
import {
  BookOpenIcon,
  LightbulbIcon,
  PinIcon,
  MoonIcon,
  ClockIcon,
} from "@/components/Icon";

const POST_ICONS: Record<string, (p: { size?: number }) => React.JSX.Element> = {
  guide: BookOpenIcon,
  tips: LightbulbIcon,
  destination: PinIcon,
  story: MoonIcon,
};

function PostIcon({ category, size = 30 }: { category: string; size?: number }) {
  const Comp = POST_ICONS[category] ?? BookOpenIcon;
  return <Comp size={size} />;
}

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { key: "", label: "Barchasi" },
  { key: "guide", label: "Qo'llanma" },
  { key: "tips", label: "Maslahat" },
  { key: "destination", label: "Manzil" },
  { key: "story", label: "Hikoya" },
];

type SearchParams = Promise<{ category?: string }>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const active = sp.category ?? "";

  const list = await db
    .select()
    .from(posts)
    .where(active ? eq(posts.category, active) : undefined)
    .orderBy(desc(posts.createdAt));

  const [featured, ...rest] = list;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionHeading
        eyebrow="Blog"
        title="Sayohat haqida"
        subtitle="Maslahatlar, marshrutlar va O'zbekiston bo'ylab hikoyalar."
      />

      <div className="mt-8 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <Link
            key={c.key || "all"}
            href={c.key ? `/blog?category=${c.key}` : "/blog"}
            className={`shrink-0 px-4 py-2 text-[13px] font-semibold transition ${
              active === c.key
                ? "chip-apple-active"
                : "chip-apple text-[#123f34] hover:border-[#006b55]/30"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={<BookOpenIcon size={28} />} title="Hozircha post yo'q" description="Yaqinda yangi maqolalar chiqadi." />
        </div>
      ) : (
        <div className="mt-10 grid gap-6">
          {featured ? (
            <Link
              href={`/blog/${featured.slug}`}
              className="surface-apple-strong group grid gap-6 p-6 card-lift md:grid-cols-[auto_1fr] md:p-8"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#006b55] text-white shadow-sm md:h-24 md:w-24">
                <PostIcon category={featured.category} size={44} />
              </span>
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.14em] uppercase text-[#006b55]">
                  <ClockIcon size={13} strokeWidth={2} />
                  Yangi post · {featured.readMinutes} daq o'qish
                </div>
                <h2 className="mt-3 text-[28px] md:text-[36px] font-semibold tracking-tight leading-[1.1] text-[#123f34] group-hover:text-[#006b55] transition">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[#5f6864]">{featured.excerpt}</p>
                <div className="mt-6 text-[13px] font-semibold text-[#0717b8]">O'qishni davom ettirish →</div>
              </div>
            </Link>
          ) : null}

          {rest.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="surface-apple group p-5 card-lift"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff7ef] text-[#006b55] ring-1 ring-[#123f34]/5">
                      <PostIcon category={p.category} size={24} />
                    </span>
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#7b827f]">
                        <ClockIcon size={12} />
                        {p.readMinutes} daq o'qish
                      </div>
                      <h3 className="mt-2 text-[17px] font-semibold tracking-tight text-[#123f34] group-hover:text-[#006b55] transition line-clamp-2">
                        {p.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-[#5f6864] line-clamp-3">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
