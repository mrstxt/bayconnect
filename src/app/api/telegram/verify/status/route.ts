import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { telegramVerifications } from "@/db/schema";
import { clean } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = clean(url.searchParams.get("token") ?? "", 80);
  if (!/^[a-f0-9]{48}$/.test(token)) {
    return NextResponse.json({ error: "Tasdiqlash tokeni noto'g'ri" }, { status: 400 });
  }

  const [row] = await db
    .select()
    .from(telegramVerifications)
    .where(eq(telegramVerifications.token, token))
    .limit(1);

  if (!row) return NextResponse.json({ error: "Tasdiqlash topilmadi" }, { status: 404 });
  if (row.expiresAt <= new Date()) {
    return NextResponse.json({ ok: true, status: "expired" });
  }

  return NextResponse.json({
    ok: true,
    status: row.status,
    telegramUsername: row.telegramUsername,
    telegramUserId: row.telegramUserId,
  });
}
