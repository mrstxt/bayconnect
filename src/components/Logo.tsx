import Link from "next/link";
import Image from "next/image";

/**
 * bayConnect logotipi public/bayconnect.png faylidan olinadi.
 * Rasm wordmark formatida, shuning uchun `size` balandlik sifatida ishlatiladi.
 */
export function Logo({
  size = 38,
  light = false,
  href = "/",
  priority = false,
}: {
  size?: number;
  light?: boolean;
  href?: string;
  priority?: boolean;
}) {
  const width = Math.round(size * (5917 / 1375));

  return (
    <Link
      href={href}
      aria-label="bayConnect bosh sahifa"
      className={`group inline-flex items-center rounded-xl transition-transform duration-300 hover:scale-[1.015] ${
        light ? "bg-white px-3 py-2 shadow-sm ring-1 ring-white/15" : ""
      }`}
    >
      <Image
        src="/bayconnect.png"
        alt="bayConnect"
        width={width}
        height={size}
        priority={priority}
        className="h-auto w-auto object-contain"
        sizes={`${width}px`}
      />
    </Link>
  );
}
