import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL topilmadi.\n" +
      "Avval `.env` faylini yarating:  cp .env.example .env\n" +
      "So'ng ichidagi DATABASE_URL qiymatini to'ldiring.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  // Push paytida nima o'zgarayotgani ko'rinib tursin.
  verbose: true,
  // Xavfli operatsiyalar (ustun o'chirish) uchun tasdiq so'raladi.
  strict: true,
});
