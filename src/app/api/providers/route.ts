import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/db";
import { providers } from "@/db/schema";
import { CATEGORIES, CITIES } from "@/lib/brand";
import { CACHE_TAGS } from "@/lib/queries";
import {
  clean,
  cleanMultiline,
  cleanStringArray,
  clientIp,
  isValidEmail,
  isValidPhone,
  rateLimit,
  readJson,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  fullName?: unknown;
  category?: unknown;
  subCategory?: unknown;
  city?: unknown;
  country?: unknown;
  languages?: unknown;
  pricePerDay?: unknown;
  experienceYears?: unknown;
  capacity?: unknown;
  bio?: unknown;
  phone?: unknown;
  email?: unknown;
  tags?: unknown;
  avatarEmoji?: unknown;
  coverColor?: unknown;
};

const CATEGORY_KEYS = new Set<string>(CATEGORIES.map((c) => c.key));
const ALLOWED_COLORS = new Set(["orange", "yellow", "blue", "dark"]);
const TRANSFER_SUBS = new Set(["sedan", "minivan", "suv", "bus", "airport"]);

export async function POST(req: Request) {
  // Ro'yxatdan o'tish: soatiga 10 ta profil — bot bilan bazani to'ldirishga qarshi.
  const limit = rateLimit(`register:${clientIp(req)}`, { limit: 10, windowMs: 60 * 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Bir ozdan keyin qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await readJson<Body>(req);
  if (!body) {
    return NextResponse.json({ error: "So'rov formati noto'g'ri" }, { status: 400 });
  }

  const fullName = clean(body.fullName, 160);
  const category = clean(body.category, 40);
  const city = clean(body.city, 80);
  const country = clean(body.country, 80) || "Uzbekistan";
  const bio = cleanMultiline(body.bio, 2000);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160).toLowerCase();
  const pricePerDay = Number(body.pricePerDay ?? 0);
  const experienceYears = Number(body.experienceYears ?? 0);
  const capacity = Number(body.capacity ?? 0);

  if (!fullName || !category || !city || !bio || !phone || !email) {
    return NextResponse.json(
      { error: "Barcha majburiy maydonlarni to'ldiring" },
      { status: 400 },
    );
  }

  if (fullName.length < 2) {
    return NextResponse.json({ error: "Ism juda qisqa" }, { status: 400 });
  }

  if (bio.length < 20) {
    return NextResponse.json(
      { error: "Tavsif kamida 20 ta belgidan iborat bo'lsin" },
      { status: 400 },
    );
  }

  if (!CATEGORY_KEYS.has(category)) {
    return NextResponse.json({ error: "Noto'g'ri kategoriya" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email noto'g'ri" }, { status: 400 });
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Telefon raqami noto'g'ri. Namuna: +998 90 123 45 67" },
      { status: 400 },
    );
  }

  if (!Number.isFinite(pricePerDay) || pricePerDay < 1 || pricePerDay > 10_000) {
    return NextResponse.json({ error: "Narx 1 dan 10000 gacha bo'lsin" }, { status: 400 });
  }

  if (!Number.isFinite(experienceYears) || experienceYears < 0 || experienceYears > 80) {
    return NextResponse.json({ error: "Tajriba noto'g'ri" }, { status: 400 });
  }

  if (!Number.isFinite(capacity) || capacity < 0 || capacity > 100) {
    return NextResponse.json({ error: "Sig'im noto'g'ri" }, { status: 400 });
  }

  // Shahar ro'yxatdan bo'lsa — kanonik yozuvni ishlatamiz (filtr aniq mos kelsin).
  const canonicalCity =
    CITIES.find((c) => c.toLowerCase() === city.toLowerCase()) ?? city;

  const rawSub = clean(body.subCategory, 40);
  const subCategory = category === "transfer" && TRANSFER_SUBS.has(rawSub) ? rawSub : "";

  const rawColor = clean(body.coverColor, 20);
  const coverColor = ALLOWED_COLORS.has(rawColor) ? rawColor : "orange";

  // Emoji maydoni 8 belgi — surrogate juftlarni buzmaslik uchun Array.from.
  const rawEmoji = clean(body.avatarEmoji, 8);
  const avatarEmoji = rawEmoji ? Array.from(rawEmoji).slice(0, 2).join("") : "🌴";

  try {
    const [row] = await db
      .insert(providers)
      .values({
        fullName,
        category,
        subCategory,
        city: canonicalCity,
        country,
        languages: cleanStringArray(body.languages, 12, 40),
        pricePerDay: Math.trunc(pricePerDay),
        experienceYears: Math.trunc(experienceYears),
        capacity: Math.trunc(capacity),
        bio,
        phone,
        email,
        tags: cleanStringArray(body.tags, 12, 40),
        avatarEmoji,
        coverColor,
      })
      .returning({ id: providers.id });

    // MUHIM: yangi profil qo'shilgach ro'yxat keshini bekor qilamiz,
    // aks holda u 2 daqiqagacha saytda ko'rinmaydi.
    // Next.js 16'da revalidateTag ikkinchi argument (cacheLife profili) talab qiladi.
    revalidateTag(CACHE_TAGS.providers, "max");

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (e) {
    console.error("[api/providers] xato:", e);
    return NextResponse.json({ error: "Server xatosi. Keyinroq urinib ko'ring." }, { status: 500 });
  }
}
