# bayConnect

bayConnect - O'zbekiston bo'ylab turizm xizmatlarini topish uchun Next.js marketplace. Loyiha Vercel + Neon Postgres deployiga moslangan.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- PostgreSQL
- Drizzle ORM
- Vercel
- Neon Postgres

## Muhim Fayllar

```text
src/app                Sahifalar va API route'lar
src/components         UI komponentlar
src/db/schema.ts       Database schema
src/db/index.ts        Database ulanishi
scripts/seed.ts        Demo data
drizzle.config.ts      Drizzle config, DATABASE_URL orqali ishlaydi
vercel.json            Vercel build sozlamasi
public/bayconnect.png  Logo
```

## Environment

Loyiha uchun bitta majburiy env kerak:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

`.env.example` ichida lokal namuna bor. Real production URL'ni Neon beradi.

## Neon'dan DATABASE_URL Olish

1. `https://neon.tech` ga kiring.
2. `Create Project` bosing.
3. Project name: `bayconnect`.
4. Region tanlang. O'zbekiston uchun odatda `Singapore` yoki `Frankfurt` yaxshi.
5. Project ochilgach `Connection Details` bo'limiga kiring.
6. `Connection string`dan `Postgres` yoki `Node.js` formatini copy qiling.

Ko'rinishi taxminan shunday bo'ladi:

```env
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-example.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

`sslmode=require` borligiga e'tibor bering.

## Lokal Ishga Tushirish

```bash
npm install
cp .env.example .env
npm run dev
```

Brauzerda:

```text
http://localhost:3000
```

## Neon Database Jadval Yaratish

Neon URL'ni `.env` ichiga yozgandan keyin:

```bash
npm run db:push
```

Bu buyruq `src/db/schema.ts` asosida Neon database ichida kerakli jadvallarni yaratadi.

Demo ma'lumot kerak bo'lsa:

```bash
npm run db:seed
```

Diqqat: seed skript `providers`, `reviews` va `posts` jadvalidagi eski ma'lumotlarni o'chirib, demo ma'lumotlarni qayta yozadi.

## Vercelga Deploy

1. Kodni GitHub'ga push qiling:

```bash
git add .
git commit -m "prepare bayconnect for vercel"
git push
```

2. Vercel dashboard'da `Add New Project` bosing.
3. GitHub repository'ni tanlang.
4. Framework `Next.js` bo'lib turadi.
5. Vercel sozlamalari:

```text
Install Command: npm install
Build Command: npm run build
Root Directory: ./
```

6. `Settings -> Environment Variables` bo'limiga qo'shing:

```text
Name: DATABASE_URL
Value: Neon'dan olingan connection string
Environment: Production, Preview, Development
```

7. `Deploy` yoki env qo'shilgan bo'lsa `Redeploy` bosing.

## Deploydan Keyin Tekshirish

Sayt ochilgach health endpointni tekshiring:

```text
https://YOUR_DOMAIN.vercel.app/api/health
```

Yaxshi javob:

```json
{ "ok": true }
```

Agar `{ "ok": false }` yoki `500` chiqsa:

- Vercel `DATABASE_URL` env borligini tekshiring.
- Neon connection string to'g'ri va `sslmode=require` borligini tekshiring.
- `npm run db:push` ishlatilganini tekshiring.
- Env qo'shgandan keyin Vercel'da `Redeploy` qiling.

## Tekshiruv Buyruqlari

```bash
npm run lint
npm run typecheck
DATABASE_URL="postgresql://..." npm run build
```

Qisqa tekshiruv:

```bash
npm run check
```

## NPM Warninglar Haqida

Vercel build vaqtida shunaqa warning chiqishi mumkin:

```text
npm warn deprecated @esbuild-kit/esm-loader
npm warn deprecated @esbuild-kit/core-utils
```

Bu deployni to'xtatadigan xato emas. Muhim narsa log oxirida `Build failed` yoki `Error:` chiqmasligi.

`npm install` audit vulnerability signalini ko'rsatishi mumkin. Bu deployni avtomatik to'xtatmaydi, lekin keyinchalik dependency auditni alohida ko'rib chiqish tavsiya qilinadi.

## Foydali Endpointlar

- `GET /api/health` - database ulanishini tekshiradi.
- `POST /api/providers` - yangi xizmat ko'rsatuvchi qo'shadi.
- `POST /api/providers/by-ids` - tanlangan provider'larni qaytaradi.
- `POST /api/bookings` - bron/zayavka yaratadi.
