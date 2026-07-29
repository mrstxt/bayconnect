import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { providers, telegramRegistrations } from "@/db/schema";
import { CACHE_TAGS } from "@/lib/queries";
import { clean, cleanMultiline, isValidEmail, isValidPhone } from "@/lib/validation";
import { telegramSendMessage } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramUser = { id: number; first_name?: string; last_name?: string; username?: string };
type TelegramUpdate = {
  message?: { chat: { id: number }; from?: TelegramUser; text?: string; contact?: { phone_number: string; user_id?: number } };
  callback_query?: { id: string; data?: string; message?: { chat: { id: number } }; from: TelegramUser };
};

type Registration = { chatId: string; telegramUserId: string; fullName: string; username: string; phone: string; step: string; data: Record<string, string> };

const categoryKeyboard = { inline_keyboard: [[
  { text: "🕌 Gid", callback_data: "register:category:guide" },
  { text: "✈️ Transfer", callback_data: "register:category:transfer" },
]] };

// Email qadamini o'tkazib yuborish matni (tugma va /skip buyrug'i).
const SKIP_EMAIL_TEXT = "⏭ O'tkazib yuborish";

function commandOf(text: string): string {
  const first = text.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  // Public/group botlarda Telegram commandni /start@BotUsername shaklida yuboradi.
  return first.replace(/@\w+$/, "");
}

async function save(reg: Registration) {
  await db.insert(telegramRegistrations).values({ ...reg, updatedAt: new Date() })
    .onConflictDoUpdate({ target: telegramRegistrations.chatId, set: { telegramUserId: reg.telegramUserId, fullName: reg.fullName, username: reg.username, phone: reg.phone, step: reg.step, data: reg.data, updatedAt: new Date() } });
}
async function answerCallback(id: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (token) await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ callback_query_id: id }) }).catch(() => undefined);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "telegram-webhook",
    botTokenConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    webhookSecretConfigured: Boolean(process.env.TELEGRAM_WEBHOOK_SECRET),
  });
}

export async function POST(req: Request) {
  // URL'dagi maxfiy kalit webhookni begona POST'lardan himoya qiladi.
  if (!process.env.TELEGRAM_BOT_TOKEN || req.headers.get("x-telegram-bot-api-secret-token") !== process.env.TELEGRAM_WEBHOOK_SECRET) return new NextResponse("Unauthorized", { status: 401 });
  const update = await req.json().catch(() => null) as TelegramUpdate | null;
  if (!update) return NextResponse.json({ ok: true });

  const callback = update.callback_query;
  const message = update.message;
  const chatId = String(callback?.message?.chat.id ?? message?.chat.id ?? "");
  const from = callback?.from ?? message?.from;
  if (!chatId || !from) return NextResponse.json({ ok: true });

  try {
  const [stored] = await db.select().from(telegramRegistrations).where(eq(telegramRegistrations.chatId, chatId)).limit(1);
  let reg: Registration = stored ?? { chatId, telegramUserId: String(from.id), fullName: [from.first_name, from.last_name].filter(Boolean).join(" "), username: from.username ?? "", phone: "", step: "start", data: {} };
  reg = { ...reg, telegramUserId: String(from.id), fullName: reg.fullName || [from.first_name, from.last_name].filter(Boolean).join(" "), username: from.username ?? reg.username };

  if (callback?.data?.startsWith("register:category:")) {
    await answerCallback(callback.id);
    reg.data.category = callback.data.split(":")[2] === "transfer" ? "transfer" : "guide";
    reg.step = "city";
    await save(reg);
    await telegramSendMessage(chatId, "Qaysi shaharda xizmat ko'rsatasiz?\nMasalan: Toshkent, Samarqand yoki Buxoro.");
    return NextResponse.json({ ok: true });
  }

  const text = clean(message?.text, 2000);
  const command = commandOf(text);
  if (command === "/start" || command === "/register" || text === "Ro'yxatdan o'tish") {
    if (reg.step === "done") {
      await telegramSendMessage(chatId, "Siz allaqachon ro'yxatdan o'tgansiz. Yangi buyurtmalar shu botga keladi.");
      return NextResponse.json({ ok: true });
    }
    reg = { ...reg, step: "phone", data: {}, phone: "" };
    await save(reg);
    await telegramSendMessage(chatId, "BayConnect ro'yxatdan o'tishiga xush kelibsiz. Telefon raqamingizni yuboring — buyurtmalar shu bot orqali keladi.", { reply_markup: { keyboard: [[{ text: "📱 Telefon raqamni yuborish", request_contact: true }]], resize_keyboard: true, one_time_keyboard: true } });
    return NextResponse.json({ ok: true });
  }

  if (message?.contact && reg.step === "phone") {
    // Faqat egasining contact'i qabul qilinadi; boshqa kishining raqamini yuborib bo'lmaydi.
    if (message.contact.user_id !== from.id || !isValidPhone(message.contact.phone_number)) {
      await telegramSendMessage(chatId, "Iltimos, pastdagi tugma orqali o'zingizning telefon raqamingizni yuboring.");
      return NextResponse.json({ ok: true });
    }
    reg.phone = message.contact.phone_number;
    reg.step = "fullName";
    await save(reg);
    await telegramSendMessage(
      chatId,
      "Rahmat! Endi to'liq ismingizni yozing — saytdagi profilingizda aynan shu ko'rinadi.\nMasalan: Sardor Karimov",
      {
        reply_markup: {
          // Telegram'dagi ismini bir bosishda ishlatish imkoniyati
          keyboard: reg.fullName ? [[{ text: reg.fullName }]] : [],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    );
    return NextResponse.json({ ok: true });
  }

  if (!text) return NextResponse.json({ ok: true });
  if (reg.step === "fullName") {
    const fullName = clean(text, 160);
    if (fullName.length < 2) {
      await telegramSendMessage(chatId, "Ism kamida 2 belgidan iborat bo'lsin. Qayta yozing.\nMasalan: Sardor Karimov");
      return NextResponse.json({ ok: true });
    }
    reg.fullName = fullName;
    reg.step = "email";
    await save(reg);
    await telegramSendMessage(
      chatId,
      "Email manzilingiz — faqat saytdagi aloqa bloki uchun ko'rinadi (ixtiyoriy).\nYozing yoki o'tkazib yuboring:",
      { reply_markup: { keyboard: [[{ text: SKIP_EMAIL_TEXT }]], resize_keyboard: true, one_time_keyboard: true } },
    );
  } else if (reg.step === "email") {
    if (text === SKIP_EMAIL_TEXT || text === "/skip") {
      reg.data.email = "";
    } else if (isValidEmail(clean(text, 160))) {
      reg.data.email = clean(text, 160).toLowerCase();
    } else {
      await telegramSendMessage(
        chatId,
        "Email formati xato ko'rinmoqda. Qayta yozing yoki \"" + SKIP_EMAIL_TEXT + "\" tugmasini bosing.",
      );
      return NextResponse.json({ ok: true });
    }
    reg.step = "category";
    await save(reg);
    await telegramSendMessage(chatId, "Xizmat turini tanlang:", { reply_markup: categoryKeyboard });
  } else if (reg.step === "city") {
    reg.data.city = clean(text, 80); reg.step = "languages";
    await save(reg); await telegramSendMessage(chatId, "Qaysi tillarda xizmat qilasiz? Vergul bilan yozing.\nMasalan: O'zbek, Rus, Ingliz");
  } else if (reg.step === "languages") {
    reg.data.languages = clean(text, 300); reg.step = "price";
    await save(reg); await telegramSendMessage(chatId, "Kunlik narxingizni AQSh dollarida yozing. Masalan: 50");
  } else if (reg.step === "price") {
    const price = Number(text.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(price) || price < 1 || price > 10000) { await telegramSendMessage(chatId, "Narx 1 dan 10000 USD gacha bo'lishi kerak. Qayta yuboring."); return NextResponse.json({ ok: true }); }
    reg.data.pricePerDay = String(Math.trunc(price)); reg.step = "experience";
    await save(reg); await telegramSendMessage(chatId, "Ish tajribangiz necha yil?");
  } else if (reg.step === "experience") {
    const years = Number(text);
    if (!Number.isInteger(years) || years < 0 || years > 80) { await telegramSendMessage(chatId, "Tajribani 0 dan 80 gacha son bilan yozing."); return NextResponse.json({ ok: true }); }
    reg.data.experienceYears = String(years); reg.step = "bio";
    await save(reg); await telegramSendMessage(chatId, "O'zingiz va xizmatingiz haqida qisqacha yozing (kamida 20 belgi).");
  } else if (reg.step === "bio") {
    const bio = cleanMultiline(text, 2000);
    if (bio.length < 20) { await telegramSendMessage(chatId, "Tavsif kamida 20 belgidan iborat bo'lsin. Qayta yozing."); return NextResponse.json({ ok: true }); }
    const languages = (reg.data.languages ?? "").split(",").map((x) => clean(x, 40)).filter(Boolean).slice(0, 12);
    const [provider] = await db.insert(providers).values({ fullName: reg.fullName || "BayConnect mutaxassisi", category: reg.data.category, city: reg.data.city, languages, pricePerDay: Number(reg.data.pricePerDay), experienceYears: Number(reg.data.experienceYears), bio, phone: reg.phone, email: reg.data.email || `telegram-${from.id}@bayconnect.local`, telegramChatId: chatId, telegramUsername: reg.username || null, avatarEmoji: reg.data.category === "transfer" ? "✈️" : "🕌", coverColor: reg.data.category === "transfer" ? "blue" : "orange" }).returning({ id: providers.id });
    reg.step = "done"; await save(reg); revalidateTag(CACHE_TAGS.providers, "max");
    await telegramSendMessage(chatId, `✅ Ro'yxatdan o'tish yakunlandi! Profilingiz saytda e'lon qilindi:\n${process.env.NEXT_PUBLIC_SITE_URL ?? "https://bayconnect.uz"}/providers/${provider.id}`, { reply_markup: { remove_keyboard: true } });
  } else {
    await telegramSendMessage(chatId, "Ro'yxatdan o'tish uchun /start buyrug'ini bosing.");
  }
  return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telegram/webhook] xato:", error);
    await telegramSendMessage(
      chatId,
      "Bot vaqtincha sozlanmoqda. Iltimos, birozdan keyin /start buyrug'ini qayta yuboring.",
    );
    return NextResponse.json({ ok: true });
  }
}
