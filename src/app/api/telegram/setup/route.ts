import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = "https://api.telegram.org";
const BOT_COMMANDS = [
  { command: "start", description: "Ro'yxatdan o'tishni boshlash" },
  { command: "register", description: "Mutaxassis sifatida ro'yxatdan o'tish" },
  { command: "delete", description: "Profilni sabab bilan o'chirish" },
];

type WebhookInfo = {
  url?: string;
  allowed_updates?: string[];
  pending_update_count?: number;
  last_error_message?: string;
  last_error_date?: number;
};

const ALLOWED_UPDATES = ["message", "callback_query", "chat_join_request"];

async function telegramApi<T>(token: string, method: string, body?: Record<string, unknown>) {
  const response = await fetch(`${API}/bot${token}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = (await response.json().catch(() => null)) as T;
  return { ok: response.ok, result };
}

/** Telegram xatosidan odam o'qiydigan maslahat chiqaradi. */
function hintFor(result: unknown): string {
  const text = JSON.stringify(result ?? {});
  if (text.includes('"error_code":429') || text.includes("Too Many Requests")) {
    return "Telegram setWebhook'ni vaqtincha chekladi (429) — bu sahifani tez-tez refresh qilishdan bo'ladi. 1–2 daqiqa kuting. Webhook allaqachon o'rnatilgan bo'lsa, qayta sozlash UMUMAN kerak emas — botga /start yuborib sinab ko'ring.";
  }
  if (text.includes("Unauthorized")) {
    return "TELEGRAM_BOT_TOKEN noto'g'ri — @BotFather'dagi token bilan Vercel env'dagini solishtiring.";
  }
  if (text.includes("resolve host") || text.includes("Failed to resolve")) {
    return "Webhook domeni DNS'da topilmayapti — NEXT_PUBLIC_SITE_URL'dagi domen yozuvini tekshiring.";
  }
  return "Tafsilotlar 'webhook' maydonida. Umumiy muammolar: npm run bot:check bajarib ko'ring.";
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

  const me = await telegramApi(token, "getMe");
  const infoBefore = await telegramApi<WebhookInfo>(token, "getWebhookInfo");

  // 1. IDEMPOTENT TEKSHIRUV: webhook allaqachon shu URL'ga o'rnatilgan bo'lsa,
  //    setWebhook'ni qayta chaqirmaymiz — Telegram har bir setWebhook'ni
  //    rate-limit qiladi va takroriy so'rovlar 429 bilan rad etilardi.
  //    (?force=1 bilan majburlash mumkin — masalan, secret almashtirilganda.)
  const force = url.searchParams.get("force") === "1";
  const currentAllowed = infoBefore.result?.allowed_updates ?? [];
  const allowedUpdatesOk = ALLOWED_UPDATES.every((update) => currentAllowed.includes(update));
  const alreadySet = infoBefore.ok && infoBefore.result?.url === webhookUrl && allowedUpdatesOk;

  if (alreadySet && !force) {
    const commands = await telegramApi(token, "setMyCommands", { commands: BOT_COMMANDS });
    return NextResponse.json({
      ok: true,
      alreadyConfigured: true,
      webhookUrl,
      bot: me.result,
      commands: commands.result,
      webhookInfo: infoBefore.result,
      hint: "Webhook allaqachon to'g'ri o'rnatilgan — buyruqlar menyusi yangilandi. Botga /delete yuborib sinang. Agar bot javob bermasa, sababini buyruqdan ko'ring: npm run bot:check. Secret'ni almashtirgan bo'lsangiz: ?force=1 qo'shib qayta chaqiring.",
    });
  }

  // 2. To'liq sozlash (webhook o'rnatilmagan yoki force rejimi)
  const [commands, webhook] = await Promise.all([
    telegramApi(token, "setMyCommands", { commands: BOT_COMMANDS }),
    telegramApi(token, "setWebhook", {
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ALLOWED_UPDATES,
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
      // 502 holatida ham foydalanuvchi nima qilishini darhol tushunsin.
      ...(webhook.ok ? {} : { hint: hintFor(webhook.result) }),
    },
    { status: webhook.ok ? 200 : 502 },
  );
}
