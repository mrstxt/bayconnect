import type { ReactNode } from "react";

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
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#006b55]/12 bg-[#eaf4ef] px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.13em] text-[#006b55]">
            <span className="h-1 w-1 rounded-full bg-[#ff6b4a]" />
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-[32px] md:text-[42px] font-semibold tracking-tight text-[#123f34] leading-[1.08]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-[17px] leading-relaxed text-[#5f6864] max-w-xl">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "orange" | "blue" | "green" | "dark";
}) {
  const tones = {
    neutral: "bg-[#f7f2ed] text-[#123f34]",
    orange: "bg-[#fff0ea] text-[#b7472e]",
    blue: "bg-[#eef1ff] text-[#0717b8]",
    green: "bg-[#eaf4ef] text-[#006b55]",
    dark: "bg-[#123f34] text-white",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

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
    <div className="surface-apple text-center py-20 px-6">
      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-[#123f34]/[0.06] text-[#006b55] apple-shadow">
        {icon}
      </div>
      <h3 className="mt-5 text-[22px] font-semibold tracking-tight text-[#123f34]">{title}</h3>
      <p className="mt-2 text-[15px] text-[#5f6864] max-w-md mx-auto">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-[28px] md:text-[34px] font-semibold tracking-tight text-[#123f34]">
        {value}
      </div>
      <div className="mt-1 text-[13px] text-[#7b827f]">{label}</div>
    </div>
  );
}
