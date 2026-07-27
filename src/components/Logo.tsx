import Link from "next/link";

export function Logo({
  size = 34,
  light = false,
  href = "/",
}: {
  size?: number;
  light?: boolean;
  href?: string;
}) {
  const ink = light ? "#FFFFFF" : "#006B55";
  const accent = light ? "#FFC400" : "#0717B8";

  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <span
        className="relative inline-flex items-center justify-center rounded-[13px] transition-transform duration-300 group-hover:scale-[1.04]"
        style={{
          width: size,
          height: size,
          background: light ? "rgba(255,255,255,0.12)" : "#006B55",
          boxShadow: light
            ? "inset 0 0 0 1px rgba(255,255,255,0.18)"
            : "0 8px 20px rgba(0,0,0,0.12)",
        }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none">
          <path
            d="M12 20.5V10.5M12 10.5c-1.4-2.8-4.6-3.8-6.5-2.8 1 1.8 2.7 2.8 4.6 2.8M12 10.5c1.4-2.8 4.6-3.8 6.5-2.8-1 1.8-2.7 2.8-4.6 2.8M12 10.5c0-2.8 1.8-5.5 4.6-5.5-0.9 2.7-1.9 4.5-3.6 5.5M12 10.5c0-2.8-1.8-5.5-4.6-5.5 0.9 2.7 1.9 4.5 3.6 5.5"
            stroke={light ? "#FFFFFF" : "#FFC400"}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className="text-[1.35rem] font-semibold tracking-tight leading-none"
        style={{ color: ink }}
      >
        bay
        <span style={{ color: accent }}>Club</span>
      </span>
    </Link>
  );
}
