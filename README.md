# bayConnect

bayConnect - O'zbekiston bo'ylab turizm xizmatlarini topish uchun Next.js marketplace. Loyihada gidlar, tarjimonlar, fotograflar, tur agentlar, transfer xizmatlari, mehmonxonalar, blog va bron qilish API'lari bor.

## Texnologiyalar

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- PostgreSQL
- Drizzle ORM

## Loyiha strukturasi

```text
src/app                Next.js sahifalar va API route'lar
src/components         Umumiy UI komponentlar
src/db                 Drizzle schema va DB ulanishi
src/lib                Query, brand va client helperlar
scripts/seed.ts        Demo ma'lumotlar uchun seed skript
```

## Muhim environment variable

Loyiha `DATABASE_URL` bo'lmasa ishga tushmaydi. Bu qiymat lokalda ham, Vercel'da ham kerak.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

Vercel Postgres, Neon, Supabase yoki Railway Postgres ishlatsa bo'ladi. Production uchun SSL talab qilinadigan provayderlarda connection string oxirida `sslmode=require` borligini tekshiring.

## Lokal ishga tushirish

1. Dependency'larni o'rnating:

```bash
npm install
```

2. Lokal `.env` fayl yarating:

```bash
cp .env.example .env
```

Agar `.env.example` bo'lmasa, `.env` faylga kamida quyidagini yozing:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app_db"
```

3. PostgreSQL bazasini tayyorlang. Hozir loyihada migratsiya fayllari yo'q, shuning uchun jadval yaratish uchun quyidagi SQL'ni Postgres'da ishga tushiring:

```sql
create table if not exists providers (
  id serial primary key,
  full_name varchar(160) not null,
  category varchar(40) not null,
  sub_category varchar(40) not null default '',
  city varchar(80) not null,
  country varchar(80) not null default 'Uzbekistan',
  languages jsonb not null default '[]'::jsonb,
  price_per_day integer not null,
  experience_years integer not null default 0,
  capacity integer not null default 0,
  bio text not null,
  phone varchar(40) not null,
  email varchar(160) not null,
  avatar_emoji varchar(8) not null default '🌴',
  cover_color varchar(20) not null default 'orange',
  tags jsonb not null default '[]'::jsonb,
  rating numeric(3, 2) not null default '5.00',
  reviews_count integer not null default 0,
  verified boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create table if not exists bookings (
  id serial primary key,
  provider_id integer not null references providers(id) on delete cascade,
  client_name varchar(160) not null,
  client_email varchar(160) not null,
  client_phone varchar(40) not null,
  start_date varchar(20) not null,
  end_date varchar(20) not null,
  people_count integer not null default 1,
  message text not null default '',
  status varchar(20) not null default 'pending',
  created_at timestamp with time zone not null default now()
);

create table if not exists reviews (
  id serial primary key,
  provider_id integer not null references providers(id) on delete cascade,
  author_name varchar(160) not null,
  rating integer not null,
  comment text not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists posts (
  id serial primary key,
  title varchar(220) not null,
  slug varchar(240) not null unique,
  excerpt text not null,
  body text not null,
  emoji varchar(8) not null default '📖',
  cover_color varchar(20) not null default 'orange',
  category varchar(40) not null default 'guide',
  read_minutes integer not null default 3,
  created_at timestamp with time zone not null default now()
);
```

4. Demo ma'lumotlarni kiritish:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" npx tsx scripts/seed.ts
```

5. Development server:

```bash
npm run dev
```

Brauzerda `http://localhost:3000` ni oching.

## Tekshiruv buyruqlari

```bash
npm run typecheck
npm run lint
npm run build
```

Hozirgi ko'rik natijasi:

- `npm run typecheck` muvaffaqiyatli o'tdi.
- `DATABASE_URL` berilganda `npm run build` muvaffaqiyatli o'tdi.
- `npm run lint` hozircha yiqiladi: ko'p joyda JSX matnidagi apostroflar `react/no-unescaped-entities` qoidasiga tushgan, yana `FavoriteButton` va `Header` komponentlarida React effect ichida sinxron `setState` bo'yicha ogohlantirish bor.
- `npm install` yakunida `npm audit` 16 ta zaiflik signalini ko'rsatdi. Deploydan oldin `npm audit` qilib, kerakli dependency update'larni alohida tekshirish tavsiya etiladi.

## Vercel'ga deploy qilish

1. Loyihani GitHub repository'ga push qiling.

2. Vercel dashboard'da `Add New Project` tugmasini bosing va repository'ni tanlang.

3. Framework Preset sifatida `Next.js` tanlanganini tekshiring.

4. Build sozlamalari:

```text
Install Command: npm install
Build Command: npm run build
Output Directory: .next
Root Directory: ./
```

5. `Settings -> Environment Variables` bo'limiga quyidagini qo'shing:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

Bu variable `Production`, `Preview` va kerak bo'lsa `Development` environment'lari uchun qo'shilishi kerak.

6. Deploydan oldin production bazada jadval mavjud bo'lishi shart. Vercel build `DATABASE_URL` bo'lmasa to'xtaydi, runtime sahifalar esa jadval bo'lmasa 500 xatolik qaytaradi.

7. Demo data kerak bo'lsa, production DB URL bilan seed skriptni lokal terminalda bir marta ishga tushiring:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" npx tsx scripts/seed.ts
```

Diqqat: seed skript `providers`, `reviews` va `posts` jadvallaridagi mavjud ma'lumotlarni o'chirib, demo ma'lumotlarni qayta yozadi.

8. Vercel'da `Deploy` tugmasini bosing.

9. Deploy tugagach quyidagilarni tekshiring:

```text
/api/health
/
/experts
/transfer
/hotels
/blog
```

`/api/health` `{ "ok": true }` qaytarsa, server Postgres bilan bog'langan.

## Vercel Postgres variantlari

### Vercel Postgres yoki Neon

Vercel Storage orqali Postgres/Neon yaratganingizda Vercel ko'pincha `DATABASE_URL` ni avtomatik qo'shadi. Shunga qaramay `Settings -> Environment Variables` bo'limida qiymat borligini tekshiring.

### Supabase

Supabase'da `Project Settings -> Database -> Connection string` bo'limidan URI oling. Next.js serverless runtime uchun pooler connection string ishlatish ma'qul:

```text
postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?sslmode=require
```

## Deploy checklist

- `DATABASE_URL` Vercel'da qo'shilgan.
- Production Postgres'da `providers`, `bookings`, `reviews`, `posts` jadvallari yaratilgan.
- Kerak bo'lsa `scripts/seed.ts` bir marta ishga tushirilgan.
- `npm run typecheck` o'tgan.
- `DATABASE_URL=... npm run build` lokalda o'tgan.
- `npm run lint` xatolari alohida tuzatilgan yoki Vercel build jarayonida lint majburiy qilinmagan.
- `.env` va `.next` repository'ga commit qilinmagan.

## Foydali endpointlar

- `GET /api/health` - DB ulanishini tekshiradi.
- `POST /api/providers` - yangi xizmat ko'rsatuvchi qo'shadi.
- `POST /api/providers/by-ids` - tanlangan provider'larni qaytaradi.
- `POST /api/bookings` - bron/zayavka yaratadi.

## Eslatma

Hozirgi Drizzle config `drizzle.config.json` ichida lokal database URL bilan turibdi. Production migratsiyalarni Drizzle orqali yuritmoqchi bo'lsangiz, config'ni environment variable o'qiydigan `drizzle.config.ts` formatiga o'tkazish va `db:push` yoki migration skriptlarini qo'shish kerak bo'ladi.
