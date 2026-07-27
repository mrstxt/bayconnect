import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { providers, posts, reviews } from "@/db/schema";
import {
  and,
  eq,
  ne,
  ilike,
  desc,
  asc,
  gte,
  lte,
  or,
  inArray,
  sql,
  type SQL,
} from "drizzle-orm";

/** Ro'yxat sahifalarida bir sahifada nechta karta ko'rsatiladi. */
export const PAGE_SIZE = 12;

/** Kesh teglari — yozuv bo'lganda shu teglar bekor qilinadi. */
export const CACHE_TAGS = {
  providers: "providers",
  posts: "posts",
  reviews: "reviews",
} as const;

export type ListFilters = {
  category?: string | string[];
  subCategory?: string;
  city?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: number;
};

export type ProviderCardRow = {
  id: number;
  fullName: string;
  category: string;
  subCategory: string;
  city: string;
  country: string;
  pricePerDay: number;
  bio: string;
  coverColor: string;
  tags: string[];
  rating: string;
  reviewsCount: number;
  capacity: number;
  verified: boolean;
};

/**
 * Karta uchun kerak bo'lgan ustunlar. `select()` (ya'ni SELECT *) o'rniga
 * shu ro'yxat ishlatiladi — phone/email/languages/created_at karta uchun
 * kerak emas va ularni tarmoq orqali tortish behuda.
 */
const cardColumns = {
  id: providers.id,
  fullName: providers.fullName,
  category: providers.category,
  subCategory: providers.subCategory,
  city: providers.city,
  country: providers.country,
  pricePerDay: providers.pricePerDay,
  bio: providers.bio,
  coverColor: providers.coverColor,
  tags: providers.tags,
  rating: providers.rating,
  reviewsCount: providers.reviewsCount,
  capacity: providers.capacity,
  verified: providers.verified,
} as const;

function buildConditions(filters: ListFilters): SQL[] {
  const conditions: SQL[] = [];

  if (filters.category) {
    if (Array.isArray(filters.category)) {
      if (filters.category.length > 0) {
        conditions.push(inArray(providers.category, filters.category));
      }
    } else {
      conditions.push(eq(providers.category, filters.category));
    }
  }

  if (filters.subCategory) {
    conditions.push(eq(providers.subCategory, filters.subCategory));
  }

  if (filters.city) {
    // Shahar aniq qiymatlar ro'yxatidan keladi → ilike '%...%' emas,
    // teng solishtirish. Bu indeksdan foydalanadi va ancha tez.
    conditions.push(eq(providers.city, filters.city));
  }

  if (filters.q) {
    // LIKE maxsus belgilarini ekranlash (\, %, _) — aks holda foydalanuvchi
    // kiritgan "%" butun bazani skanerlaydi.
    const escaped = filters.q.replace(/[\\%_]/g, (m) => `\\${m}`);
    const like = `%${escaped}%`;
    const qCond = or(
      ilike(providers.fullName, like),
      ilike(providers.city, like),
      ilike(providers.bio, like),
    );
    if (qCond) conditions.push(qCond);
  }

  const min = Number(filters.min);
  if (filters.min && Number.isFinite(min)) {
    conditions.push(gte(providers.pricePerDay, min));
  }
  const max = Number(filters.max);
  if (filters.max && Number.isFinite(max)) {
    conditions.push(lte(providers.pricePerDay, max));
  }

  return conditions;
}

function buildOrderBy(sort?: string) {
  switch (sort) {
    case "price_asc":
      return [asc(providers.pricePerDay), desc(providers.id)];
    case "price_desc":
      return [desc(providers.pricePerDay), desc(providers.id)];
    case "reviews":
      return [desc(providers.reviewsCount), desc(providers.rating), desc(providers.id)];
    case "newest":
      return [desc(providers.createdAt), desc(providers.id)];
    default:
      return [
        desc(providers.verified),
        desc(providers.rating),
        desc(providers.reviewsCount),
        desc(providers.id),
      ];
  }
}

export type ProviderListResult = {
  items: ProviderCardRow[];
  total: number;
  page: number;
  totalPages: number;
};

/**
 * Providerlar ro'yxati — sahifalangan va keshlangan.
 *
 * Eski versiyada LIMIT umuman yo'q edi: baza 5 000 qatorga yetganda bitta
 * sahifa ochilishi butun jadvalni tortib olardi. Endi LIMIT/OFFSET bor va
 * jami son bitta window-function bilan o'sha so'rovda hisoblanadi
 * (ikkinchi COUNT so'rovi kerak emas).
 */
async function listProvidersUncached(filters: ListFilters): Promise<ProviderListResult> {
  const conditions = buildConditions(filters);
  const page = Math.max(1, Math.trunc(filters.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await db
    .select({
      ...cardColumns,
      total: sql<number>`count(*) over()`.mapWith(Number),
    })
    .from(providers)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...buildOrderBy(filters.sort))
    .limit(PAGE_SIZE)
    .offset(offset);

  const total = rows.length > 0 ? rows[0].total : 0;
  const items = rows.map(({ total: _total, ...rest }) => rest as ProviderCardRow);

  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/**
 * DB xatosini "yumshoq" qilib qaytaruvchi o'ram.
 *
 * Nima uchun kerak: sahifalar ISR bilan ishlaydi, ya'ni `next build` paytida
 * ular prerender qilinadi. Agar o'sha lahzada baza yetib bormasa (Neon uxlab
 * qolgan, env xato, tarmoq uzilgan) — BUTUN DEPLOY yiqilardi.
 *
 * Muhimi: xato `unstable_cache` ICHIDA emas, TASHQARISIDA ushlanadi.
 * Shu sababli bo'sh natija keshlanmaydi va keyingi so'rov yana urinib ko'radi.
 */
async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error(`[queries:${label}] DB xatosi:`, e instanceof Error ? e.message : e);
    return fallback;
  }
}

const cachedListProviders = unstable_cache(listProvidersUncached, ["providers:list"], {
  revalidate: 120,
  tags: [CACHE_TAGS.providers],
});

export function listProviders(filters: ListFilters): Promise<ProviderListResult> {
  return safe(
    () => cachedListProviders(filters),
    { items: [], total: 0, page: 1, totalPages: 1 },
    "listProviders",
  );
}

/** Bosh sahifadagi "Yulduzli mutaxassislar" bloki. */
const cachedFeatured = unstable_cache(
  async (limit = 6): Promise<ProviderCardRow[]> => {
    const rows = await db
      .select(cardColumns)
      .from(providers)
      .orderBy(desc(providers.rating), desc(providers.reviewsCount), desc(providers.id))
      .limit(limit);
    return rows as ProviderCardRow[];
  },
  ["providers:featured"],
  { revalidate: 300, tags: [CACHE_TAGS.providers] },
);

export function getFeaturedProviders(limit = 6): Promise<ProviderCardRow[]> {
  return safe(() => cachedFeatured(limit), [], "featured");
}

/** Bosh sahifadagi statistika — bitta so'rovda FILTER bilan. */
const cachedStats = unstable_cache(
  async () => {
    const [row] = await db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        verified: sql<number>`count(*) filter (where ${providers.verified})`.mapWith(Number),
        guides: sql<number>`count(*) filter (where ${providers.category} = 'guide')`.mapWith(Number),
        transfers: sql<number>`count(*) filter (where ${providers.category} = 'transfer')`.mapWith(Number),
        hotels: sql<number>`count(*) filter (where ${providers.category} = 'hotel')`.mapWith(Number),
      })
      .from(providers);

    return row ?? { total: 0, verified: 0, guides: 0, transfers: 0, hotels: 0 };
  },
  ["providers:stats"],
  { revalidate: 600, tags: [CACHE_TAGS.providers] },
);

export type ProviderStats = {
  total: number;
  verified: number;
  guides: number;
  transfers: number;
  hotels: number;
};

export function getProviderStats(): Promise<ProviderStats> {
  return safe(
    cachedStats,
    { total: 0, verified: 0, guides: 0, transfers: 0, hotels: 0 },
    "stats",
  );
}

/** Provider sahifasi: profil + sharhlar + o'xshashlar — bitta keshlangan blok. */
const cachedProviderPage = unstable_cache(
  async (id: number) => {
    const [profile] = await db.select().from(providers).where(eq(providers.id, id)).limit(1);
    if (!profile) return null;

    const [reviewList, similar] = await Promise.all([
      db
        .select()
        .from(reviews)
        .where(eq(reviews.providerId, id))
        .orderBy(desc(reviews.createdAt))
        .limit(20),
      db
        .select(cardColumns)
        .from(providers)
        .where(and(eq(providers.category, profile.category), ne(providers.id, id)))
        .orderBy(desc(providers.rating), desc(providers.id))
        .limit(3),
    ]);

    return { profile, reviewList, similar: similar as ProviderCardRow[] };
  },
  ["providers:detail"],
  { revalidate: 300, tags: [CACHE_TAGS.providers, CACHE_TAGS.reviews] },
);

export function getProviderPageData(id: number) {
  return safe(() => cachedProviderPage(id), null, "providerDetail");
}

/** Sevimlilar sahifasi uchun ID bo'yicha olish. */
export async function getProvidersByIds(ids: number[]): Promise<ProviderCardRow[]> {
  if (ids.length === 0) return [];
  const rows = await db.select(cardColumns).from(providers).where(inArray(providers.id, ids));
  return rows as ProviderCardRow[];
}

/* ------------------------------ BLOG ------------------------------ */

const postListColumns = {
  id: posts.id,
  title: posts.title,
  slug: posts.slug,
  excerpt: posts.excerpt,
  category: posts.category,
  coverColor: posts.coverColor,
  readMinutes: posts.readMinutes,
} as const;

/** Blog ro'yxati — `body` ustunisiz (u faqat detal sahifada kerak). */
const cachedListPosts = unstable_cache(
  async (category?: string) => {
    return db
      .select(postListColumns)
      .from(posts)
      .where(category ? eq(posts.category, category) : undefined)
      .orderBy(desc(posts.createdAt))
      .limit(50);
  },
  ["posts:list"],
  { revalidate: 600, tags: [CACHE_TAGS.posts] },
);

export function listPosts(category?: string) {
  return safe(() => cachedListPosts(category), [], "listPosts");
}

const cachedPostBySlug = unstable_cache(
  async (slug: string) => {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    if (!post) return null;

    const more = await db
      .select(postListColumns)
      .from(posts)
      .where(ne(posts.id, post.id))
      .orderBy(desc(posts.createdAt))
      .limit(3);

    return { post, more };
  },
  ["posts:detail"],
  { revalidate: 600, tags: [CACHE_TAGS.posts] },
);

export function getPostBySlug(slug: string) {
  return safe(() => cachedPostBySlug(slug), null, "postDetail");
}

/** Statik generatsiya uchun barcha slug'lar. */
export async function getAllPostSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: posts.slug }).from(posts).limit(500);
  return rows.map((r) => r.slug);
}
