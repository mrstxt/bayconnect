/**
 * bayConnect 2.0 — API validatsiya va xavfsizlik yordamchilari.
 * Tashqi kutubxonasiz (zod qo'shilsa bundle kattalashadi, bu yerda shart emas).
 * XSS, SQLi, input overflow, rate limit — hammasi bu yerda.
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

/* ==========================================================================
   XSS HIMOYASI — HTML/script teglarni tozalash
   ========================================================================== */

/** Xavfli HTML teglarni escaping qiladi */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/** Script injection nishonalarini tekshiradi */
export function hasXssPattern(value: string): boolean {
  const patterns = [
    /<script[\s\S]*?>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
  ];
  return patterns.some((p) => p.test(value));
}

/* ==========================================================================
   SQL INJECTION PATTERN TEKSHIRUVI
   Drizzle ORM parametrli so'rovlardan foydalanadi, lekin qo'shimcha himoya.
   ========================================================================== */
export function hasSqlInjection(value: string): boolean {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE)\b)/i,
    /--\s/,
    /;\s*(DROP|DELETE|UPDATE|INSERT)/i,
    /\/\*[\s\S]*?\*\//,
    /'\s*(OR|AND)\s*'?\d/i,
  ];
  return patterns.some((p) => p.test(value));
}

/* ==========================================================================
   MILLIYLIK / PASPORT VALIDATSIYASI
   ========================================================================== */

/** Milliylik matnini tekshiradi (faqat harf va bo'shliq) */
export function isValidNationality(value: string): boolean {
  if (!value || value.length < 2 || value.length > 80) return false;
  return /^[\p{L}\s\-'\.]+$/u.test(value);
}

/** Pasport raqami — oddiy tekshiruv */
export function isValidPassportNumber(value: string): boolean {
  if (!value) return false;
  const cleaned = value.replace(/[\s\-]/g, "");
  return /^[A-Z0-9]{6,20}$/.test(cleaned);
}

/* ==========================================================================
   XABARNI TO'LIQ TOZALASH — booking va inquiry uchun
   ========================================================================== */
export function sanitizeBookingMessage(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().slice(0, 2000);
  if (hasXssPattern(trimmed)) return "";
  return trimmed;
}

/* ==========================================================================
   NATIONALITY WHITELIST — keng qamrovli
   ========================================================================== */
export const COMMON_NATIONALITIES = [
  "Afghan", "Albanian", "Algerian", "American", "Argentinian", "Armenian",
  "Australian", "Austrian", "Azerbaijani", "Bahraini", "Bangladeshi",
  "Belarusian", "Belgian", "Bolivian", "Bosnian", "Brazilian", "British",
  "Bulgarian", "Cambodian", "Canadian", "Chilean", "Chinese", "Colombian",
  "Croatian", "Czech", "Danish", "Dutch", "Egyptian", "Estonian", "Ethiopian",
  "Finnish", "French", "Georgian", "German", "Greek", "Hungarian", "Indian",
  "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Japanese",
  "Jordanian", "Kazakh", "Kenyan", "Korean", "Kuwaiti", "Kyrgyz", "Latvian",
  "Lebanese", "Lithuanian", "Macedonian", "Malaysian", "Mexican", "Moldovan",
  "Mongolian", "Moroccan", "Nepalese", "New Zealand", "Nigerian", "Norwegian",
  "Omani", "Pakistani", "Palestinian", "Peruvian", "Philippine", "Polish",
  "Portuguese", "Qatari", "Romanian", "Russian", "Saudi", "Serbian",
  "Singaporean", "Slovak", "Slovenian", "South African", "Spanish", "Sri Lankan",
  "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Thai", "Tunisian",
  "Turkish", "Turkmen", "Ukrainian", "Emirati", "Uzbek", "Venezuelan",
  "Vietnamese", "Yemeni", "Other",
] as const;

/* ==========================================================================
   IP XESH — PII saqlashni oldini olish
   ========================================================================== */

/**
 * IP manzilini xeshlaydi — to'g'ridan-to'g'ri IP saqlashdan qochish uchun.
 * Web Crypto API (Edge Runtime uchun ham ishlaydi).
 */
export async function hashIp(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT ?? "bayconnect-2024";
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const buf  = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32); // 32 hex = 128-bit, yetarli
}

/* ==========================================================================
   VISA INQUIRY VALIDATSIYASI (yangi)
   ========================================================================== */
export type VisaInquiryInput = {
  fullName: string;
  email: string;
  nationality: string;
  passportNumber: string;
  arrivalDate: string;
  departureDate: string;
  visaType: string;
  message: string;
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function validateVisaInquiry(
  raw: Record<string, unknown>
): ValidationResult<VisaInquiryInput> {
  const fullName = clean(raw.fullName, 160);
  if (!fullName || fullName.length < 2)
    return { ok: false, error: "Full name is required" };
  if (hasXssPattern(fullName) || hasSqlInjection(fullName))
    return { ok: false, error: "Invalid characters in name" };

  const email = clean(raw.email, 160).toLowerCase();
  if (!isValidEmail(email))
    return { ok: false, error: "Valid email is required" };

  const nationality = clean(raw.nationality, 80);
  if (!isValidNationality(nationality))
    return { ok: false, error: "Valid nationality is required" };

  const passportNumber = clean(raw.passportNumber, 40).toUpperCase();
  // Pasport raqami optional — faqat kiritilgan bo'lsa tekshiramiz
  if (passportNumber && !isValidPassportNumber(passportNumber))
    return { ok: false, error: "Invalid passport number format" };

  const arrivalDate = clean(raw.arrivalDate, 20);
  if (!isValidIsoDate(arrivalDate))
    return { ok: false, error: "Valid arrival date is required" };

  const departureDate = clean(raw.departureDate, 20);
  if (!isValidIsoDate(departureDate))
    return { ok: false, error: "Valid departure date is required" };

  if (arrivalDate >= departureDate)
    return { ok: false, error: "Departure must be after arrival" };

  const today = todayIso();
  if (arrivalDate < today)
    return { ok: false, error: "Arrival date cannot be in the past" };

  const VALID_VISA_TYPES = ["free", "evisa", "voa", "required"] as const;
  const visaType = clean(raw.visaType, 20);
  if (!VALID_VISA_TYPES.includes(visaType as (typeof VALID_VISA_TYPES)[number]))
    return { ok: false, error: "Invalid visa type" };

  const message = sanitizeBookingMessage(raw.message);

  return {
    ok: true,
    data: { fullName, email, nationality, passportNumber, arrivalDate, departureDate, visaType, message },
  };
}

/* ==========================================================================
   EXPERIENCE BOOKING VALIDATSIYASI (yangi)
   ========================================================================== */
export type ExpBookingInput = {
  experienceKey: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientNationality: string;
  preferredLang: string;
  date: string;
  peopleCount: number;
  message: string;
};

export function validateExpBooking(
  raw: Record<string, unknown>
): ValidationResult<ExpBookingInput> {
  const experienceKey = clean(raw.experienceKey, 80);
  if (!experienceKey || !/^[a-z0-9\-]+$/.test(experienceKey))
    return { ok: false, error: "Invalid experience key" };

  const clientName = clean(raw.clientName, 160);
  if (!clientName || clientName.length < 2)
    return { ok: false, error: "Name is required" };
  if (hasXssPattern(clientName))
    return { ok: false, error: "Invalid characters in name" };

  const clientEmail = clean(raw.clientEmail, 160).toLowerCase();
  if (!isValidEmail(clientEmail))
    return { ok: false, error: "Valid email is required" };

  const clientPhone = clean(raw.clientPhone, 40);
  if (!isValidPhone(clientPhone))
    return { ok: false, error: "Valid phone number is required" };

  const clientNationality = clean(raw.clientNationality ?? "", 80);
  const VALID_LANGS = ["uz", "en", "ru"] as const;
  const preferredLang = clean(raw.preferredLang ?? "en", 5);
  if (!VALID_LANGS.includes(preferredLang as (typeof VALID_LANGS)[number]))
    return { ok: false, error: "Invalid language" };

  const date = clean(raw.date, 20);
  if (!isValidIsoDate(date) || date < todayIso())
    return { ok: false, error: "Valid future date is required" };

  const peopleCount = Number(raw.peopleCount);
  if (!Number.isInteger(peopleCount) || peopleCount < 1 || peopleCount > 50)
    return { ok: false, error: "People count must be 1–50" };

  const message = sanitizeBookingMessage(raw.message);

  return {
    ok: true,
    data: {
      experienceKey, clientName, clientEmail, clientPhone,
      clientNationality, preferredLang, date, peopleCount, message,
    },
  };
}
