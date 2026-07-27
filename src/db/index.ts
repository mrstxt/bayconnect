import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Postgres pool + Drizzle klienti.
 *
 * Muhim nuqtalar:
 * - Pool LAZY yaratiladi. Modul import qilinishining o'zi ulanish ochmaydi va
 *   DATABASE_URL yo'q bo'lsa `next build` yiqilmaydi (faqat real query xato beradi).
 * - Serverless (Vercel) muhitida har bir lambda instansiyasi o'z poolini oladi.
 *   Shuning uchun `max` kichik bo'lishi shart, aks holda Neon connection limiti
 *   tez tugaydi. Prod'da 1, lokal dev'da 5.
 * - Pool `globalThis`da keshlanadi: dev'dagi HMR va serverless'dagi "warm start"
 *   paytida qayta-qayta pool yaratilishining oldini oladi.
 */

const globalForDb = globalThis as typeof globalThis & {
  __bayconnectPool?: Pool;
};

const isProd = process.env.NODE_ENV === "production";

function createPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL topilmadi. Lokalda `.env` faylini yarating (cp .env.example .env), " +
        "Vercel'da esa Settings → Environment Variables bo'limiga DATABASE_URL qo'shing.",
    );
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    // Serverless'da har instansiya uchun 1 ta ulanish yetarli va eng xavfsizi.
    max: isProd ? 1 : 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
    // Lambda "muzlab" qolganda bo'sh ulanishlar ushlab turilmasin.
    allowExitOnIdle: isProd,
  });

  // Fon xatolari process'ni o'ldirmasin (Neon idle ulanishni uzganda bo'ladi).
  pool.on("error", (err) => {
    console.error("[db] kutilmagan pool xatosi:", err.message);
  });

  return pool;
}

export function getPool(): Pool {
  if (!globalForDb.__bayconnectPool) {
    globalForDb.__bayconnectPool = createPool();
  }
  return globalForDb.__bayconnectPool;
}

/**
 * Drizzle klientini lazy qilib beruvchi proxy.
 * `db.select(...)` birinchi marta chaqirilgandagina pool ochiladi.
 */
let drizzleInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!drizzleInstance) {
    drizzleInstance = drizzle(getPool());
  }
  return drizzleInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
