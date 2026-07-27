import Link from "next/link";
import Image from "next/image";

/**
 * Logo. `priority` faqat header'dagi nusxa uchun yoqiladi — footer'dagi
 * logo ham priority bo'lsa, brauzer ikkita rasmni "eng muhim" deb hisoblab
 * LCP'ni sekinlashtiradi.
 */
export function Logo({
  size = 34,
  light = false,
  href = "/",
  priority = false,
}: {
  size?: number;
  light?: boolean;
  href?: string;
  priority?: boolean;
}) {
  const width = Math.round(size * 4.05);

  return (
    <Link href={href} aria-label="bayConnect bosh sahifa" className="group inline-flex items-center">
      <span
        className={`relative inline-flex items-center overflow-hidden rounded-[8px] transition-transform duration-300 group-hover:scale-[1.025] ${
          light ? "bg-white/95 px-2 py-1" : ""
        }`}
        style={{ width, height: size }}
      >
        <Image
          src="/bayconnect.png"
          alt="bayConnect"
          // Manba 5917×1375 — brauzerga real ko'rsatiladigan o'lchamni beramiz,
          // shunda Next.js keraksiz katta variant generatsiya qilmaydi.
          width={width}
          height={size}
          sizes={`${width}px`}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="h-full w-full object-contain"
        />
      </span>
    </Link>
  );
}
