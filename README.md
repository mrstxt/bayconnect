# bayConnect

bayConnect — O'zbekiston bo'ylab gid, tarjimon, fotograf, tur operator, transfer, turizm xizmati va mehmonxona xizmatlarini topish uchun Next.js marketplace.

Loyiha Vercel + Neon Postgres uchun tayyorlangan. Mutaxassislar avval saytda tarifga obuna bo'ladi yoki promokod kiritadi, keyin Telegram bot active obunani tekshirgan holda profil yaratishga ruxsat beradi. BayCommunity yopiq guruhi ham obuna/promokod asosida bot orqali boshqariladi.

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
      subscriptions/intent/ Obuna yoki promokod intent yaratish
      community/access/    BayCommunity access so'rovi
      telegram/verify/     Telegram username tasdiqlash
      telegram/webhook/    Telegram bot webhook
      telegram/setup/      Telegram webhookni sozlash
      health/              DB health check
    experts/               Mutaxassislar katalogi
    transfer/              Transfer katalogi
    hotels/                Mehmonxonalar katalogi
    providers/[id]/        Provider profili va booking forma
    register/              Hamkorlik tariflari va obuna modal
    community/             BayCommunity obuna sahifasi
    blog/                  Blog
  components/              UI komponentlar
  db/                      Drizzle schema va DB client
  lib/                     Query, validation, brand, telegram, i18n helperlar
scripts/
  seed.ts                  Demo ma'lumot yozish
  upgrade-subscriptions-community.sql
                           Mavjud bazani obuna/community jadvallariga yangilash
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
TELEGRAM_BOT_USERNAME=""
TELEGRAM_WEBHOOK_SECRET=""
TELEGRAM_COMMUNITY_CHAT_ID=""
TELEGRAM_COMMUNITY_INVITE_URL=""
```

### Vercel Envga Nima Joylanadi

Vercel dashboard: Project → Settings → Environment Variables.

| Kalit | Qayerdan olinadi | Production qiymat |
| --- | --- | --- |
| `DATABASE_URL` | Neon/Supabase/Postgres connection string | Pooled Postgres URL, `sslmode=require` bilan |
| `NEXT_PUBLIC_SITE_URL` | Deploy domain | `https://your-domain.uz` yoki Vercel production URL |
| `TELEGRAM_BOT_TOKEN` | BotFather | `123456:ABC...` ko'rinishidagi token |
| `TELEGRAM_BOT_USERNAME` | BotFather | `BayConnectBot` ko'rinishida, `@` belgisisiz |
| `TELEGRAM_WEBHOOK_SECRET` | O'zingiz yaratasiz | Uzun random matn, masalan `openssl rand -hex 32` |
| `TELEGRAM_COMMUNITY_CHAT_ID` | BayCommunity yopiq guruhi | Masalan `-1001234567890`; bot guruhda admin bo'lishi kerak |
| `TELEGRAM_COMMUNITY_INVITE_URL` | Telegram invite link | Ixtiyoriy fallback; bo'sh bo'lsa bot join-request link yaratishga urinadi |

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
| `subscription_plans` | Start, Pro, Premium va BayCommunity tariflari |
| `promo_codes` | 1 yoki 3 oy bepul access beruvchi promokodlar |
| `subscriptions` | Mutaxassis va community obuna holatlari |
| `community_access_requests` | BayCommunity guruhiga kirish so'rovlari |
| `telegram_verifications` | Saytdan botga o'tib Telegram username tasdiqlash tokenlari |

Jadvallarni yaratish yoki yangilash:

```bash
npm run db:push
```

Demo ma'lumot:

```bash
npm run db:seed
```

Production bazada `db:seed` ishlatmang.

Mavjud production bazaga yangi obuna/community jadvallarini qo'shish uchun:

```bash
psql "$DATABASE_URL" -f scripts/upgrade-subscriptions-community.sql
```

Yoki Drizzle orqali schema push qiling:

```bash
npm run db:push
```

Demo seed quyidagi promokodlarni ham yaratadi:

| Promokod | Maqsad |
| --- | --- |
| `BAY1OY` | 1 oy bepul |
| `BAY3OY` | 3 oy bepul |

## Obuna Va Promokod Tizimi

Mutaxassislar uchun 3 ta tarif bor:

| Tarif | Maqsad |
| --- | --- |
| `Start` | Katalogda profil, kontakt va BayCommunity kirishi |
| `Pro` | Ko'proq ko'rinish, buyurtma bildirishnomasi, statistika |
| `Premium` | Top joylashuv, verified badge, promo va ustuvor support |

Oddiy foydalanuvchilar va mijozlar uchun alohida `BayCommunity` obunasi bor.

`/register` sahifasida har bir tarif kartasida `Obuna bo'lish` tugmasi bor. Modal ichida:

- promokod kiritilsa, obuna darhol `active` bo'ladi;
- `To'lov qilish` hozircha "tez kunda" xabarini chiqaradi;
- active mutaxassis obunasi bo'lsa, bot profil yaratish jarayonini boshlaydi;
- active community obunasi bo'lsa, bot yopiq guruh join requestini tasdiqlaydi.
- active obunadan keyin modal BayCommunity join-request taklif havolasini chiqaradi.

Promokod ishlatilganda `subscriptions.status = active`, `expires_at` esa promokod oyiga qarab 1 yoki 3 oy keyinga yoziladi.

## Telegram Botni Ishga Tushirish

1. Telegramda `@BotFather`ga kiring.
2. `/newbot` orqali bot yarating.
3. BotFather bergan tokenni `TELEGRAM_BOT_TOKEN`ga yozing.
4. `TELEGRAM_WEBHOOK_SECRET` uchun uzun random qiymat yarating:

```bash
openssl rand -hex 32
```

5. Vercelga deploy qiling.
6. BayCommunity yopiq guruhini yarating, botni admin qiling va guruh ID'sini `TELEGRAM_COMMUNITY_CHAT_ID`ga yozing. Guruhdagi "qo'shildi/chiqdi" xabarlarini tozalashi uchun botda `Delete messages` ruxsati ham yoqilgan bo'lishi kerak.
7. Deploydan keyin webhookni bir marta sozlang:

```text
https://YOUR_DOMAIN/api/telegram/setup?secret=TELEGRAM_WEBHOOK_SECRET_QIYMATI
```

Endpoint Telegramga quyidagi webhookni o'rnatadi:

```text
https://YOUR_DOMAIN/api/telegram/webhook
```

Webhook `message`, `callback_query` va `chat_join_request` update turlarini yoqadi. BayCommunity arizalarini bot avtomatik ko'rishi uchun `chat_join_request` shart.

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
| 4 | `npm run db:push` bajarilmagan | Bot "vaqtincha sozlanmoqda" deb javob beradi | `npm run db:push` — `telegram_registrations`, `subscriptions` va community jadvallari yaratilishi shart |
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

### Mutaxassis Bot Oqimi

Bot hech qachon faqat `/start` bosilgani uchun mutaxassisni ro'yxatdan o'tkazmaydi. Avval saytda obuna yoki promokod active bo'lishi shart.

1. Mutaxassis `/register` sahifasida `Start`, `Pro` yoki `Premium` tarifini tanlaydi.
2. `Obuna bo'lish` modalida `Telegram orqali tasdiqlash` tugmasini bosadi.
3. Sayt botga `?start=verify_<token>` deep-link bilan o'tkazadi.
4. Bot tokenni `telegram_verifications` jadvalidan topib, Telegram username va user ID'ni tasdiqlaydi.
5. Mutaxassis saytga qaytib, ism, telefon va promokodni kiritadi.
6. Promokod to'g'ri bo'lsa `subscriptions.status = active` bo'ladi.
7. Mutaxassis botga `/start` yoki `/register` yuboradi.
8. Bot `telegram_user_id` yoki `telegram_username` bo'yicha active mutaxassis obunasini tekshiradi.
9. Active obuna topilmasa, bot profil yaratishni boshlamaydi va saytga qaytaradi.
10. Active obuna topilsa, bot telefon, ism, email, kategoriya, shahar, tillar, narx, tajriba va bio so'raydi.
11. Kategoriya `Transfer` bo'lsa, avtomobil turi va o'rindiqlar soni majburiy so'raladi.
12. Profil `providers` jadvaliga yoziladi, `subscriptions.provider_id` shu profilga ulanadi.
13. Keyingi bookinglar shu Telegram chatga yuboriladi.

### BayCommunity Bot Oqimi

1. Foydalanuvchi `/register` yoki `/community` sahifasida community obunasini yoqadi.
2. Promokod active bo'lsa `community_access_requests.status = approved` va/yoki `subscriptions.status = active` bo'ladi.
3. Foydalanuvchi yopiq BayCommunity guruhiga join request yuboradi.
4. Bot `chat_join_request` update oladi.
5. Bot username/user ID bo'yicha active obuna yoki approved access borligini tekshiradi.
6. Ruxsat bo'lsa `approveChatJoinRequest`, bo'lmasa `declineChatJoinRequest` qiladi.

Telegram cheklovi: foydalanuvchini guruhdan chiqib ketolmaydigan qilish mumkin emas. To'g'ri model — yopiq guruh, join request, active obuna tekshiruvi va muddati tugaganda chiqarish/kelajakdagi requestni rad etish.

## Til Va Tarjima

Saytda `UZ / RU / EN` til switcheri bor. U cookie (`bc_locale`) orqali tanlovni saqlaydi va asosiy UI matnlarini frontda tarjima qiladi.

Hozir tarjima qamrovi:

| Qism | Holat |
| --- | --- |
| Header, footer, tugmalar | UZ/RU/EN |
| Katalog filtr va empty state matnlari | UZ/RU/EN |
| Booking formasi va obuna modalidagi asosiy matnlar | UZ/RU/EN |
| API error javoblari | Hozircha Uzbek |
| DBdagi bio, blog body, review matnlari | Avtomatik tarjima qilinmaydi |

Eski va yangi erkin matnlarni ham avtomatik tarjima qilish mumkin, lekin buning uchun alohida translation provider kerak bo'ladi: masalan OpenAI API, Google Translate yoki DeepL. Bunday qatlam qo'shilsa, provider bio/blog/review matnlari so'rov paytida yoki yozilish vaqtida tarjima qilinib, cache qilinadi.

## API Endpointlar

| Endpoint | Method | Vazifa |
| --- | --- | --- |
| `/api/health` | GET | DB ulanishini tekshiradi |
| `/api/providers` | POST | Mutaxassis yaratadi |
| `/api/providers/by-ids` | POST | IDlar bo'yicha providerlarni qaytaradi |
| `/api/subscriptions/intent` | POST | Tarif obunasi yoki promokod intent yaratadi |
| `/api/community/access` | POST | BayCommunity access so'rovi yaratadi |
| `/api/telegram/verify/start` | POST | Bot orqali username tasdiqlash tokeni va link yaratadi |
| `/api/telegram/verify/status` | GET | Telegram tasdiqlash statusini qaytaradi |
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
- `TELEGRAM_COMMUNITY_CHAT_ID` public link emas, yopiq guruh ID'si bo'lishi kerak.
- Bot BayCommunity guruhida join requestlarni tasdiqlay oladigan admin bo'lishi kerak.
- Booking va register endpointlarda oddiy rate limit va input validation bor.
- Bot profil yaratishdan oldin `subscriptions.status = active` va `expires_at` hali o'tmaganini tekshiradi.
- Serverless memory rate limit mutlaq himoya emas; katta trafficda Upstash Redis yoki Vercel Firewall ishlating.

### npm Audit Holati (2026-07-28)

`npm audit --omit=dev` (production daraxti) → **0 zaiflik**.

Dev-only daraxtda 2 ta ochiq CVE qolgan, ikkalasi ham deploy'dagi runtime'ga kirmaydi:

| Paket | Qayerdan | Nega hozircha tuzatilmaydi |
| --- | --- | --- |
| `brace-expansion@1.x` (high, GHSA-mh99-v99m-4gvg) | eslint pluginlari → `minimatch@3` | 1.x liniyasi uchun patch backport hali chiqmagan; zo'riqtirish kodni buzadi |
| `esbuild@0.24` (moderate, GHSA-67mh-4wv8-2f99) | `drizzle-kit` → `@esbuild-kit` | Zaiflik faqat esbuild'ning dev-serveriga taalluqli; drizzle-kit buni ishga tushirmaydi |

Ikkalasi ham build/lint paytidagi lokal vositalar. Backport chiqqach `npm update` avtomatik oladi.

## UI/UX Izohlar

Saytda mobil menyu, sticky header, katalog filtrlar, empty state, booking formasi va sticky mobile booking bar bor. Dekorativ fonlar yengillashtirilgan, til switcheri headerga joylangan, statik UI matnlari UZ/RU/EN uchun tarjima qilinadi.
