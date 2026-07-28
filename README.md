# bayConnect

bayConnect — O'zbekiston bo'ylab gid, tarjimon, fotograf, tur agent, transfer va mehmonxona xizmatlarini topish uchun Next.js marketplace.

Loyiha Vercel + Neon Postgres uchun tayyorlangan. Telegram bot orqali mutaxassis ro'yxatdan o'tishi va yangi buyurtmalarni bot chatida qabul qilishi mumkin.

## Stack

| Qism | Texnologiya |
| --- | --- |
| Frontend | Next.js 16 App Router, React 19, Tailwind CSS 4 |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL |
| ORM | Drizzle ORM / Drizzle Kit |
| Hosting | Vercel |
| Bot | Telegram Bot API webhook |

Node.js talabi: `>=20 <25`.

## Loyiha Tuzilmasi

```text
src/
  app/
    api/
      bookings/            Buyurtma yaratish
      providers/           Mutaxassis yaratish
      providers/by-ids/    Sevimlilar uchun providerlarni olish
      telegram/webhook/    Telegram bot webhook
      telegram/setup/      Telegram webhookni sozlash
      health/              DB health check
    experts/               Mutaxassislar katalogi
    transfer/              Transfer katalogi
    hotels/                Mehmonxonalar katalogi
    providers/[id]/        Provider profili va booking forma
    register/              Web orqali ro'yxatdan o'tish
    blog/                  Blog
  components/              UI komponentlar
  db/                      Drizzle schema va DB client
  lib/                     Query, validation, brand, telegram, i18n helperlar
scripts/
  seed.ts                  Demo ma'lumot yozish
```

## Tez Boshlash

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Sayt: `http://localhost:3000`

Health check:

```bash
curl http://localhost:3000/api/health
```

## Environment

`.env.example` faqat namuna. Haqiqiy parollarni hech qachon gitga qo'shmang.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_WEBHOOK_SECRET=""
```

### Vercel Envga Nima Joylanadi

Vercel dashboard: Project → Settings → Environment Variables.

| Kalit | Qayerdan olinadi | Production qiymat |
| --- | --- | --- |
| `DATABASE_URL` | Neon/Supabase/Postgres connection string | Pooled Postgres URL, `sslmode=require` bilan |
| `NEXT_PUBLIC_SITE_URL` | Deploy domain | `https://your-domain.uz` yoki Vercel production URL |
| `TELEGRAM_BOT_TOKEN` | BotFather | `123456:ABC...` ko'rinishidagi token |
| `TELEGRAM_WEBHOOK_SECRET` | O'zingiz yaratasiz | Uzun random matn, masalan `openssl rand -hex 32` |

Vercel preview muhitida ham alohida `NEXT_PUBLIC_SITE_URL` qo'ysangiz canonical URL va Telegram setup to'g'ri ishlaydi.

## Database

Schema: `src/db/schema.ts`.

Asosiy jadvallar:

| Jadval | Maqsad |
| --- | --- |
| `providers` | Mutaxassislar, transferlar, mehmonxonalar |
| `bookings` | Mijoz buyurtmalari |
| `reviews` | Provider sharhlari |
| `posts` | Blog maqolalari |
| `telegram_registrations` | Telegram ro'yxatdan o'tish sessiyasi |

Jadvallarni yaratish yoki yangilash:

```bash
npm run db:push
```

Demo ma'lumot:

```bash
npm run db:seed
```

Production bazada `db:seed` ishlatmang.

## Telegram Botni Ishga Tushirish

1. Telegramda `@BotFather`ga kiring.
2. `/newbot` orqali bot yarating.
3. BotFather bergan tokenni `TELEGRAM_BOT_TOKEN`ga yozing.
4. `TELEGRAM_WEBHOOK_SECRET` uchun uzun random qiymat yarating:

```bash
openssl rand -hex 32
```

5. Vercelga deploy qiling.
6. Deploydan keyin webhookni bir marta sozlang:

```text
https://YOUR_DOMAIN/api/telegram/setup?secret=TELEGRAM_WEBHOOK_SECRET_QIYMATI
```

Endpoint Telegramga quyidagi webhookni o'rnatadi:

```text
https://YOUR_DOMAIN/api/telegram/webhook
```

## Bot Ishlamayaptimi? (Troubleshooting)

Avval diagnostikani ishga tushiring — muammoni o'zi topib, yechimni yozib beradi:

```bash
npm run bot:check            # faqat tekshiradi
npm run bot:check -- --fix   # webhookni to'g'ri URL bilan o'zi qayta o'rnatadi
```

Eng ko'p uchraydigan 5 ta sabab:

| # | Sabab | Belgisi | Yechim |
| --- | --- | --- | --- |
| 1 | Webhook hech qachon o'rnatilmagan | Bot jimgina javob bermaydi | Deploydan keyin bir marta `https://DOMEN/api/telegram/setup?secret=SECRET` ni oching |
| 2 | `NEXT_PUBLIC_SITE_URL` da `http://localhost:3000` qoldirilgan | Setup endpoint 400/502 qaytaradi | Telegram FAQAT HTTPS public domenni qabul qiladi — env'ga production domenni yozing, redeploy qiling, setup'ni qayta chaqiring |
| 3 | Envlar faqat lokal `.env`da — Vercel'ga yozilmagan | GET `/api/telegram/webhook` `botTokenConfigured:false` ko'rsatadi | Vercel `Settings → Environment Variables` ga 4 tasini yozing + Redeploy |
| 4 | `npm run db:push` bajarilmagan | Bot "vaqtincha sozlanmoqda" deb javob beradi | `npm run db:push` — `telegram_registrations` jadvali yaratilishi shart |
| 5 | Lokalda (`npm run dev`) test qilinmoqda | Bot umuman sekin | Telegram localhost'ga update yubora olmaydi; ngrok/cloudflared tunnel bilan public https URL olib, webhookni shunga yo'naltiring |

Qo'shimcha tekshiruvlar:

```bash
# 1. Envlar serverga chiqqanmi?
curl https://DOMEN/api/telegram/webhook
#    → {"botTokenConfigured":true,"webhookSecretConfigured":true} bo'lishi shart

# 2. Webhook nima deyapti? (simptom shu yerda ko'rinadi)
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
#    → "url" bo'shmi? "last_error_message" nima degan?
```

`webhookInfo.last_error_message`:
- `401 Unauthorized` → secret mos kelmadi; setup'ni joriy secret bilan qayta chaqiring
- `Connection refused` / DNS xatosı → domen yoki deploy ishlamayapti
- hech qanday xato yo'q + `pending_update_count=0` → hammasi yaxshi, botga `/start` yuboring

Bot oqimi:

1. Mutaxassis botga `/start` yoki `/register` yuboradi.
2. Telefon raqamini Telegram contact tugmasi orqali yuboradi.
3. Xizmat turini tanlaydi.
4. Shahar, tillar, narx, tajriba va bio kiritadi.
5. Profil `providers` jadvaliga yoziladi.
6. Keyingi bookinglar shu Telegram chatga yuboriladi.

Muhim: botdan ro'yxatdan o'tgan providerlarda `telegram_chat_id` saqlanadi. Web formadan ro'yxatdan o'tgan providerga bot xabari borishi uchun hozircha chat ID yo'q; buni keyin web profilni bot bilan bog'lash oqimi orqali kengaytirish mumkin.

## Til Va Tarjima

Saytda `UZ / RU / EN` til switcheri bor. U cookie (`bc_locale`) orqali tanlovni saqlaydi va asosiy UI matnlarini frontda tarjima qiladi.

Hozir tarjima qamrovi:

| Qism | Holat |
| --- | --- |
| Header, footer, tugmalar | UZ/RU/EN |
| Katalog filtr va empty state matnlari | UZ/RU/EN |
| Booking va register formadagi asosiy matnlar | UZ/RU/EN |
| API error javoblari | Hozircha Uzbek |
| DBdagi bio, blog body, review matnlari | Avtomatik tarjima qilinmaydi |

Eski va yangi erkin matnlarni ham avtomatik tarjima qilish mumkin, lekin buning uchun alohida translation provider kerak bo'ladi: masalan OpenAI API, Google Translate yoki DeepL. Bunday qatlam qo'shilsa, provider bio/blog/review matnlari so'rov paytida yoki yozilish vaqtida tarjima qilinib, cache qilinadi.

## API Endpointlar

| Endpoint | Method | Vazifa |
| --- | --- | --- |
| `/api/health` | GET | DB ulanishini tekshiradi |
| `/api/providers` | POST | Mutaxassis yaratadi |
| `/api/providers/by-ids` | POST | IDlar bo'yicha providerlarni qaytaradi |
| `/api/bookings` | POST | Buyurtma yaratadi va Telegramga xabar yuboradi |
| `/api/telegram/webhook` | POST | Telegram update qabul qiladi |
| `/api/telegram/setup?secret=...` | GET | Telegram webhookni o'rnatadi |

## Tekshiruv Buyruqlari

```bash
npm run lint
npm run typecheck
npm run check
npm run build
```

## Deploy

1. Repo GitHubga push qilinadi.
2. Vercelda project import qilinadi.
3. Envlar qo'shiladi.
4. Build command: `npm run build`.
5. Deploydan keyin:

```bash
npm run db:push
```

Vercelda lokal command ishlatmasangiz, `DATABASE_URL` bilan terminaldan Drizzle push qiling yoki Drizzle Studio/Neon console orqali migrationni bajaring.

## Xavfsizlik Eslatmalari

- `.env` va real tokenlarni commit qilmang.
- Agar `.env.example` yoki boshqa faylga real DB URL tushib qolgan bo'lsa, DB parolini rotate qiling.
- `TELEGRAM_WEBHOOK_SECRET` kamida 32 random belgidan iborat bo'lsin.
- Booking va register endpointlarda oddiy rate limit va input validation bor.
- Serverless memory rate limit mutlaq himoya emas; katta trafficda Upstash Redis yoki Vercel Firewall ishlating.

## UI/UX Izohlar

Saytda mobil menyu, sticky header, katalog filtrlar, empty state, booking formasi va sticky mobile booking bar bor. Dekorativ fonlar yengillashtirilgan, til switcheri headerga joylangan, statik UI matnlari UZ/RU/EN uchun tarjima qilinadi.
