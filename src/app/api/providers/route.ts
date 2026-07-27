import { NextResponse } from "next/server";
import { db } from "@/db";
import { providers } from "@/db/schema";
import { CATEGORIES } from "@/lib/brand";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      fullName?: string;
      category?: string;
      city?: string;
      country?: string;
      languages?: string[];
      pricePerDay?: number;
      experienceYears?: number;
      bio?: string;
      phone?: string;
      email?: string;
      tags?: string[];
      avatarEmoji?: string;
      coverColor?: string;
    };

    const fullName = body.fullName?.trim() ?? "";
    const category = body.category?.trim() ?? "";
    const city = body.city?.trim() ?? "";
    const bio = body.bio?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const pricePerDay = Number(body.pricePerDay ?? 0);
    const experienceYears = Number(body.experienceYears ?? 0);

    if (!fullName || !category || !city || !bio || !phone || !email || !pricePerDay) {
      return NextResponse.json(
        { error: "Barcha majburiy maydonlarni to'ldiring" },
        { status: 400 },
      );
    }

    if (!CATEGORIES.some((c) => c.key === category)) {
      return NextResponse.json({ error: "Noto'g'ri kategoriya" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email noto'g'ri" }, { status: 400 });
    }

    if (!Number.isFinite(pricePerDay) || pricePerDay < 1 || pricePerDay > 10000) {
      return NextResponse.json({ error: "Narx noto'g'ri" }, { status: 400 });
    }

    if (!Number.isFinite(experienceYears) || experienceYears < 0 || experienceYears > 80) {
      return NextResponse.json({ error: "Tajriba noto'g'ri" }, { status: 400 });
    }

    const allowedColors = new Set(["orange", "yellow", "blue", "dark"]);
    const coverColor = allowedColors.has(body.coverColor ?? "")
      ? (body.coverColor as string)
      : "orange";

    const [row] = await db
      .insert(providers)
      .values({
        fullName,
        category,
        city,
        country: body.country?.trim() || "Uzbekistan",
        languages: Array.isArray(body.languages) ? body.languages.slice(0, 12) : [],
        pricePerDay,
        experienceYears,
        bio,
        phone,
        email,
        tags: Array.isArray(body.tags) ? body.tags.slice(0, 12) : [],
        avatarEmoji: body.avatarEmoji?.trim() || "🌴",
        coverColor,
      })
      .returning({ id: providers.id });

    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
