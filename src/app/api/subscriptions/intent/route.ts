import { NextResponse } from "next/server";
import { and, eq, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { communityAccessRequests, promoCodes, subscriptions, telegramVerifications } from "@/db/schema";
import { COMMUNITY_PLAN, SPECIALIST_PLANS } from "@/lib/brand";
import {
  clean,
  clientIp,
  isValidPhone,
  rateLimit,
  readJson,
} from "@/lib/validation";
import { telegramCreateJoinRequestInviteLink } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  audience?: unknown;
  planKey?: unknown;
  fullName?: unknown;
  phone?: unknown;
  telegramUsername?: unknown;
  telegramVerificationToken?: unknown;
  promoCode?: unknown;
  method?: unknown;
};

const SPECIALIST_PLAN_KEYS = new Set<string>(SPECIALIST_PLANS.map((p) => p.key));

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

function isMissingTableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const cause = (error as Error & { cause?: { code?: string } }).cause;
  return cause?.code === "42P01" || error.message.includes("does not exist");
}

export async function POST(req: Request) {
  const limit = rateLimit(`subscription:${clientIp(req)}`, { limit: 12, windowMs: 60 * 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Bir ozdan keyin qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await readJson<Body>(req);
  if (!body) return NextResponse.json({ error: "So'rov formati noto'g'ri" }, { status: 400 });

  const audience = clean(body.audience, 30);
  const planKey = clean(body.planKey, 40);
  const fullName = clean(body.fullName, 160);
  const phone = clean(body.phone, 40);
  const telegramVerificationToken = clean(body.telegramVerificationToken, 80);
  let telegramUsername = normalizeUsername(body.telegramUsername);
  const promoCode = normalizeCode(body.promoCode);
  const method = clean(body.method, 20) || "promo";

  if (audience !== "specialist" && audience !== "community") {
    return NextResponse.json({ error: "Obuna turi noto'g'ri" }, { status: 400 });
  }

  const validPlan =
    audience === "specialist"
      ? SPECIALIST_PLAN_KEYS.has(planKey)
      : planKey === COMMUNITY_PLAN.key;
  if (!validPlan) return NextResponse.json({ error: "Tarif noto'g'ri" }, { status: 400 });

  if (fullName.length < 2) return NextResponse.json({ error: "Ism juda qisqa" }, { status: 400 });
  if (!isValidPhone(phone)) return NextResponse.json({ error: "Telefon raqami noto'g'ri" }, { status: 400 });
  if (!/^[a-f0-9]{48}$/.test(telegramVerificationToken)) {
    return NextResponse.json({ error: "Avval Telegram profilingizni tasdiqlang" }, { status: 400 });
  }

  try {
    const [verification] = await db
      .select()
      .from(telegramVerifications)
      .where(eq(telegramVerifications.token, telegramVerificationToken))
      .limit(1);

    if (!verification || verification.status !== "verified" || verification.expiresAt <= new Date()) {
      return NextResponse.json({ error: "Telegram tasdiqlanmagan yoki muddati tugagan" }, { status: 400 });
    }
    telegramUsername = normalizeUsername(verification.telegramUsername ?? "");
  } catch (error) {
    console.error("[api/subscriptions/intent] telegram verify xato:", error);
    if (isMissingTableError(error)) {
      return NextResponse.json(
        { error: "Production baza yangilanmagan. Admin migrationni ishga tushirishi kerak." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Server xatosi. Keyinroq urinib ko'ring." }, { status: 500 });
  }

  if (!/^[a-z0-9_]{5,32}$/.test(telegramUsername)) {
    return NextResponse.json({ error: "Telegram username topilmadi. Telegramda username ochib qayta tasdiqlang." }, { status: 400 });
  }

  const now = new Date();
  let status = "payment_required";
  let expiresAt: Date | null = null;
  let freeMonths = 0;

  try {
    if (method === "promo") {
      if (!promoCode) return NextResponse.json({ error: "Promokodni kiriting" }, { status: 400 });

      const [promo] = await db
        .select()
        .from(promoCodes)
        .where(
          and(
            eq(promoCodes.code, promoCode),
            eq(promoCodes.active, true),
            or(eq(promoCodes.audience, "all"), eq(promoCodes.audience, audience)),
          ),
        )
        .limit(1);

      const promoExpired = promo?.expiresAt ? promo.expiresAt <= now : false;
      const promoOverused = promo?.maxUses ? promo.usedCount >= promo.maxUses : false;

      if (!promo || promoExpired || promoOverused) {
        return NextResponse.json({ error: "Promokod faol emas yoki muddati tugagan" }, { status: 400 });
      }

      freeMonths = Math.max(1, Math.min(12, promo.freeMonths));
      status = "active";
      expiresAt = addMonths(now, freeMonths);
    }

    const [subscription] = await db
      .insert(subscriptions)
      .values({
        audience,
        telegramUsername,
        planKey,
        status,
        promoCode: promoCode || null,
        startedAt: status === "active" ? now : null,
        expiresAt,
        updatedAt: now,
      })
      .returning({ id: subscriptions.id });

    if (audience === "community") {
      await db.insert(communityAccessRequests).values({
        fullName,
        phone,
        telegramUsername,
        audience,
        planKey,
        status: status === "active" ? "approved" : "payment_required",
        promoCode: promoCode || null,
        approvedUntil: expiresAt,
        updatedAt: now,
      });
    }

    if (status === "active" && promoCode) {
      await db
        .update(promoCodes)
        .set({ usedCount: sql`${promoCodes.usedCount} + 1` })
        .where(eq(promoCodes.code, promoCode));
    }

    const communityJoinUrl =
      status === "active"
        ? await telegramCreateJoinRequestInviteLink(`BayCommunity ${subscription.id}`)
        : null;

    return NextResponse.json({
      ok: true,
      id: subscription.id,
      audience,
      status,
      freeMonths,
      expiresAt: expiresAt?.toISOString() ?? null,
      communityJoinUrl,
      nextStep:
        status === "active"
          ? "BayCommunity guruhiga kirish uchun bot taklif havolasi orqali ariza yuboring. Bot profilingizni tekshiradi va mos bo'lsa tasdiqlaydi."
          : "To'lov integratsiyasi orqali to'lov tasdiqlangach obuna active bo'ladi.",
    });
  } catch (error) {
    console.error("[api/subscriptions/intent] xato:", error);
    if (isMissingTableError(error)) {
      return NextResponse.json(
        { error: "Production baza yangilanmagan. Admin migrationni ishga tushirishi kerak." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Server xatosi. Keyinroq urinib ko'ring." }, { status: 500 });
  }
}
