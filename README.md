# bayConnect

**bayConnect** — O'zbekiston bo'ylab turizm xizmatlarini (gid, tarjimon, fotograf, tur agent, transfer, mehmonxona) topish uchun Next.js marketplace.

Loyiha Vercel + Neon Postgres uchun moslashtirilgan, lekin har qanday Postgres bilan (Docker, Supabase, lokal) ishlaydi.

---

## Mundarija

1. [Stack](#stack)
2. [Loyiha tuzilmasi](#loyiha-tuzilmasi)
3. [Tez boshlash](#tez-boshlash)
4. [Lokalda ishga tushirish (batafsil)](#lokalda-ishga-tushirish-batafsil)
5. [Ma'lumotlar bazasi](#malumotlar-bazasi)
6. [Environment o'zgaruvchilari](#environment-ozgaruvchilari)
7. [Vercel'ga deploy](#vercelga-deploy)
8. [Arxitektura va keshlash](#arxitektura-va-keshlash)
9. [API endpointlar](#api-endpointlar)
10. [Tekshiruv buyruqlari](#tekshiruv-buyruqlari)
11. [Muammolarni bartaraf etish](#muammolarni-bartaraf-etish)

---

## Stack

| Qatlam | Texnologiya |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Til | TypeScript 5.9 (strict) |
| Baza | PostgreSQL (Neon) |
| ORM | Drizzle ORM 0.45 |
| Hosting | Vercel |

**Talab:** Node.js 20 yoki 22 (`>=20 <25`).

---

## Loyiha tuzilmasi

```text
src/
├── app/
│   ├── layout.tsx              Root layout, SEO metadata, skip-link
│   ├── page.tsx                Bosh sahifa (ISR 5 daq)
│   ├── sitemap.ts              Avtomatik sitemap.xml
│   ├── robots.ts               Avtomatik robots.txt
│   ├── experts/                Mutaxassislar katalogi (sahifalangan)
│   ├── transfer/               Transfer xizmatlari
│   ├── hotels/                 Mehmonxonalar
│   ├── blog/                   Blog ro'yxati + [slug] (SSG)
│   ├── providers/[id]/         Profil sahifasi + booking forma
│   ├── favorites/              Sevimlilar (client, localStorage)
│   ├── register/               Mutaxassis ro'yxatdan o'tishi (3 qadam)
│   └── api/
│       ├── health/             DB ulanish tekshiruvi
│       ├── providers/          POST — yangi profil
│       ├── providers/by-ids/   POST — ID bo'yicha olish
│       └── bookings/           POST — zayavka
├── components/                 UI komponentlar (Header, Card, Pagination...)
├── db/
│   ├── schema.ts               Drizzle schema + indekslar
│   └── index.ts                Lazy pool + Drizzle klienti
└── lib/
    ├── queries.ts              Barcha DB so'rovlari (keshlangan)
    ├── searchParams.ts         Filtr/URL yordamchilari
    ├── validation.ts           Validatsiya + rate limiting
    ├── favorites.ts            localStorage store
    ├── useFavorites.ts         React hook (useSyncExternalStore)
    ├── brand.ts                Brend tokenlari, kategoriyalar
    └── site.ts                 Kanonik URL aniqlash
```

---

## Tez boshlash

```bash
git clone https://github.com/mrstxt/bayconnect.git
cd bayconnect
npm install
cp .env.example .env      # ichiga DATABASE_URL yozing
npm run db:push           # jadval va indekslarni yaratadi
npm run db:seed           # demo ma'lumot (ixtiyoriy)
npm run dev
```

Brauzer: **http://localhost:3000**

---

## Lokalda ishga tushirish (batafsil)

### 1-qadam. Node.js versiyasini tekshiring

```bash
node -v     # v20.x yoki v22.x bo'lishi kerak
npm -v
```

Agar versiya mos kelmasa, [nvm](https://github.com/nvm-sh/nvm) orqali:

```bash
nvm install 22
nvm use 22
```

### 2-qadam. Repozitoriyani klonlang va paketlarni o'rnating

```bash
git clone https://github.com/mrstxt/bayconnect.git
cd bayconnect
npm install
```

> `npm warn deprecated @esbuild-kit/...` ogohlantirishlari normal — bu `tsx` paketining ichki bog'liqligi, deployga ta'sir qilmaydi.

### 3-qadam. Postgres bazasini tayyorlang

Uch variantdan birini tanlang.

#### Variant A — Neon (bulut, eng oson, tavsiya etiladi)

1. [neon.tech](https://neon.tech) da ro'yxatdan o'ting.
2. **Create Project** → nom: `bayconnect`.
3. Region: **Frankfurt** yoki **Singapore** (O'zbekistonga eng yaqin).
4. **Connection Details** → **Connection string** ni nusxalang.
5. **Pooled connection** variantini tanlang (Vercel uchun muhim).

Ko'rinishi:

```text
postgresql://neondb_owner:PAROL@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

#### Variant B — Docker (lokal, internetsiz ishlaydi)

```bash
docker run --name bayconnect-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bayconnect \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Tekshirish:

```bash
docker ps                          # konteyner ishlayaptimi
docker logs bayconnect-db --tail 5
```

Connection string:

```text
postgresql://postgres:postgres@127.0.0.1:5432/bayconnect
```

To'xtatish / qayta ishga tushirish:

```bash
docker stop bayconnect-db
docker start bayconnect-db
```

#### Variant C — Tizimga o'rnatilgan Postgres

```bash
# Ubuntu / Debian
sudo apt install postgresql
sudo -u postgres createdb bayconnect
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16
createdb bayconnect
```

### 4-qadam. `.env` faylini yarating

```bash
cp .env.example .env
```

`.env` ichini tahrirlang:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/bayconnect"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> ⚠️ `.env` fayli `.gitignore` da — uni **hech qachon** git'ga qo'shmang.

### 5-qadam. Jadvallarni yarating

```bash
npm run db:push
```

Bu buyruq `src/db/schema.ts` asosida 4 ta jadval (`providers`, `bookings`, `reviews`, `posts`) va 11 ta indeks yaratadi.

Kutilayotgan natija:

```text
4 tables
bookings 11 columns 2 indexes 1 fks
posts 10 columns 2 indexes 0 fks
providers 20 columns 6 indexes 0 fks
reviews 6 columns 1 indexes 1 fks
```

### 6-qadam. Demo ma'lumot (ixtiyoriy)

```bash
npm run db:seed
```

> ⚠️ Bu skript `providers`, `reviews`, `posts`, `bookings` jadvallarini **tozalab**, demo ma'lumot yozadi. Production bazada ishlatmang — skript `NODE_ENV=production` bo'lsa o'zini bloklaydi.

### 7-qadam. Serverni ishga tushiring

```bash
npm run dev
```

```text
▲ Next.js 16.2.6 (Turbopack)
- Local:  http://localhost:3000
✓ Ready in 1.2s
```

Tekshiring:

```bash
curl http://localhost:3000/api/health
# {"ok":true,"latencyMs":14}
```

### 8-qadam. Production build'ni lokal sinash

Deploydan oldin real build'ni tekshirish foydali:

```bash
npm run build
npm run start
```

Sayt **http://localhost:3000** da production rejimida ochiladi.

### Port band bo'lsa

```bash
npm run dev -- -p 3001
```

---

## Ma'lumotlar bazasi

### Jadvallar

| Jadval | Vazifasi |
|---|---|
| `providers` | Xizmat ko'rsatuvchilar (gid, transfer, mehmonxona...) |
| `bookings` | Mijoz zayavkalari |
| `reviews` | Profil sharhlari |
| `posts` | Blog maqolalari |

### Buyruqlar

```bash
npm run db:push       # schema'ni bazaga qo'llash (dev uchun)
npm run db:generate   # SQL migration fayli yaratish (prod uchun)
npm run db:migrate    # migration'larni qo'llash
npm run db:studio     # brauzerda vizual DB redaktori
npm run db:seed       # demo ma'lumot
```

### Indekslar

`providers` jadvalida 6 ta indeks bor — ular filtr va saralashni tezlashtiradi:

| Indeks | Qaysi so'rov uchun |
|---|---|
| `providers_category_idx` | `/experts`, `/hotels` kategoriya filtri |
| `providers_category_sub_idx` | `/transfer` transport turi |
| `providers_city_idx` | Shahar filtri |
| `providers_price_idx` | Narx diapazoni va saralash |
| `providers_rank_idx` | Default saralash (verified → rating) |
| `providers_created_idx` | "Yangi" saralash |

---

## Environment o'zgaruvchilari

| Nom | Majburiy | Tavsif |
|---|:---:|---|
| `DATABASE_URL` | ✅ | Postgres connection string |
| `NEXT_PUBLIC_SITE_URL` | ❌ | Kanonik URL (sitemap, OG teglar). Vercel'da avtomatik aniqlanadi |

---

## Vercel'ga deploy

### 1. Kodni GitHub'ga yuklang

```bash
git add .
git commit -m "perf: keshlash, sahifalash va validatsiya yaxshilandi"
git push origin main
```

### 2. Vercel'da loyiha yarating

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository**.
2. `bayconnect` repozitoriyasini tanlang.
3. Framework Preset: **Next.js** (avtomatik aniqlanadi).
4. Build sozlamalarini o'zgartirmang:

```text
Install Command: npm install
Build Command:   npm run build
Output:          (bo'sh — Next.js avtomatik)
Root Directory:  ./
```

### 3. Environment Variables qo'shing

**Settings → Environment Variables** bo'limida:

| Name | Value | Environments |
|---|---|---|
| `DATABASE_URL` | Neon **pooled** connection string | Production, Preview, Development |

> Neon'ning **`-pooler`** li manzilini ishlating. Serverless funksiyalar tez-tez ishga tushadi va oddiy (direct) ulanish limitini tez tugatadi.

### 4. Deploy

**Deploy** tugmasini bosing. Env keyinroq qo'shilgan bo'lsa — **Redeploy** qiling.

### 5. Bazani tayyorlang

Vercel jadvallarni avtomatik yaratmaydi. Lokal mashinangizdan **production** `DATABASE_URL` bilan bir marta bajaring:

```bash
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" npm run db:push
```

### 6. Tekshiring

```text
https://SIZNING-DOMEN.vercel.app/api/health
```

Kutilgan javob:

```json
{ "ok": true, "latencyMs": 23 }
```

---

## Arxitektura va keshlash

### Renderlash strategiyasi

| Sahifa | Rejim | Yangilanish |
|---|---|---|
| `/` | ISR | 5 daqiqa |
| `/experts`, `/transfer`, `/hotels` | ISR + kesh | 2 daqiqa |
| `/blog` | ISR | 10 daqiqa |
| `/blog/[slug]` | **SSG** (build vaqtida) | 10 daqiqa |
| `/providers/[id]` | ISR | 5 daqiqa |
| `/favorites`, `/register` | Statik + client | — |
| `/api/*` | Dynamic | keshlanmaydi |

### Kesh invalidatsiyasi

Yangi mutaxassis qo'shilganda `POST /api/providers` avtomatik ravishda `revalidateTag("providers", "max")` chaqiradi — ro'yxatlar darhol yangilanadi, keshning tugashini kutish shart emas.

### DB xatosiga chidamlilik

Barcha so'rovlar `safe()` o'ramida. Agar baza yetib bormasa:

- `next build` **yiqilmaydi** — sahifalar bo'sh holatda generatsiya bo'ladi;
- xato konsolga yoziladi;
- bo'sh natija **keshlanmaydi**, keyingi so'rov qayta urinadi.

---

## API endpointlar

| Method | Endpoint | Tavsif | Rate limit |
|---|---|---|---|
| `GET` | `/api/health` | DB ulanishi + kechikish | — |
| `POST` | `/api/providers` | Yangi profil yaratadi | 10 / soat |
| `POST` | `/api/providers/by-ids` | ID ro'yxati bo'yicha (maks. 60) | 60 / daq |
| `POST` | `/api/bookings` | Zayavka yaratadi | 5 / daq |

Namuna:

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "providerId": 1,
    "clientName": "Ali Valiyev",
    "clientEmail": "ali@mail.uz",
    "clientPhone": "+998 90 123 45 67",
    "startDate": "2026-08-01",
    "endDate": "2026-08-05",
    "peopleCount": 2
  }'
```

---

## Tekshiruv buyruqlari

```bash
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run check        # ikkalasi birga
npm run build        # production build
```

Deploydan oldin `npm run check` ni bajaring — Vercel'da tip xatosi build'ni to'xtatadi.

---

## Muammolarni bartaraf etish

### `DATABASE_URL topilmadi`

`.env` fayli yo'q yoki bo'sh. `cp .env.example .env` qilib, ichini to'ldiring. Faylni yaratgandan keyin dev serverni **qayta ishga tushiring**.

### `/api/health` → `{"ok": false}` yoki 503

Ketma-ket tekshiring:

1. Docker ishlatayotgan bo'lsangiz: `docker ps` — konteyner ishlayaptimi?
2. Connection string'da user/parol/port to'g'rimi?
3. Neon ishlatayotgan bo'lsangiz `?sslmode=require` bormi?
4. `npm run db:push` bajarilganmi?
5. Vercel'da: env qo'shilgandan keyin **Redeploy** qilinganmi?

### `relation "providers" does not exist`

Jadvallar yaratilmagan:

```bash
npm run db:push
```

### `ECONNREFUSED 127.0.0.1:5432`

Lokal Postgres ishlamayapti:

```bash
docker start bayconnect-db          # Docker
brew services start postgresql@16   # macOS
sudo systemctl start postgresql     # Linux
```

### Neon: `too many connections`

Direct connection string ishlatilgan. Neon panelidan **`-pooler`** li manzilga o'ting.

### Sayt sekin ochilyapti

1. Neon region'i foydalanuvchilarga yaqinmi? (Frankfurt / Singapore)
2. Vercel funksiya region'i baza region'iga mos kelyaptimi? (**Settings → Functions → Region**)
3. Neon bepul tarifda 5 daqiqa faoliyatsizlikdan keyin "uxlaydi" — birinchi so'rov 1–3 soniya sekinroq bo'ladi. Bu normal.

### Port 3000 band

```bash
npm run dev -- -p 3001
```

---

## Litsenziya

Xususiy loyiha. Barcha huquqlar himoyalangan.
