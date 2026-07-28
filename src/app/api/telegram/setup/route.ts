import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = "https://api.telegram.org";

export async function GET(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const url = new URL(req.url);

  if (!token || !secret) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN va TELEGRAM_WEBHOOK_SECRET env'lari kerak" },
      { status: 500 },
    );
  }

  if (url.searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = `${siteUrl().replace(/\/$/, "")}/api/telegram/webhook`;
  const response = await fetch(`${API}/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ["message", "callback_query"],
    }),
  });

  const result = (await response.json().catch(() => null)) as unknown;
  return NextResponse.json(
    {
      ok: response.ok,
      webhookUrl,
      telegram: result,
    },
    { status: response.ok ? 200 : 502 },
  );
}
