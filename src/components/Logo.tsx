import Link from "next/link";
import Image from "next/image";

/**
 * bayConnect 2.0 — Logo + milliy ornament versiyasi
 * Rasmga plus variant: "medallion" — logo yonida kichik islomiy naqsh chip
 */
export function Logo({
  size = 38,
  light = false,
  href = "/",
  priority = false,
  showBadge = false,
}: {
  size?: number;
  light?: boolean;
  href?: string;
  priority?: boolean;
  /** "2.0" version badge ko'rsatish */
  showBadge?: boolean;
}) {
  const width = Math.round(size * (5917 / 1375));

  return (
    <Link
      href={href}
      aria-label="bayConnect bosh sahifa"
      className={`group relative inline-flex items-center gap-2 rounded-xl transition-transform duration-300 hover:scale-[1.02] ${
        light
          ? "bg-white/12 px-3 py-2 backdrop-blur-sm ring-1 ring-white/18"
          : ""
      }`}
    >
      {/* Asosiy logotip rasmi */}
      <Image
        src="/bayconnect.png"
        alt="bayConnect"
        width={width}
        height={size}
        priority={priority}
        className="h-auto w-auto object-contain"
        sizes={`${width}px`}
      />

      {/* Version badge — ixtiyoriy */}
      {showBadge && (
        <span
          className="inline-flex items-center rounded-lg border border-[#c8930a]/25 bg-[#c8930a]/10 px-1.5 py-0.5 text-[9px] font-black tracking-[0.06em] text-[#7a5500]"
          aria-label="Version 2.0"
        >
          2.0
        </span>
      )}
    </Link>
  );
}
