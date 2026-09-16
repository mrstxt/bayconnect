import { NextResponse } from "next/server";
import { db } from "@/db";
import { experienceBookings } from "@/db/schema";
import {
  clientIp,
  rateLimit,
  readJson,
  validateExpBooking,
  hashIp,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Rate limit: 1 daqiqada 5 ta bron
  const ip = clientIp(req);
  const limit = rateLimit(`exp-booking:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await readJson<Record<string, unknown>>(req, 16_000);
  if (!body) {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }

  const validation = validateExpBooking(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const data = validation.data;

  try {
    const ipHash = await hashIp(ip);

    const [row] = await db
      .insert(experienceBookings)
      .values({
        experienceKey:      data.experienceKey,
        clientName:         data.clientName,
        clientEmail:        data.clientEmail,
        clientPhone:        data.clientPhone,
        clientNationality:  data.clientNationality,
        preferredLang:      data.preferredLang,
        date:               data.date,
        peopleCount:        data.peopleCount,
        message:            data.message,
        status:             "pending",
        ipHash,
      })
      .returning({ id: experienceBookings.id });

    return NextResponse.json(
      { ok: true, id: row.id, message: "Booking received! We will confirm shortly." },
      { status: 201 }
    );
  } catch (e) {
    console.error("[api/experience-bookings] Error:", e);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
