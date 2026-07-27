/**
 * API uchun umumiy validatsiya va himoya yordamchilari.
 * Tashqi kutubxonasiz (zod qo'shilsa bundle kattalashadi, bu yerda shart emas).
 */

/** Oddiy, lekin amaliy email tekshiruvi. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value) && value.length <= 160;
}

/**
 * Telefon: raqamlar, bo'shliq, +, -, () ruxsat.
 * Eski kodda telefon umuman tekshirilmasdi — "asdasd" ham bazaga tushardi.
 */
export function isValidPhone(value: string): boolean {
  if (value.length < 7 || value.length > 40) return false;
  if (!/^[+\d][\d\s()\-.]*$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/** ISO sana (YYYY-MM-DD) va haqiqiy kalendar sanasi ekanini tekshiradi. */
export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Bugungi sana (UTC) — o'tgan sanaga bron qilishni bloklash uchun. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Matnni kesib, ortiqcha bo'shliqlarni tozalaydi. */
export function clean(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

/** Ko'p qatorli matn (bio, xabar) — qator ajratgichlar saqlanadi. */
export function cleanMultiline(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

/** String massiv: element uzunligi va soni cheklanadi. */
export function cleanStringArray(value: unknown, maxItems: number, maxLength = 40): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    const s = clean(item, maxLength);
    if (s && !out.includes(s)) out.push(s);
    if (out.length >= maxItems) break;
  }
  return out;
}

/* --------------------------- Rate limiting --------------------------- */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5_000;

/**
 * Xotiradagi oddiy rate limiter.
 *
 * Cheklov: serverless'da har bir instansiya o'z xotirasiga ega, shuning uchun
 * bu absolyut himoya emas — lekin bitta IP'dan keladigan oddiy spam va
 * tasodifiy double-submit'ni to'xtatadi. Jiddiy yuk kutilsa Upstash Redis yoki
 * Vercel Firewall'ga o'tish kerak.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Xotira o'smasligi uchun eskirganlarini tozalab turamiz.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/** Proxy orqasidagi mijoz IP manzilini aniqlaydi. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * JSON body'ni xavfsiz o'qiydi. Juda katta payload'ni rad etadi —
 * aks holda 10 MB JSON lambda xotirasini yeb qo'yishi mumkin.
 */
export async function readJson<T>(req: Request, maxBytes = 32_000): Promise<T | null> {
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) return null;

  try {
    const text = await req.text();
    if (text.length > maxBytes) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
