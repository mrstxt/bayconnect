import { NextResponse } from "next/server";
import { getProvidersByIds } from "@/lib/queries";
import { clientIp, rateLimit, readJson } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Sevimlilar sahifasi bir marta so'raydigan maksimal element soni. */
const MAX_IDS = 60;

export async function POST(req: Request) {
  const limit = rateLimit(`by-ids:${clientIp(req)}`, { limit: 60, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Juda ko'p so'rov" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await readJson<{ ids?: unknown }>(req);
  if (!body) {
    return NextResponse.json({ error: "So'rov formati noto'g'ri" }, { status: 400 });
  }

  // Takrorlarni olib tashlaymiz va sonini cheklaymiz — 10 000 ta ID bilan
  // kelgan so'rov butun jadvalni tortib olmasin.
  const ids = Array.isArray(body.ids)
    ? [
        ...new Set(
          body.ids.filter(
            (n): n is number => typeof n === "number" && Number.isSafeInteger(n) && n > 0,
          ),
        ),
      ].slice(0, MAX_IDS)
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ providers: [] });
  }

  try {
    const rows = await getProvidersByIds(ids);
    return NextResponse.json(
      { providers: rows },
      // Brauzer 60 soniya davomida qayta so'ramasin.
      { headers: { "Cache-Control": "private, max-age=60" } },
    );
  } catch (e) {
    console.error("[api/providers/by-ids] xato:", e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
