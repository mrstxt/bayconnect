import Link from "next/link";
import Image from "next/image";

export function Logo({
  size = 34,
  light = false,
  href = "/",
}: {
  size?: number;
  light?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="bayConnect bosh sahifa"
      className="group inline-flex items-center"
    >
      <span
        className={`relative inline-flex items-center overflow-hidden rounded-[8px] transition-transform duration-300 group-hover:scale-[1.025] ${
          light ? "bg-white/95 px-2 py-1" : ""
        }`}
        style={{
          width: size * 4.05,
          height: size,
        }}
      >
        <Image
          src="/bayconnect.png"
          alt="bayConnect"
          width={2048}
          height={512}
          priority
          className="h-full w-full object-contain"
        />
      </span>
    </Link>
  );
}
