import type { ReactNode } from "react";

/* ==========================================================================
   bayConnect 2.0 — Shared UI Components
   Milliy dizayn: Playfair sarlavhalar, lapis/feruza/zar badgelar,
   ornament dividerlar, premium karta stillari
   ========================================================================== */

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${
        align === "center" ? "text-center md:flex-col md:items-center" : ""
      }`}
    >
      <div className={align === "center" ? "max-w-2xl" : ""}>
        {eyebrow ? (
          <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-[#0d7377]/14 bg-[#0d7377]/07 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#0d7377]">
            {/* Kichik diamond ornament */}
            <span
              className="inline-block w-1.5 h-1.5 rounded-sm rotate-45 bg-[#c8930a]"
              aria-hidden="true"
            />
            {eyebrow}
          </div>
        ) : null}
        <h2
          className="text-[30px] md:text-[42px] font-black tracking-tight text-[#1a1a2e] leading-[1.08]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-[16px] leading-relaxed text-[#6b6b7b] max-w-xl">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* Badge — 5 tone, milliy ranglar */
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "orange" | "blue" | "green" | "dark" | "lapis" | "zar" | "feroza" | "gilem";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[#f5efe4] text-[#1a1a2e] border border-[#1b4a8a]/07",
    orange:  "bg-[#fff0e8] text-[#8b2500] border border-[#c1440e]/12",
    blue:    "bg-[#1b4a8a]/08 text-[#1b4a8a] border border-[#1b4a8a]/14",
    green:   "bg-[#0d7377]/08 text-[#0d7377] border border-[#0d7377]/14",
    dark:    "bg-[#1a1a2e] text-white border border-[#1a1a2e]",
    lapis:   "bg-[#1b4a8a]/08 text-[#1b4a8a] border border-[#1b4a8a]/16",
    zar:     "bg-[#c8930a]/10 text-[#7a5500] border border-[#c8930a]/20",
    feroza:  "bg-[#0d7377]/08 text-[#0d7377] border border-[#0d7377]/16",
    gilem:   "bg-[#c1440e]/08 text-[#8b2500] border border-[#c1440e]/16",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold ${tones[tone] ?? tones.neutral}`}
    >
      {children}
    </span>
  );
}

/* EmptyState */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-apple medallion-bg text-center py-20 px-6">
      {icon ? (
        <div className="relative z-10 mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-[#1b4a8a]/08 text-[#0d7377] apple-shadow">
          {icon}
        </div>
      ) : null}
      <h3
        className="relative z-10 mt-5 text-[22px] font-black tracking-tight text-[#1a1a2e]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h3>
      <p className="relative z-10 mt-2 text-[15px] text-[#6b6b7b] max-w-md mx-auto">
        {description}
      </p>
      {action ? (
        <div className="relative z-10 mt-6 flex justify-center">{action}</div>
      ) : null}
    </div>
  );
}

/* Stat — son + label */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="text-[28px] md:text-[36px] font-black tracking-tight text-[#1a1a2e]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {value}
      </div>
      <div className="mt-1 text-[13px] font-semibold text-[#6b6b7b]">{label}</div>
    </div>
  );
}

/* NationalDivider — milliy ornament ajratgich */
export function NationalDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c8930a]/30 to-transparent" />
      {label ? (
        <>
          <span
            className="inline-block w-2 h-2 rounded-sm rotate-45 bg-[#c8930a]/50 flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#6b6b7b] flex-shrink-0">
            {label}
          </span>
          <span
            className="inline-block w-2 h-2 rounded-sm rotate-45 bg-[#c8930a]/50 flex-shrink-0"
            aria-hidden="true"
          />
        </>
      ) : (
        <span
          className="inline-block w-2 h-2 rounded-sm rotate-45 bg-[#c8930a]/50 flex-shrink-0"
          aria-hidden="true"
        />
      )}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c8930a]/30 to-transparent" />
    </div>
  );
}

/* ArchFrame — Registon arch dekoratsiya wrapper */
export function ArchFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] ${className}`}>
      {/* Arch SVG dekoratsiyasi */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[45%] z-0 opacity-10"
        aria-hidden="true"
      >
        <svg viewBox="0 0 600 200" fill="none" className="w-full h-full">
          <path d="M60 200 L60 110 Q60 50 150 50 Q240 50 240 110 L240 200"
            stroke="white" strokeWidth="2.5" fill="none" />
          <path d="M240 200 L240 80 Q240 10 300 10 Q360 10 360 80 L360 200"
            stroke="white" strokeWidth="3.5" fill="none" />
          <path d="M360 200 L360 110 Q360 50 450 50 Q540 50 540 110 L540 200"
            stroke="white" strokeWidth="2.5" fill="none" />
        </svg>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
