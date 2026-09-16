import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coverBg } from "@/lib/brand";
import { getAllPostSlugs, getPostBySlug } from "@/lib/queries";
import { BookOpenIcon, LightbulbIcon, PinIcon, MoonIcon } from "@/components/Icon";

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

export const revalidate = 600;

/**
 * Build vaqtida barcha maqolalar statik HTML'ga aylantiriladi.
 * Natijada blog postlari CDN'dan deyarli bir zumda ochiladi.
 * DB mavjud bo'lmasa (masalan CI'da) build yiqilmasligi uchun try/catch bor.
 */
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostBySlug(slug);
  if (!data) return { title: "Maqola topilmadi | bayConnect" };

  const { post } = data;
  return {
    title: `${post.title} | bayConnect Blog`,
    description: post.excerpt.slice(0, 155),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt.slice(0, 155),
      type: "article",
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPostBySlug(slug);
  if (!data) notFound();

  const { post, more } = data;

  // Bo'sh qatorlarni tashlab yuboramiz — aks holda bo'sh <p> lar chiqadi.
  const paragraphs = post.body.split("\n").filter((line) => line.trim().length > 0);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <div className="flex items-center gap-2 text-[13px] text-[#86868b]">
        <Link href="/blog" className="hover:text-[#006b55] transition">
          Blog
        </Link>
        <span>/</span>
        <span className="text-[#123f34] truncate">{post.title}</span>
      </div>

      <div
        className={`mt-5 relative h-52 md:h-72 rounded-[28px] overflow-hidden ${coverBg(
          post.coverColor,
        )} flex items-center justify-center apple-shadow`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
        <span className="flex items-center justify-center w-28 h-28 rounded-3xl bg-white/90 text-[#123f34] shadow-sm">
          <PostIcon category={post.category} size={52} />
        </span>
      </div>

      <div className="mt-8">
        <div className="text-[12px] font-semibold tracking-[0.14em] uppercase text-[#006b55]">
          {post.readMinutes} daq o'qish
        </div>
        <h1 className="mt-4 text-[36px] md:text-[48px] font-semibold tracking-tight leading-[1.05]">
          {post.title}
        </h1>
        <p className="mt-4 text-[19px] leading-relaxed text-[#6e6e73]">{post.excerpt}</p>
      </div>

      {/*
        Eslatma: ilgari bu yerda `prose` klasslari bor edi, lekin
        @tailwindcss/typography plugini o'rnatilmagan — ular hech narsa
        qilmasdi. Endi to'g'ridan-to'g'ri o'z stilimiz.
      */}
      <article className="mt-8 max-w-none text-[17px] leading-[1.75] text-[#123f34]/90">
        {paragraphs.map((par, i) => (
          <p key={i} className="mb-5">
            {par}
          </p>
        ))}
      </article>

      {more.length > 0 ? (
        <div className="mt-16 pt-10 border-t border-black/[0.06]">
          <h2 className="text-[22px] font-semibold tracking-tight">Yana o'qing</h2>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {more.map((m) => (
              <Link key={m.id} href={`/blog/${m.slug}`} className="surface-apple group p-4 card-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ef] text-[#006b55] ring-1 ring-[#123f34]/5">
                  <PostIcon category={m.category} size={22} />
                </span>
                <h3 className="mt-4 text-[14px] font-semibold tracking-tight text-[#123f34] group-hover:text-[#006b55] transition line-clamp-2">
                  {m.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
