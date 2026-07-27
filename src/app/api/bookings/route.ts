import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, providers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      providerId?: number;
      clientName?: string;
      clientEmail?: string;
      clientPhone?: string;
      startDate?: string;
      endDate?: string;
      peopleCount?: number;
      message?: string;
    };

    const clientName = body.clientName?.trim() ?? "";
    const clientEmail = body.clientEmail?.trim() ?? "";
    const clientPhone = body.clientPhone?.trim() ?? "";
    const startDate = body.startDate?.trim() ?? "";
    const endDate = body.endDate?.trim() ?? "";
    const peopleCount = Number(body.peopleCount ?? 1);

    if (
      !body.providerId ||
      !clientName ||
      !clientEmail ||
      !clientPhone ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        { error: "Barcha majburiy maydonlarni to'ldiring" },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      return NextResponse.json({ error: "Email noto'g'ri" }, { status: 400 });
    }

    if (endDate < startDate) {
      return NextResponse.json(
        { error: "Tugash sanasi boshlanish sanasidan oldin bo'lishi mumkin emas" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(peopleCount) || peopleCount < 1 || peopleCount > 50) {
      return NextResponse.json(
        { error: "Odam soni 1 dan 50 gacha bo'lishi kerak" },
        { status: 400 },
      );
    }

    const [p] = await db
      .select({ id: providers.id })
      .from(providers)
      .where(eq(providers.id, body.providerId));

    if (!p) {
      return NextResponse.json({ error: "Mutaxassis topilmadi" }, { status: 404 });
    }

    const [row] = await db
      .insert(bookings)
      .values({
        providerId: body.providerId,
        clientName,
        clientEmail,
        clientPhone,
        startDate,
        endDate,
        peopleCount,
        message: body.message?.trim() ?? "",
      })
      .returning({ id: bookings.id });

    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
