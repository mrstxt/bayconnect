import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { and, desc, eq, gt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  communityAccessRequests,
  promoCodes,
  providers,
  subscriptions,
  telegramRegistrations,
  telegramVerifications,
} from "@/db/schema";
import { CACHE_TAGS } from "@/lib/queries";
import { categoryLabel, COMMUNITY_PLAN, SPECIALIST_PLANS } from "@/lib/brand";
import {
  clean,
  cleanMultiline,
  clientIp,
  isValidPhone,
  rateLimit,
  readJson,
} from "@/lib/validation";
import { telegramCreateJoinRequestInviteLink, telegramSendMessage } from "@/lib/telegram";

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

async function publishProviderFromBotRegistration(params: {
  telegramUserId: string;
  telegramUsername: string;
  subscriptionId: number;
  expiresAt: Date | null;
  planKey: string;
}) {
  const { telegramUserId, telegramUsername, subscriptionId, expiresAt, planKey } = params;
  const [existingProvider] = await db
    .select({ id: providers.id, fullName: providers.fullName, telegramChatId: providers.telegramChatId })
    .from(providers)
    .where(or(eq(providers.telegramUserId, telegramUserId), eq(providers.telegramUsername, telegramUsername)))
    .limit(1);

  if (existingProvider) {
    await db
      .update(subscriptions)
      .set({ providerId: existingProvider.id, updatedAt: new Date() })
      .where(eq(subscriptions.id, subscriptionId));
    return existingProvider;
  }

  const [reg] = await db
    .select()
    .from(telegramRegistrations)
    .where(eq(telegramRegistrations.telegramUserId, telegramUserId))
    .orderBy(desc(telegramRegistrations.updatedAt))
    .limit(1);

  if (!reg || reg.step !== "profileReady") return null;

  const bio = cleanMultiline(reg.data.bio, 2000);
  if (!reg.fullName || !reg.phone || !reg.data.category || !reg.data.city || !bio) return null;

  const languages = (reg.data.languages ?? "").split(",").map((x) => clean(x, 40)).filter(Boolean).slice(0, 12);
  const [provider] = await db
    .insert(providers)
    .values({
      fullName: reg.fullName,
      category: reg.data.category,
      subCategory: reg.data.category === "transfer" ? reg.data.subCategory ?? "sedan" : "",
      city: reg.data.city,
      languages,
      pricePerDay: Number(reg.data.pricePerDay),
      experienceYears: Number(reg.data.experienceYears),
      capacity: Number(reg.data.capacity ?? 0),
      bio,
      phone: reg.phone,
      email: reg.data.email || `telegram-${telegramUserId}@bayconnect.local`,
      telegramChatId: reg.chatId,
      telegramUserId,
      telegramUsername,
      avatarEmoji: reg.data.category === "transfer" ? "✈️" : "🕌",
      coverColor: reg.data.category === "transfer" ? "blue" : "orange",
    })
    .returning({ id: providers.id, fullName: providers.fullName, telegramChatId: providers.telegramChatId });

  await db
    .update(subscriptions)
    .set({ providerId: provider.id, updatedAt: new Date() })
    .where(eq(subscriptions.id, subscriptionId));

  await db
    .update(telegramRegistrations)
    .set({ step: "done", updatedAt: new Date() })
    .where(eq(telegramRegistrations.chatId, reg.chatId));

  revalidateTag(CACHE_TAGS.providers, "max");

  const planLabel = SPECIALIST_PLANS.find((plan) => plan.key === planKey)?.label ?? planKey;
  await telegramSendMessage(
    reg.chatId,
    `✅ Siz ${planLabel} tarifi bo'yicha obuna bo'ldingiz.\n\nObuna muddati: ${expiresAt ? expiresAt.toLocaleDateString("uz-UZ") : "to'lov tasdiqlanguncha"} gacha.\nProfilingiz saytga joylandi: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://bayconnect.uz"}/providers/${provider.id}\n\nKategoriya: ${categoryLabel(reg.data.category)}\nBayCommunity guruhiga kirish tugmasi saytda chiqadi.`,
    { reply_markup: { remove_keyboard: true } },
  );

  return provider;
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
  let telegramUserId = "";
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
  if (!/^(?:[a-f0-9]{40}|[a-f0-9]{48})$/.test(telegramVerificationToken)) {
    return NextResponse.json({ error: "Avval Telegram profilingizni tasdiqlang" }, { status: 400 });
  }

  try {
    const [verification] = await db
      .select()
      .from(telegramVerifications)
      .where(eq(telegramVerifications.token, telegramVerificationToken))
      .limit(1);

    if (!verification || verification.status !== "verified") {
      return NextResponse.json({ error: "Telegram tasdiqlanmagan yoki muddati tugagan" }, { status: 400 });
    }
    telegramUserId = verification.telegramUserId ?? "";
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
  if (!/^\d+$/.test(telegramUserId)) {
    return NextResponse.json({ error: "Telegram profil ID topilmadi. Qayta tasdiqlang." }, { status: 400 });
  }

  const now = new Date();
  let status = "payment_required";
  let expiresAt: Date | null = null;
  let freeMonths = 0;

  try {
    const [existingActive] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.audience, audience),
          eq(subscriptions.status, "active"),
          gt(subscriptions.expiresAt, now),
          or(
            eq(subscriptions.telegramUserId, telegramUserId),
            eq(subscriptions.telegramUsername, telegramUsername),
            eq(subscriptions.phone, phone),
          ),
        ),
      )
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (existingActive) {
      if (!existingActive.telegramUserId) {
        await db
          .update(subscriptions)
          .set({ telegramUserId, telegramUsername, fullName, phone, updatedAt: now })
          .where(eq(subscriptions.id, existingActive.id));
      }

      const [existingProvider] =
        audience === "specialist"
          ? await db
              .select({ id: providers.id })
              .from(providers)
              .where(
                or(
                  eq(providers.telegramUserId, telegramUserId),
                  eq(providers.telegramUsername, telegramUsername),
                ),
              )
              .limit(1)
          : [];

      const publishedProvider =
        audience === "specialist" && !existingProvider
          ? await publishProviderFromBotRegistration({
              telegramUserId,
              telegramUsername,
              subscriptionId: existingActive.id,
              expiresAt: existingActive.expiresAt,
              planKey: existingActive.planKey,
            })
          : null;

      const communityJoinUrl = await telegramCreateJoinRequestInviteLink(`BayCommunity ${existingActive.id}`);

      return NextResponse.json({
        ok: true,
        id: existingActive.id,
        audience,
        status: "active",
        alreadyActive: true,
        providerId: existingProvider?.id ?? publishedProvider?.id ?? existingActive.providerId ?? null,
        expiresAt: existingActive.expiresAt?.toISOString() ?? null,
        communityJoinUrl,
        nextStep:
          audience === "specialist" && (existingProvider?.id ?? publishedProvider?.id ?? existingActive.providerId)
            ? "Sizda faol hamkor obunasi va profil bor. Yangi profil ochilmaydi."
            : audience === "specialist"
              ? "Sizda faol hamkor obunasi bor. Endi botda ro'yxatdan o'tishni yakunlang."
              : "Sizda faol BayCommunity obunasi bor. Guruhga kirish uchun ariza yuboring.",
      });
    }

    const [preExistingProvider] =
      audience === "specialist"
        ? await db
            .select({ id: providers.id })
            .from(providers)
            .where(
              or(
                eq(providers.telegramUserId, telegramUserId),
                eq(providers.telegramUsername, telegramUsername),
                eq(providers.phone, phone),
              ),
            )
            .limit(1)
        : [];

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
        providerId: preExistingProvider?.id ?? null,
        telegramUserId,
        telegramUsername,
        fullName,
        phone,
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
        telegramUserId,
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

    const publishedProvider =
      audience === "specialist" && status === "active"
        ? await publishProviderFromBotRegistration({
            telegramUserId,
            telegramUsername,
            subscriptionId: subscription.id,
            expiresAt,
            planKey,
          })
        : null;

    const communityJoinUrl =
      status === "active"
        ? await telegramCreateJoinRequestInviteLink(`BayCommunity ${subscription.id}`)
        : null;

    return NextResponse.json({
      ok: true,
      id: subscription.id,
      audience,
      status,
      providerId: preExistingProvider?.id ?? publishedProvider?.id ?? null,
      freeMonths,
      expiresAt: expiresAt?.toISOString() ?? null,
      communityJoinUrl,
      nextStep:
        status === "active"
          ? audience === "specialist" && (preExistingProvider || publishedProvider)
            ? "Obuna tasdiqlandi, profilingiz saytga joylandi. BayCommunity guruhiga kirish uchun bot taklif havolasi orqali ariza yuboring."
            : audience === "specialist"
              ? "Obuna tasdiqlandi. Endi botda ro'yxatdan o'tishni yakunlang, keyin profilingiz saytga joylanadi."
            : "BayCommunity guruhiga kirish uchun bot taklif havolasi orqali ariza yuboring. Bot profilingizni tekshiradi va mos bo'lsa tasdiqlaydi."
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
