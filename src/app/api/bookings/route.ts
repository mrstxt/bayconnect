import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, providers } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  clean,
  cleanMultiline,
  clientIp,
  isValidEmail,
  isValidIsoDate,
  isValidPhone,
  rateLimit,
  readJson,
  todayIso,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  providerId?: unknown;
  clientName?: unknown;
  clientEmail?: unknown;
  clientPhone?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  peopleCount?: unknown;
  message?: unknown;
};

/** Bron oralig'i uchun maksimal muddat (kun). */
const MAX_TRIP_DAYS = 365;

export async function POST(req: Request) {
  // Spam va double-submit himoyasi: 1 daqiqada 5 ta zayavka.
  const limit = rateLimit(`booking:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Biroz kuting va qayta yuboring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await readJson<Body>(req);
  if (!body) {
    return NextResponse.json({ error: "So'rov formati noto'g'ri" }, { status: 400 });
  }

  const providerId = Number(body.providerId);
  const clientName = clean(body.clientName, 160);
  const clientEmail = clean(body.clientEmail, 160).toLowerCase();
  const clientPhone = clean(body.clientPhone, 40);
  const startDate = clean(body.startDate, 20);
  const endDate = clean(body.endDate, 20);
  const peopleCount = Number(body.peopleCount ?? 1);
  const message = cleanMultiline(body.message, 1000);

  if (!Number.isSafeInteger(providerId) || providerId <= 0) {
    return NextResponse.json({ error: "Mutaxassis tanlanmagan" }, { status: 400 });
  }

  if (!clientName || !clientEmail || !clientPhone || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Barcha majburiy maydonlarni to'ldiring" },
      { status: 400 },
    );
  }

  if (clientName.length < 2) {
    return NextResponse.json({ error: "Ism juda qisqa" }, { status: 400 });
  }

  if (!isValidEmail(clientEmail)) {
    return NextResponse.json({ error: "Email noto'g'ri" }, { status: 400 });
  }

  if (!isValidPhone(clientPhone)) {
    return NextResponse.json(
      { error: "Telefon raqami noto'g'ri. Namuna: +998 90 123 45 67" },
      { status: 400 },
    );
  }

  // Eski kodda sanalar faqat satr sifatida solishtirilardi ("2025-13-45" ham o'tardi).
  if (!isValidIsoDate(startDate) || !isValidIsoDate(endDate)) {
    return NextResponse.json({ error: "Sana formati noto'g'ri" }, { status: 400 });
  }

  if (endDate < startDate) {
    return NextResponse.json(
      { error: "Tugash sanasi boshlanish sanasidan oldin bo'lishi mumkin emas" },
      { status: 400 },
    );
  }

  if (startDate < todayIso()) {
    return NextResponse.json(
      { error: "O'tgan sanaga zayavka yuborib bo'lmaydi" },
      { status: 400 },
    );
  }

  const days =
    (Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86_400_000;
  if (days > MAX_TRIP_DAYS) {
    return NextResponse.json(
      { error: `Sayohat muddati ${MAX_TRIP_DAYS} kundan oshmasligi kerak` },
      { status: 400 },
    );
  }

  if (!Number.isFinite(peopleCount) || peopleCount < 1 || peopleCount > 50) {
    return NextResponse.json(
      { error: "Odam soni 1 dan 50 gacha bo'lishi kerak" },
      { status: 400 },
    );
  }

  try {
    const [provider] = await db
      .select({ id: providers.id })
      .from(providers)
      .where(eq(providers.id, providerId))
      .limit(1);

    if (!provider) {
      return NextResponse.json({ error: "Mutaxassis topilmadi" }, { status: 404 });
    }

    const [row] = await db
      .insert(bookings)
      .values({
        providerId,
        clientName,
        clientEmail,
        clientPhone,
        startDate,
        endDate,
        peopleCount: Math.trunc(peopleCount),
        message,
      })
      .returning({ id: bookings.id });

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (e) {
    console.error("[api/bookings] xato:", e);
    return NextResponse.json({ error: "Server xatosi. Keyinroq urinib ko'ring." }, { status: 500 });
  }
}
