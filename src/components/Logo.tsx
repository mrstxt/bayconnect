import Link from "next/link";

/**
 * bayConnect logotipi — inline SVG.
 *
 * Yangilangan versiya: avvalgi PNG logo to'q yashil matnli bo'lib, to'q
 * fonda (footer) umuman ko'rinmas edi. Endi logo vektorda chiziladi —
 * har qanday o'lchamda aniq, tungi rejim varianti bor va qo'shimcha
 * HTTP so'rov talab qilmaydi (LCP uchun ham yaxshi).
 *
 * `priority` parametri avvalgi API bilan moslik uchun saqlanib qoldi —
 * inline SVG'ga kerak emas.
 */
export function Logo({
  size = 34,
  light = false,
  href = "/",
  priority: _priority = false,
}: {
  size?: number;
  light?: boolean;
  href?: string;
  /** @deprecated inline SVG uchun kerak emas — API mosligi uchun qoldirilgan */
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="bayConnect bosh sahifa"
      className="group inline-flex items-center gap-2.5"
    >
      <LogoMark size={size} />
      <span
        className="font-black leading-none tracking-[-0.02em]"
        style={{ fontSize: Math.round(size * 0.6) }}
      >
        <span className={light ? "text-white" : "text-[#123f34]"}>bay</span>
        <span className={light ? "text-[#ffc400]" : "text-[#006b55]"}>Connect</span>
      </span>
    </Link>
  );
}

/** Brend belgisi: yumaloq kvadrat ichida quyosh + tog'lar + yo'l chizig'i. */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-300 group-hover:scale-[1.04]"
    >
      <defs>
        <linearGradient id="bc-mark-bg" x1="6" y1="3" x2="43" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0b8267" />
          <stop offset="1" stopColor="#0c2b23" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#bc-mark-bg)" />
      <rect
        x="2.75"
        y="2.75"
        width="42.5"
        height="42.5"
        rx="12.25"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.5"
      />
      {/* quyosh */}
      <circle cx="31" cy="16" r="5.6" fill="#ffc400" />
      {/* orqa tog' */}
      <path d="M10 33.5 L20 17.5 L27.5 28 L31.5 22.5 L40 33.5 Z" fill="#bfe3d6" opacity="0.55" />
      {/* old tog' */}
      <path d="M14 33.5 L21.5 21.5 L26.5 28.5 L30.5 23 L38 33.5 Z" fill="#eaf4ef" />
      {/* ipak yo'li chizig'i */}
      <rect x="9" y="36" width="30" height="3.4" rx="1.7" fill="#ff6b4a" />
    </svg>
  );
}
