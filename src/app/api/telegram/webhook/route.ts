import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { and, desc, eq, gt, or } from "drizzle-orm";
import { db } from "@/db";
import {
  communityAccessRequests,
  providers,
  subscriptions,
  telegramRegistrations,
  telegramVerifications,
} from "@/db/schema";
import { CACHE_TAGS } from "@/lib/queries";
import { clean, cleanMultiline, isValidEmail, isValidPhone } from "@/lib/validation";
import {
  telegramApproveChatJoinRequest,
  telegramDeleteMessage,
  telegramDeclineChatJoinRequest,
  telegramSendMessage,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramUser = { id: number; first_name?: string; last_name?: string; username?: string };
type TelegramUpdate = {
  message?: {
    message_id?: number;
    chat: { id: number };
    from?: TelegramUser;
    text?: string;
    contact?: { phone_number: string; user_id?: number };
    new_chat_members?: TelegramUser[];
    left_chat_member?: TelegramUser;
  };
  callback_query?: { id: string; data?: string; message?: { chat: { id: number } }; from: TelegramUser };
  chat_join_request?: { chat: { id: number }; from: TelegramUser; date: number; bio?: string; invite_link?: unknown };
};

type Registration = { chatId: string; telegramUserId: string; fullName: string; username: string; phone: string; step: string; data: Record<string, string> };

const categoryKeyboard = {
  inline_keyboard: [
    [
      { text: "🕌 Gid", callback_data: "register:category:guide" },
      { text: "✈️ Transfer", callback_data: "register:category:transfer" },
    ],
    [
      { text: "🌍 Tur operator", callback_data: "register:category:tour_agent" },
      { text: "🗣️ Tarjimon", callback_data: "register:category:translator" },
    ],
    [{ text: "🤝 Turizm xizmati", callback_data: "register:category:tourism_service" }],
  ],
};

const transferKeyboard = {
  inline_keyboard: [
    [
      { text: "🚗 Yengil avto", callback_data: "register:transfer:sedan" },
      { text: "🚐 Minivan", callback_data: "register:transfer:minivan" },
    ],
    [
      { text: "🚙 Yo'ltanlamas", callback_data: "register:transfer:suv" },
      { text: "🚌 Avtobus", callback_data: "register:transfer:bus" },
    ],
    [{ text: "✈️ Aeroport transfer", callback_data: "register:transfer:airport" }],
  ],
};

// Email qadamini o'tkazib yuborish matni (tugma va /skip buyrug'i).
const SKIP_EMAIL_TEXT = "⏭ O'tkazib yuborish";
const MIN_DELETE_REASON_LENGTH = 5;

function commandOf(text: string): string {
  const first = text.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  // Public/group botlarda Telegram commandni /start@BotUsername shaklida yuboradi.
  return first.replace(/@\w+$/, "");
}

function commandPayload(text: string): string {
  return clean(text.trim().split(/\s+/).slice(1).join(" "), 120);
}

function normalizeUsername(value: string | undefined): string {
  return clean(value ?? "", 80).replace(/^@+/, "").toLowerCase();
}

function siteUrl(path = "/register") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bayconnect.uz";
  return `${base}${path}`;
}

async function hasVerifiedTelegramProfile(userId: string, username: string) {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) return false;
  const [verification] = await db
    .select({ token: telegramVerifications.token })
    .from(telegramVerifications)
    .where(
      and(
        eq(telegramVerifications.status, "verified"),
        eq(telegramVerifications.telegramUserId, userId),
        eq(telegramVerifications.telegramUsername, normalizedUsername),
      ),
    )
    .limit(1);
  return Boolean(verification);
}

async function findExistingProviderForTelegram(params: {
  telegramUserId: string;
  telegramUsername: string;
  chatId: string;
  phone?: string;
}) {
  const { telegramUserId, telegramUsername, chatId, phone = "" } = params;
  return db
    .select({ id: providers.id, fullName: providers.fullName })
    .from(providers)
    .where(
      phone
        ? or(
            eq(providers.telegramUserId, telegramUserId),
            eq(providers.telegramUsername, telegramUsername),
            eq(providers.telegramChatId, chatId),
            eq(providers.phone, phone),
          )
        : or(
            eq(providers.telegramUserId, telegramUserId),
            eq(providers.telegramUsername, telegramUsername),
            eq(providers.telegramChatId, chatId),
          ),
    )
    .limit(1);
}

async function save(reg: Registration) {
  await db.insert(telegramRegistrations).values({ ...reg, updatedAt: new Date() })
    .onConflictDoUpdate({ target: telegramRegistrations.chatId, set: { telegramUserId: reg.telegramUserId, fullName: reg.fullName, username: reg.username, phone: reg.phone, step: reg.step, data: reg.data, updatedAt: new Date() } });
}

async function beginSpecialistRegistration(chatId: string, reg: Registration) {
  const next = { ...reg, step: "phone", data: {}, phone: "" };
  await save(next);
  await telegramSendMessage(
    chatId,
    "✅ Profil tasdiqlandi. Mutaxassis sifatida ro'yxatdan o'tishni boshlaymiz.\n\nTelefon raqamingizni yuboring — buyurtmalar shu bot orqali keladi.",
    {
      reply_markup: {
        keyboard: [[{ text: "📱 Telefon raqamni yuborish", request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    },
  );
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

  if (update.chat_join_request) {
    const communityChatId = process.env.TELEGRAM_COMMUNITY_CHAT_ID;
    const request = update.chat_join_request;
    const joinChatId = String(request.chat.id);
    const userId = String(request.from.id);
    const username = normalizeUsername(request.from.username);

    if (communityChatId && joinChatId === communityChatId) {
      const now = new Date();
      const [access] = username
        ? await db
            .select()
            .from(communityAccessRequests)
            .where(
              and(
                eq(communityAccessRequests.telegramUsername, username),
                or(eq(communityAccessRequests.status, "approved"), eq(communityAccessRequests.status, "joined")),
                gt(communityAccessRequests.approvedUntil, now),
              ),
            )
            .orderBy(desc(communityAccessRequests.createdAt))
            .limit(1)
        : [];

      const [providerSub] = await db
        .select({ id: subscriptions.id })
        .from(subscriptions)
        .where(
          and(
            username
              ? or(eq(subscriptions.telegramUserId, userId), eq(subscriptions.telegramUsername, username))
              : eq(subscriptions.telegramUserId, userId),
            eq(subscriptions.audience, "specialist"),
            eq(subscriptions.status, "active"),
            gt(subscriptions.expiresAt, now),
          ),
        )
        .limit(1);

      if (access || providerSub) {
        const ok = await telegramApproveChatJoinRequest(joinChatId, userId);
        if (ok && access) {
          await db
            .update(communityAccessRequests)
            .set({ telegramUserId: userId, status: "joined", joinedAt: now, updatedAt: now })
            .where(eq(communityAccessRequests.id, access.id));
        }
      } else {
        await telegramDeclineChatJoinRequest(joinChatId, userId);
      }
    }

    return NextResponse.json({ ok: true });
  }

  const serviceMessage = update.message;
  if (
    serviceMessage?.message_id &&
    (serviceMessage.new_chat_members?.length || serviceMessage.left_chat_member)
  ) {
    const communityChatId = process.env.TELEGRAM_COMMUNITY_CHAT_ID;
    const serviceChatId = String(serviceMessage.chat.id);
    if (communityChatId && serviceChatId === communityChatId) {
      await telegramDeleteMessage(serviceChatId, serviceMessage.message_id);
    }
    return NextResponse.json({ ok: true });
  }

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
    const category = callback.data.split(":")[2] ?? "guide";
    reg.data.category = ["guide", "transfer", "tour_agent", "translator", "tourism_service"].includes(category)
      ? category
      : "guide";
    reg.step = reg.data.category === "transfer" ? "transferType" : "city";
    await save(reg);
    await telegramSendMessage(
      chatId,
      reg.data.category === "transfer"
        ? "Avtomobil turini tanlang:"
        : "Qaysi shaharda xizmat ko'rsatasiz?\nMasalan: Toshkent, Samarqand yoki Buxoro.",
      reg.data.category === "transfer" ? { reply_markup: transferKeyboard } : {},
    );
    return NextResponse.json({ ok: true });
  }

  if (callback?.data?.startsWith("register:transfer:")) {
    await answerCallback(callback.id);
    const type = callback.data.split(":")[2] ?? "";
    reg.data.subCategory = ["sedan", "minivan", "suv", "bus", "airport"].includes(type) ? type : "sedan";
    reg.step = "capacity";
    await save(reg);
    await telegramSendMessage(chatId, "Avtomobilingizda nechta yo'lovchi o'rni bor? Masalan: 4");
    return NextResponse.json({ ok: true });
  }

  const text = clean(message?.text, 2000);
  const command = commandOf(text);
  const payload = commandPayload(text);

  if (command === "/start" && payload.startsWith("verify_")) {
    const [, token = "", audience = "community"] = payload.match(/^verify_([a-f0-9]{48})(?:_(specialist|community))?$/) ?? [];
    if (!/^[a-f0-9]{48}$/.test(token)) {
      await telegramSendMessage(chatId, "Tasdiqlash havolasi noto'g'ri. Saytdan qayta urinib ko'ring.");
      return NextResponse.json({ ok: true });
    }
    if (!from.username) {
      await telegramSendMessage(
        chatId,
        "Telegram username topilmadi. Telegram sozlamalaridan username oching, keyin saytdan qayta tasdiqlang.",
      );
      return NextResponse.json({ ok: true });
    }

    const now = new Date();
    const [verification] = await db
      .select()
      .from(telegramVerifications)
      .where(eq(telegramVerifications.token, token))
      .limit(1);

    if (!verification || verification.expiresAt <= now) {
      await telegramSendMessage(chatId, "Tasdiqlash muddati tugagan. Saytga qaytib, qayta tasdiqlang.");
      return NextResponse.json({ ok: true });
    }

    await db
      .update(telegramVerifications)
      .set({
        telegramUserId: String(from.id),
        telegramUsername: normalizeUsername(from.username),
        status: "verified",
        updatedAt: now,
      })
      .where(eq(telegramVerifications.token, token));

    if (audience === "specialist") {
      const [existingProvider] = await findExistingProviderForTelegram({
        telegramUserId: String(from.id),
        telegramUsername: normalizeUsername(from.username),
        chatId,
      });

      if (existingProvider) {
        reg.step = "done";
        await save(reg);
        await telegramSendMessage(
          chatId,
          `✅ Telegram profilingiz tasdiqlandi: @${from.username}\n\nSiz allaqachon hamkor sifatida ro'yxatdan o'tgansiz.\nProfil: ${existingProvider.fullName}\n${siteUrl(`/providers/${existingProvider.id}`)}`,
          { reply_markup: { remove_keyboard: true } },
        );
        return NextResponse.json({ ok: true });
      }

      if (reg.step === "profileReady") {
        await telegramSendMessage(
          chatId,
          `✅ Telegram profilingiz tasdiqlandi: @${from.username}\n\nProfil ma'lumotlaringiz tayyor. Endi saytga qaytib tarifni tanlang va obunani tasdiqlang:\n${siteUrl("/register")}`,
          { reply_markup: { remove_keyboard: true } },
        );
        return NextResponse.json({ ok: true });
      }

      await beginSpecialistRegistration(chatId, reg);
    } else {
      await telegramSendMessage(
        chatId,
        `✅ Telegram profilingiz tasdiqlandi: @${from.username}\n\nEndi saytga qaytib, promokod yoki to'lov orqali community obunasini yoqing.`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Saytga qaytish", url: siteUrl("/register") }]],
          },
        },
      );
    }
    return NextResponse.json({ ok: true });
  }

  if (command === "/start" && !payload) {
    const [existingProvider] = await findExistingProviderForTelegram({
      telegramUserId: String(from.id),
      telegramUsername: normalizeUsername(from.username ?? reg.username),
      chatId,
    });

    if (existingProvider) {
      reg.step = "done";
      await save(reg);
      await telegramSendMessage(
        chatId,
        `Profilingiz tasdiqlangan va saytda bor.\n\nProfil: ${existingProvider.fullName}\n${siteUrl(`/providers/${existingProvider.id}`)}\n\nCommunity yoki tarif obunasini boshqarish uchun saytga qayting: ${siteUrl("/register")}`,
        { reply_markup: { remove_keyboard: true } },
      );
      return NextResponse.json({ ok: true });
    }

    if (reg.step === "profileReady") {
      await telegramSendMessage(
        chatId,
        `Profil ma'lumotlaringiz tayyor. Endi saytga o'tib tarif obunasini tasdiqlang:\n${siteUrl("/register")}`,
        { reply_markup: { remove_keyboard: true } },
      );
      return NextResponse.json({ ok: true });
    }

    const verified = await hasVerifiedTelegramProfile(String(from.id), from.username ?? reg.username);
    if (verified) {
      await beginSpecialistRegistration(chatId, reg);
      return NextResponse.json({ ok: true });
    }

    await telegramSendMessage(
      chatId,
      `BayConnect botiga xush kelibsiz.\n\nOddiy community obunasi uchun saytga qaytib Telegram profilingizni tasdiqlang. Mutaxassis bo'lish uchun ham avval saytda tarif kartasidan Telegram tasdiqlashni boshlang:\n${siteUrl("/register")}`,
      { reply_markup: { remove_keyboard: true } },
    );
    return NextResponse.json({ ok: true });
  }

  if (command === "/delete") {
    const [provider] = await db
      .select({ id: providers.id, fullName: providers.fullName })
      .from(providers)
      .where(eq(providers.telegramChatId, chatId))
      .limit(1);

    if (!provider) {
      reg.step = reg.step === "deleteReason" ? "done" : reg.step;
      await save(reg);
      await telegramSendMessage(chatId, "Sizda o'chiriladigan faol profil topilmadi. Yangi profil ochish uchun /start bosing.");
      return NextResponse.json({ ok: true });
    }

    reg.step = "deleteReason";
    reg.data = {
      ...reg.data,
      deleteProviderId: String(provider.id),
      deleteProviderName: provider.fullName,
    };
    await save(reg);
    await telegramSendMessage(
      chatId,
      `Profilingizni o'chirish uchun sababini yozing.\n\nProfil: ${provider.fullName}\nBekor qilish uchun /cancel yuboring.`,
      { reply_markup: { remove_keyboard: true } },
    );
    return NextResponse.json({ ok: true });
  }

  if (command === "/cancel" && reg.step === "deleteReason") {
    reg.step = "done";
    const data = { ...reg.data };
    delete data.deleteProviderId;
    delete data.deleteProviderName;
    reg.data = data;
    await save(reg);
    await telegramSendMessage(chatId, "Profilni o'chirish bekor qilindi.");
    return NextResponse.json({ ok: true });
  }

  if (command === "/start" || command === "/register" || text === "Ro'yxatdan o'tish") {
    const [existingProvider] = await findExistingProviderForTelegram({
      telegramUserId: String(from.id),
      telegramUsername: normalizeUsername(from.username ?? reg.username),
      chatId,
      phone: reg.phone,
    });

    if (existingProvider) {
      reg.step = "done";
      await save(reg);
      await telegramSendMessage(
        chatId,
        `Siz allaqachon hamkor sifatida ro'yxatdan o'tgansiz.\n\nProfil: ${existingProvider.fullName}\n${siteUrl(`/providers/${existingProvider.id}`)}`,
        { reply_markup: { remove_keyboard: true } },
      );
      return NextResponse.json({ ok: true });
    }

    if (reg.step === "done") {
      reg.step = "start";
      await save(reg);
    }

    const verified = await hasVerifiedTelegramProfile(String(from.id), from.username ?? reg.username);
    if (!verified) {
      await telegramSendMessage(
        chatId,
        `Avval saytda Telegram profilingizni mutaxassis sifatida tasdiqlang. Keyin bot ro'yxatdan o'tishni ochadi.\n\n${siteUrl("/register")}`,
        { reply_markup: { remove_keyboard: true } },
      );
      return NextResponse.json({ ok: true });
    }
    await beginSpecialistRegistration(chatId, reg);
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
  if (reg.step === "deleteReason") {
    const reason = cleanMultiline(text, 1000);
    if (reason.length < MIN_DELETE_REASON_LENGTH) {
      await telegramSendMessage(chatId, "Sabab kamida 5 belgidan iborat bo'lsin. Iltimos, qisqacha sabab yozing.");
      return NextResponse.json({ ok: true });
    }

    const deleted = await db
      .delete(providers)
      .where(eq(providers.telegramChatId, chatId))
      .returning({ id: providers.id, fullName: providers.fullName });

    if (deleted.length === 0) {
      reg.step = "done";
      await save(reg);
      await telegramSendMessage(chatId, "Profil allaqachon o'chirilgan yoki topilmadi. Yangi profil ochish uchun /start bosing.");
      return NextResponse.json({ ok: true });
    }

    reg.step = "deleted";
    reg.data = {
      ...reg.data,
      deleteReason: reason,
      deletedProviderId: String(deleted[0].id),
      deletedProviderName: deleted[0].fullName,
      deletedAt: new Date().toISOString(),
    };
    await save(reg);
    revalidateTag(CACHE_TAGS.providers, "max");
    await telegramSendMessage(chatId, "Profilingiz o'chirildi. Qayta ro'yxatdan o'tish uchun /start buyrug'ini yuboring.");
  } else if (reg.step === "fullName") {
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
  } else if (reg.step === "capacity") {
    const capacity = Number(text);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100) {
      await telegramSendMessage(chatId, "O'rindiqlar sonini 1 dan 100 gacha son bilan yozing.");
      return NextResponse.json({ ok: true });
    }
    reg.data.capacity = String(capacity);
    reg.step = "city";
    await save(reg);
    await telegramSendMessage(chatId, "Qaysi shaharda xizmat ko'rsatasiz?\nMasalan: Toshkent, Samarqand yoki Buxoro.");
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
    const [existingProvider] = await db
      .select({ id: providers.id, fullName: providers.fullName })
      .from(providers)
      .where(
        or(
          eq(providers.telegramUserId, String(from.id)),
          eq(providers.telegramUsername, normalizeUsername(from.username ?? reg.username)),
          eq(providers.telegramChatId, chatId),
          eq(providers.phone, reg.phone),
        ),
      )
      .limit(1);

    if (existingProvider) {
      reg.step = "done";
      await save(reg);
      await telegramSendMessage(
        chatId,
        `Sizda allaqachon profil bor, yangi profil ochilmaydi.\n\nProfil: ${existingProvider.fullName}\n${siteUrl(`/providers/${existingProvider.id}`)}`,
        { reply_markup: { remove_keyboard: true } },
      );
      return NextResponse.json({ ok: true });
    }
    reg.data.bio = bio;
    reg.step = "profileReady";
    await save(reg);
    await telegramSendMessage(
      chatId,
      `✅ Ro'yxatdan o'tish ma'lumotlari qabul qilindi.\n\nEndi saytga o'tib tarifni tanlang va promokod yoki to'lov orqali obunani tasdiqlang. Obuna active bo'lgandan keyin profilingiz saytga joylanadi.\n\n${siteUrl("/register")}`,
      { reply_markup: { remove_keyboard: true } },
    );
  } else if (reg.step === "profileReady") {
    await telegramSendMessage(
      chatId,
      `Profil ma'lumotlaringiz tayyor. Endi saytga o'tib tarif obunasini tasdiqlang:\n${siteUrl("/register")}`,
      { reply_markup: { remove_keyboard: true } },
    );
  } else {
    await telegramSendMessage(
      chatId,
      `Davom etish uchun /start bosing. Community obunasi yoki mutaxassis tarifi uchun saytga qayting:\n${siteUrl("/register")}`,
    );
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
