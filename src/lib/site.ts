/**
 * Saytning kanonik manzili.
 *
 * Tartib:
 *  1. NEXT_PUBLIC_SITE_URL — custom domen bo'lsa shuni yozing.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel prod domeni (barqaror).
 *  3. VERCEL_URL — preview deploy manzili (har deployda o'zgaradi).
 *  4. localhost — lokal ishlab chiqish.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${stripTrailingSlash(prod)}`;

  const preview = process.env.VERCEL_URL;
  if (preview) return `https://${stripTrailingSlash(preview)}`;

  return "http://localhost:3000";
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}
