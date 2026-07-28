import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = "https://api.telegram.org";

async function telegramApi<T>(token: string, method: string, body?: Record<string, unknown>) {
  const response = await fetch(`${API}/bot${token}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = (await response.json().catch(() => null)) as T;
  return { ok: response.ok, result };
}

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

  // Telegram faqat https:// (public domen, valid sertifikat) webhookni qabul qiladi.
  // localhost yoki http:// bilan setWebhook chaqirsangiz Telegram rad etadi va
  // bot hech qanday javob bermaydi — bu eng ko'p uchraydigan sozlash xatosi.
  if (!webhookUrl.startsWith("https://")) {
    return NextResponse.json(
      {
        error: "Webhook URL https:// bo'lishi shart",
        webhookUrl,
        hint: "NEXT_PUBLIC_SITE_URL'ga loyihangizning https:// bilan yozilgan public domenini kiriting (masalan, https://bayconnect.vercel.app yoki https://bayconnect.uz), keyin bu endpointni qayta chaqiring. Lokalda test uchun ngrok/cloudflared tunnel kerak.",
      },
      { status: 400 },
    );
  }
  const [me, commands, webhook] = await Promise.all([
    telegramApi(token, "getMe"),
    telegramApi(token, "setMyCommands", {
      commands: [
        { command: "start", description: "Ro'yxatdan o'tishni boshlash" },
        { command: "register", description: "Mutaxassis sifatida ro'yxatdan o'tish" },
      ],
    }),
    telegramApi(token, "setWebhook", {
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: false,
    }),
  ]);

  const info = await telegramApi(token, "getWebhookInfo");

  return NextResponse.json(
    {
      ok: webhook.ok,
      webhookUrl,
      bot: me.result,
      commands: commands.result,
      webhook: webhook.result,
      webhookInfo: info.result,
    },
    { status: webhook.ok ? 200 : 502 },
  );
}
