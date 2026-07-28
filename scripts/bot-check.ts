/**
 * bayConnect Telegram bot diagnostikasi.
 *
 * Ishlatish:
 *   npm run bot:check          — faqat tekshiradi, hech narsani o'zgartirmaydi
 *   npm run bot:check -- --fix — topilgan muammolarni o'zi tuzatadi
 *     (webhookni to'g'ri HTTPS URL bilan qayta o'rnatadi, buyruqlar menyusini yangilaydi)
 *
 * Nimalarni tekshiradi:
 *   1. 4 ta env o'zgaruvchi to'ldirilganmi
 *   2. DATABASE_URL orqali Postgres'ga ulanish va kerakli jadvallar bormi
 *   3. TELEGRAM_BOT_TOKEN haqiqiymi (getMe)
 *   4. Webhook o'rnatilganmi, URL to'g'rimi, Telegram tomonidan xatolar bormi
 *      (getWebhookInfo → last_error_message eng muhim ko'rsatkich)
 */
import "dotenv/config";
import pg from "pg";

const API = "https://api.telegram.org";
const FIX = process.argv.includes("--fix");

let failures = 0;

function ok(msg: string) {
  console.log(`  ✅ ${msg}`);
}
function warn(msg: string) {
  console.log(`  ⚠️  ${msg}`);
}
function fail(msg: string) {
  failures += 1;
  console.log(`  ❌ ${msg}`);
}
function section(title: string) {
  console.log(`\n=== ${title} ===`);
}

async function telegramApi<T>(token: string, method: string, body?: Record<string, unknown>): Promise<{ ok: boolean; result: T | null; raw: unknown }> {
  try {
    const response = await fetch(`${API}/bot${token}/${method}`, {
      method: body ? "POST" : "GET",
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = (await response.json()) as { ok?: boolean; result?: T; description?: string };
    return { ok: response.ok && json.ok === true, result: json.result ?? null, raw: json };
  } catch (error) {
    return { ok: false, result: null, raw: String(error) };
  }
}

type WebhookInfo = {
  url?: string;
  has_custom_certificate?: boolean;
  pending_update_count?: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
};

async function checkEnv(): Promise<string[]> {
  section("1. Environment o'zgaruvchilari");
  const env = process.env.VERCEL ? "Vercel" : "lokal";
  const siteUrlEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() ?? "";

  if (process.env.DATABASE_URL?.trim()) ok("DATABASE_URL to'ldirilgan");
  else fail("DATABASE_URL bo'sh — Neon/Supabase dashboardidan connection string oling.");

  if (process.env.TELEGRAM_BOT_TOKEN?.trim()) ok("TELEGRAM_BOT_TOKEN to'ldirilgan");
  else fail("TELEGRAM_BOT_TOKEN bo'sh — @BotFather'dan oling.");

  if (secret) {
    if (secret.length < 16) warn(`TELEGRAM_WEBHOOK_SECRET juda qisqa (${secret.length} belgi). Kamida 32 ta random belgi bo'lsin: openssl rand -hex 32`);
    else ok("TELEGRAM_WEBHOOK_SECRET to'ldirilgan va yetarlicha uzun");
  } else {
    fail("TELEGRAM_WEBHOOK_SECRET bo'sh — yarating: openssl rand -hex 32");
  }

  if (siteUrlEnv) {
    if (siteUrlEnv.startsWith("https://")) ok(`NEXT_PUBLIC_SITE_URL: ${siteUrlEnv}`);
    else {
      fail(`NEXT_PUBLIC_SITE_URL "${siteUrlEnv}" — Telegram webhook FAQAT https:// qabul qiladi! ` +
        "localhost yoki http:// bilan bot ishlamaydi. Production domenni yozing (masalan, https://bayconnect.vercel.app).");
    }
  } else {
    warn(`NEXT_PUBLIC_SITE_URL bo'sh (${env} muhit). Webhook URL Vercel'ning o'z o'zgaruvchilaridan olinadi yoki localhost bo'lib qoladi.`);
  }
  return [siteUrlEnv, secret];
}

async function checkDb(databaseUrl: string) {
  section("2. Database");
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1, connectionTimeoutMillis: 8_000 });
  try {
    const t0 = Date.now();
    await pool.query("select 1");
    ok(`Ulanish ishlayapti (${Date.now() - t0} ms)`);

    const { rows } = await pool.query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = 'public'",
    );
    const tables = new Set(rows.map((r) => r.table_name));
    const required = ["providers", "bookings", "reviews", "posts", "telegram_registrations"];
    const missing = required.filter((t) => !tables.has(t));
    if (missing.length === 0) {
      ok(`Barcha jadvallar mavjud (${required.join(", ")})`);
    } else {
      fail(`Jadvallar yo'q: ${missing.join(", ")}. Tuzatish: 'npm run db:push' bajaring (DATABASE_URL .env'da bo'lsin).`);
    }
  } catch (error) {
    fail(`DB'ga ulana olmadim: ${error instanceof Error ? error.message : error}`);
    console.log("     → Neon branch suspend bo'lgan yoki parol noto'g'ri bo'lishi mumkin.");
  } finally {
    await pool.end().catch(() => undefined);
  }
}

async function checkToken(token: string) {
  section("3. Bot token");
  const me = await telegramApi<{ username?: string; first_name?: string; id?: number }>(token, "getMe");
  if (me.ok && me.result) {
    ok(`Token haqiqiy — bot: @${me.result.username} (${me.result.first_name}, id: ${me.result.id})`);
  } else {
    fail(`Token ishlamaydi: ${JSON.stringify(me.raw)}`);
    console.log("     → @BotFather'da /token bilan tekshiring. Revoke bo'lgan bo'lsa yangisini oling va Vercel env'da yangilang.");
  }
}

async function checkWebhook(token: string, siteUrlEnv: string, secret: string) {
  section("4. Webhook holati");
  const info = await telegramApi<WebhookInfo>(token, "getWebhookInfo");
  if (!info.ok || !info.result) {
    fail(`getWebhookInfo ishlamadi: ${JSON.stringify(info.raw)}`);
    return;
  }
  const wh = info.result;
  console.log(`     url                    : ${wh.url || "(bo'sh)"}`);
  console.log(`     pending_update_count   : ${wh.pending_update_count ?? 0}`);
  if (wh.last_error_message) {
    console.log(`     last_error_message     : ${wh.last_error_message}`);
    if (wh.last_error_date) {
      console.log(`     last_error_date        : ${new Date(wh.last_error_date * 1000).toISOString()}`);
    }
  }

  if (!wh.url) {
    fail("Webhook UMUMAN o'rnatilmagan! Shu sababli botga yozilgan xabarlarga javob kelmadi.");
    console.log("     Tuzatish variantlari:");
    console.log("       a) npm run bot:check -- --fix   (NEXT_PUBLIC_SITE_URL https bo'lsa)");
    console.log("       b) Brauzerda oching: https://SIZNING_DOMEN/api/telegram/setup?secret=TELEGRAM_WEBHOOK_SECRET_QIYMATI");
  } else {
    ok(`Webhook o'rnatilgan: ${wh.url}`);
    if (wh.last_error_message) {
      fail(`Telegram oxirgi xatoga duch kelgan: "${wh.last_error_message}"`);
      if (wh.last_error_message.includes("401")) {
        console.log("     → 401: webhook secret mos kelmadi. Vercel'dagi TELEGRAM_WEBHOOK_SECRET");
        console.log("       webhook o'rnatilgandagidan farq qilmoqda. --fix bilan qayta o'rnating.");
      }
      if (/Connection refused|Name or service not known|SSL/.test(wh.last_error_message)) {
        console.log("     → Domen/DNS/sertifikat muammosi — deploy o'chgan yoki domen noto'g'ri.");
      }
    } else {
      ok("Telegram tomonidan xatolar qayd etilmagan");
    }
    if ((wh.pending_update_count ?? 0) > 50) {
      warn(`${wh.pending_update_count} ta update navbatda tiqilib qolgan — webhook javob bermayotgan bo'lishi mumkin.`);
    }
  }

  if (!siteUrlEnv.startsWith("https://")) {
    if (FIX) fail("--fix ishlamaydi: avval NEXT_PUBLIC_SITE_URL'ga https:// domen yozing.");
    return;
  }
  const expected = `${siteUrlEnv.replace(/\/+$/, "")}/api/telegram/webhook`;
  if (wh.url && wh.url !== expected) {
    warn(`Webhook URL (${wh.url}) kutilgan URL (${expected}) ga teng emas.`);
  } else if (!wh.url) {
    console.log(`     Kutilgan webhook URL: ${expected}`);
  }

  if (FIX && secret && (!wh.url || wh.url !== expected || wh.last_error_message)) {
    console.log("\n     --fix: webhook qayta o'rnatilmoqda...");
    const set = await telegramApi(token, "setWebhook", {
      url: expected,
      secret_token: secret,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: true,
    });
    if (set.ok) ok(`Webhook o'rnatildi: ${expected}`);
    else fail(`setWebhook rad etildi: ${JSON.stringify(set.raw)}`);

    const cmds = await telegramApi(token, "setMyCommands", {
      commands: [
        { command: "start", description: "Ro'yxatdan o'tishni boshlash" },
        { command: "register", description: "Mutaxassis sifatida ro'yxatdan o'tish" },
      ],
    });
    if (cmds.ok) ok("Bot buyruqlar menyusi yangilandi");
  }
}

async function main() {
  console.log("bayConnect bot diagnostikasi" + (FIX ? " (--fix rejimi)" : ""));
  const [siteUrlEnv, secret] = await checkEnv();

  const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (databaseUrl) await checkDb(databaseUrl);
  else {
    section("2. Database");
    warn("DATABASE_URL yo'q — DB tekshiruvi o'tkazib yuborildi.");
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  if (token) {
    await checkToken(token);
    await checkWebhook(token, siteUrlEnv, secret);
  } else {
    section("3. Bot token");
    warn("Token yo'q — Telegram tekshiruvlari o'tkazib yuborildi.");
  }

  section("Xulosa");
  if (failures === 0) {
    console.log("🎉 Hamma tekshiruv muvaffaqiyatli — botga /start yuborib ko'ring.");
  } else {
    console.log(`${failures} ta muammo topildi — yuqoridagi yo'riqnomalarni bajaring.`);
    console.log("Keyin yana tekshiring:  npm run bot:check");
  }
  process.exit(failures === 0 ? 0 : 1);
}

void main();
