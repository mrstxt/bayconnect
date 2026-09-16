/**
 * Ro'yxat sahifalari (experts / transfer / hotels) uchun umumiy
 * query-string yordamchilari. Ilgari bu mantiq har bir sahifada
 * nusxalanган edi (makeHref uch joyda takrorlangan).
 */

export type ListSearchParams = {
  category?: string;
  type?: string;
  city?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: string;
};

export const SORT_OPTIONS = ["rating", "reviews", "price_asc", "price_desc", "newest"] as const;
export type SortKey = (typeof SORT_OPTIONS)[number];

/** Ruxsat etilgan saralash qiymatini qaytaradi (aks holda default). */
export function safeSort(value: string | undefined): SortKey {
  return SORT_OPTIONS.includes(value as SortKey) ? (value as SortKey) : "rating";
}

/** Sahifa raqamini xavfsiz songa aylantiradi. */
export function safePage(value: string | undefined): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  // Juda katta OFFSET bilan bazani charchatib qo'ymaslik uchun cheklov.
  return Math.min(Math.trunc(n), 500);
}

/** Foydalanuvchi qidiruvini cheklaydi (juda uzun satr = og'ir LIKE). */
export function safeQuery(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, 80);
}

/** Narx filtri: manfiy va bema'ni qiymatlarni tozalaydi. */
export function safePrice(value: string | undefined): string | undefined {
  const n = Number(value);
  if (!value || !Number.isFinite(n) || n < 0 || n > 1_000_000) return undefined;
  return String(Math.trunc(n));
}

/**
 * Joriy filtrlarni saqlagan holda yangi URL yasaydi.
 * `page` avtomatik tushiriladi — filtr o'zgarganda 1-sahifadan boshlanadi.
 */
export function buildHref(
  basePath: string,
  current: Record<string, string | undefined>,
  override: Record<string, string | number | undefined> = {},
): string {
  const params = new URLSearchParams();
  const merged: Record<string, string | number | undefined> = { ...current, ...override };

  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === "" || value === null) continue;
    if (key === "page" && Number(value) <= 1) continue;
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
