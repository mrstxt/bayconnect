import { NextResponse } from "next/server";
import { and, eq, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { communityAccessRequests, promoCodes, subscriptions } from "@/db/schema";
import {
  clean,
  clientIp,
  isValidPhone,
  rateLimit,
  readJson,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  fullName?: unknown;
  phone?: unknown;
  telegramUsername?: unknown;
  promoCode?: unknown;
};

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function normalizeCode(value: unknown) {
  return clean(value, 40).replace(/\s+/g, "").toUpperCase();
}

function normalizeUsername(value: unknown) {
  return clean(value, 80).replace(/^@+/, "").toLowerCase();
}

export async function POST(req: Request) {
  const limit = rateLimit(`community:${clientIp(req)}`, { limit: 8, windowMs: 60 * 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Bir ozdan keyin qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await readJson<Body>(req);
  if (!body) return NextResponse.json({ error: "So'rov formati noto'g'ri" }, { status: 400 });

  const fullName = clean(body.fullName, 160);
  const phone = clean(body.phone, 40);
  const telegramUsername = normalizeUsername(body.telegramUsername);
  const promoCode = normalizeCode(body.promoCode);

  if (fullName.length < 2) return NextResponse.json({ error: "Ism juda qisqa" }, { status: 400 });
  if (!isValidPhone(phone)) return NextResponse.json({ error: "Telefon raqami noto'g'ri" }, { status: 400 });
  if (!/^[a-z0-9_]{5,32}$/.test(telegramUsername)) {
    return NextResponse.json({ error: "Telegram username noto'g'ri. Masalan: bayconnect_user" }, { status: 400 });
  }

  const now = new Date();
  let status = "payment_required";
  let approvedUntil: Date | null = null;
  let freeMonths = 0;

  if (promoCode) {
    const [promo] = await db
      .select()
      .from(promoCodes)
      .where(
        and(
          eq(promoCodes.code, promoCode),
          eq(promoCodes.active, true),
          or(eq(promoCodes.audience, "all"), eq(promoCodes.audience, "community")),
        ),
      )
      .limit(1);

    const promoExpired = promo?.expiresAt ? promo.expiresAt <= now : false;
    const promoOverused = promo?.maxUses ? promo.usedCount >= promo.maxUses : false;

    if (!promo || promoExpired || promoOverused) {
      return NextResponse.json({ error: "Promokod faol emas yoki muddati tugagan" }, { status: 400 });
    }

    freeMonths = Math.max(1, Math.min(12, promo.freeMonths));
    status = "approved";
    approvedUntil = addMonths(now, freeMonths);
  }

  const [request] = await db
    .insert(communityAccessRequests)
    .values({
      fullName,
      phone,
      telegramUsername,
      status,
      promoCode: promoCode || null,
      approvedUntil,
      updatedAt: now,
    })
    .returning({ id: communityAccessRequests.id });

  if (status === "approved" && approvedUntil) {
    await db.insert(subscriptions).values({
      audience: "community",
      telegramUsername,
      planKey: "baycommunity",
      status: "active",
      promoCode,
      startedAt: now,
      expiresAt: approvedUntil,
      updatedAt: now,
    });

    await db
      .update(promoCodes)
      .set({ usedCount: sql`${promoCodes.usedCount} + 1` })
      .where(eq(promoCodes.code, promoCode));
  }

  return NextResponse.json({
    ok: true,
    id: request.id,
    status,
    freeMonths,
    approvedUntil: approvedUntil?.toISOString() ?? null,
    joinHint:
      status === "approved"
        ? "Endi BayCommunity yopiq guruhiga join request yuboring. Bot username'ingizni tekshiradi va tasdiqlaydi."
        : "To'lov yakunlangach admin so'rovingizni approve qiladi.",
  });
}
