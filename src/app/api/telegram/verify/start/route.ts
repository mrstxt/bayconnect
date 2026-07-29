import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { telegramVerifications } from "@/db/schema";
import { clean, clientIp, rateLimit, readJson } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function botUsername() {
  const configured = (process.env.TELEGRAM_BOT_USERNAME ?? process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "")
    .replace(/^@+/, "")
    .trim();
  if (configured) return configured;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return "";

  const response = await fetch(`https://api.telegram.org/bot${token}/getMe`, { cache: "no-store" }).catch(() => null);
  if (!response?.ok) return "";
  const json = (await response.json().catch(() => null)) as { result?: { username?: string } } | null;
  return json?.result?.username ?? "";
}

export async function POST(req: Request) {
  const limit = rateLimit(`telegram-verify:${clientIp(req)}`, { limit: 20, windowMs: 60 * 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Bir ozdan keyin qayta urinib ko'ring." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await readJson<{ audience?: unknown }>(req);
  const audience = clean(body?.audience, 30) === "specialist" ? "specialist" : "community";
  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60_000);
  await db.insert(telegramVerifications).values({ token, expiresAt, updatedAt: new Date() });
  const username = await botUsername();
  if (!username) {
    return NextResponse.json(
      { error: "Telegram bot username sozlanmagan. TELEGRAM_BOT_USERNAME env qo'shing." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    token,
    botUrl: `https://t.me/${username}?start=verify_${token}_${audience}`,
  });
}
