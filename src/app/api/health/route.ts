import { db } from "@/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deploydan keyin ulanishni tekshirish uchun:
 *   GET /api/health  →  { ok: true, latencyMs: 12 }
 */
export async function GET() {
  const started = Date.now();
  try {
    await db.execute(sql`select 1`);
    return Response.json(
      { ok: true, latencyMs: Date.now() - started },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    console.error("[api/health] DB ulanmadi:", e);
    return Response.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "unknown",
        hint: "DATABASE_URL to'g'ri ekanini va `npm run db:push` bajarilganini tekshiring.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
