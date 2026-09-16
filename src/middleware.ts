import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * bayConnect 2.0 — Edge Middleware
 * - Content Security Policy (CSP) headers
 * - Language detection va cookie
 * - Bot / crawler filtri
 * - Rate limiting (edge-level, lightweight)
 * - Security headers
 */

/* ==========================================================================
   RATE LIMITING — Edge memory (per-region, lightweight)
   ========================================================================== */
const RATE_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT     = 120;   // 120 so'rov
const RATE_WINDOW_MS = 60_000; // 1 daqiqa ichida
const MAX_MAP_SIZE   = 10_000;

function edgeRateLimit(ip: string): boolean {
  const now = Date.now();

  // Xotira tozalash
  if (RATE_MAP.size > MAX_MAP_SIZE) {
    for (const [k, v] of RATE_MAP) {
      if (v.resetAt <= now) RATE_MAP.delete(k);
      if (RATE_MAP.size <= MAX_MAP_SIZE * 0.8) break;
    }
  }

  const entry = RATE_MAP.get(ip);
  if (!entry || entry.resetAt <= now) {
    RATE_MAP.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true; // ok
  }
  entry.count += 1;
  return entry.count <= RATE_LIMIT;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/* ==========================================================================
   SUPPORTED LANGUAGES
   ========================================================================== */
const SUPPORTED_LANGS  = ["uz", "en", "ru"] as const;
type LangCode = (typeof SUPPORTED_LANGS)[number];

function detectLang(req: NextRequest): LangCode {
  // 1. Cookie
  const cookie = req.cookies.get("bay_lang")?.value;
  if (cookie && SUPPORTED_LANGS.includes(cookie as LangCode)) return cookie as LangCode;

  // 2. Accept-Language header
  const accept = req.headers.get("accept-language");
  if (accept) {
    const codes = accept
      .split(",")
      .map((p) => p.split(";")[0].trim().toLowerCase().slice(0, 2));
    for (const c of codes) {
      if (SUPPORTED_LANGS.includes(c as LangCode)) return c as LangCode;
    }
  }
  return "uz";
}

/* ==========================================================================
   CONTENT SECURITY POLICY
   ========================================================================== */
function buildCsp(): string {
  const directives: Record<string, string[]> = {
    "default-src":     ["'self'"],
    "script-src":      [
      "'self'",
      "'unsafe-inline'",   // Next.js inline scripts uchun (ISR)
      "'unsafe-eval'",     // Next.js dev mode uchun (prod'da eval yo'q)
      "https://www.googletagmanager.com",
    ],
    "style-src":       ["'self'", "'unsafe-inline'"],
    "img-src":         ["'self'", "data:", "blob:", "https:"],
    "font-src":        ["'self'", "data:"],
    "connect-src":     [
      "'self'",
      "https://baytrip.vercel.app",
      "https://e-visa.gov.uz",
      "https://api.telegram.org",
    ],
    "frame-ancestors": ["'none'"],
    "object-src":      ["'none'"],
    "base-uri":        ["'self'"],
    "form-action":     ["'self'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([key, values]) =>
      values.length ? `${key} ${values.join(" ")}` : key
    )
    .join("; ");
}

/* ==========================================================================
   MIDDLEWARE
   ========================================================================== */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* --- API route'larga rate limiting --- */
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(req);
    if (!edgeRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests", retryAfter: 60 }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "X-RateLimit-Limit": String(RATE_LIMIT),
          },
        }
      );
    }
  }

  /* --- Bot filtri: /api/bookings va /api/subscriptions uchun --- */
  if (
    pathname.startsWith("/api/bookings") ||
    pathname.startsWith("/api/subscriptions")
  ) {
    const ua = req.headers.get("user-agent") ?? "";
    const isBot = /bot|crawl|spider|scraper|curl|wget|python|go-http/i.test(ua);
    if (isBot) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  /* --- Til tanlash cookie'si --- */
  const response = NextResponse.next();
  const lang = detectLang(req);

  // Cookie yo'q bo'lsa yozamiz (redirect qilmaymiz — SEO uchun)
  if (!req.cookies.has("bay_lang")) {
    response.cookies.set("bay_lang", lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: false, // Client JS ham o'qishi kerak
    });
  }

  /* --- Security headers --- */
  const h = response.headers;

  // CSP
  h.set("Content-Security-Policy", buildCsp());

  // Xavfsizlik sarlavhalari
  h.set("X-Content-Type-Options",    "nosniff");
  h.set("X-Frame-Options",           "DENY");
  h.set("X-XSS-Protection",          "1; mode=block");
  h.set("Referrer-Policy",           "strict-origin-when-cross-origin");
  h.set("Permissions-Policy",        "camera=(), microphone=(), geolocation=(), payment=()");
  h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  h.set("Cross-Origin-Opener-Policy",   "same-origin");
  h.set("Cross-Origin-Resource-Policy", "cross-origin");

  // Til header'i — sahifalar uchun
  h.set("X-Bay-Lang", lang);

  return response;
}

export const config = {
  matcher: [
    /*
     * Quyidagilardan TASHQARI barcha route'larga qo'llanadi:
     * - _next/static  (statik fayllar)
     * - _next/image   (rasm optimallashtirish)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public papkasidagi fayllar
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|bayconnect\\.png).*)",
  ],
};
