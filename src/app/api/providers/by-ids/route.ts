import { NextResponse } from "next/server";
import { db } from "@/db";
import { providers } from "@/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { ids?: unknown };
    const ids = Array.isArray(body.ids)
      ? body.ids.filter((n): n is number => typeof n === "number" && Number.isFinite(n))
      : [];

    if (ids.length === 0) {
      return NextResponse.json({ providers: [] });
    }

    const rows = await db.select().from(providers).where(inArray(providers.id, ids));
    return NextResponse.json({ providers: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
