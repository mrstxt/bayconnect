import { NextResponse } from "next/server";
import { db } from "@/db";
import { visaInquiries } from "@/db/schema";
import {
  clientIp,
  rateLimit,
  readJson,
  validateVisaInquiry,
  hashIp,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Rate limit: 1 daqiqada 3 ta ariza (viza ariza spam'ini oldini olish)
  const ip = clientIp(req);
  const limit = rateLimit(`visa-inquiry:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before submitting again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await readJson<Record<string, unknown>>(req, 16_000);
  if (!body) {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }

  const validation = validateVisaInquiry(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { fullName, email, nationality, passportNumber, arrivalDate, departureDate, visaType, message } = validation.data;

  try {
    const ipHash = await hashIp(ip);

    const [row] = await db
      .insert(visaInquiries)
      .values({
        fullName,
        email,
        nationality,
        passportNumber,
        arrivalDate,
        departureDate,
        visaType,
        message,
        status: "pending",
        ipHash,
      })
      .returning({ id: visaInquiries.id });

    return NextResponse.json(
      { ok: true, id: row.id, message: "Your inquiry has been received. We will contact you within 24 hours." },
      { status: 201 }
    );
  } catch (e) {
    console.error("[api/visa-inquiry] Error:", e);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
