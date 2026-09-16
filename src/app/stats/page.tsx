import type { Metadata } from "next";
import Link from "next/link";
import { getPlatformStats } from "@/lib/queries";
import { categoryEmoji, categoryLabel, categoryGradient } from "@/lib/brand";
import { Section, SectionHeading } from "@/components/ui";
import {
  CheckIcon,
  UsersIcon,
  PinIcon,
  GlobeGridIcon,
  CompassIcon,
} from "@/components/Icon";

/**
 * ISR: statistika 5 daqiqada bir yangilanadi. Shuningdek, bot yoki web forma
 * orqali yangi registratsiya bo'lganda `revalidateTag("providers")` keshni
 * darhol bekor qiladi — raqamlar darhol to'g'rilanadi.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Platforma statistikasi",
  description:
    "bayConnect'dagi soha vakillari soni, Telegram bot va web orqali ro'yxatdan o'tish statistikasi, shaharlar kesimi va so'nggi qo'shilgan mutaxassislar — jonli raqamlarda.",
  alternates: { canonical: "/stats" },
};

/** Kichik UZ vaqt formatteri: "3 kun oldin" kabi. */
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return "hozir";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "hozir";
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "kecha";
  if (days < 7) return `${days} kun oldin`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} hafta oldin`;
  const months = Math.floor(days / 30);
  return `${Math.max(1, months)} oy oldin`;
}

export default async function StatsPage() {
  const stats = await getPlatformStats();
  const { providers: p, bookings: b } = stats;
  const maxCategory = Math.max(1, ...stats.categories.map((c) => c.count));
  const empty = p.total === 0;

  const topCards = [
    {
      Icon: UsersIcon,
      label: "Jami soha vakillari",
      value: p.total,
      note: p.thisMonth > 0 ? `+${p.thisMonth} shu oyda` : "Platformada ro'yxatdan o'tgan",
      accent: "green" as const,
    },
    {
      Icon: GlobeGridIcon,
      label: "Telegram bot orqali",
      value: p.viaBot,
      note: p.total > 0 ? `${Math.round((p.viaBot / p.total) * 100)}% mutaxassislardan` : "Bot registratsiyasi",
      accent: "coral" as const,
    },
    {
      Icon: CompassIcon,
      label: "Web forma orqali",
      value: p.viaWeb,
      note: p.total > 0 ? `${Math.round((p.viaWeb / p.total) * 100)}% mutaxassislardan` : "Saytdagi forma",
      accent: "blue" as const,
    },
    {
      Icon: CheckIcon,
      label: "Jami zayavkalar",
      value: b.total,
      note: b.thisWeek > 0 ? `+${b.thisWeek} so'nggi 7 kunda` : "Mijozlardan kelgan bronlar",
      accent: "gold" as const,
    },
  ];

  const accentStyles = {
    green: "bg-[#eaf4ef] text-[#006b55] ring-[#006b55]/10",
    coral: "bg-[#fff0ec] text-[#e05235] ring-[#ff6b4a]/15",
    blue: "bg-[#eef1ff] text-[#0717b8] ring-[#0717b8]/10",
    gold: "bg-[#fff8e3] text-[#8a6d00] ring-[#ffc400]/25",
  } as const;

  return (
    <>
      {/* HERO */}
      <Section className="pt-14 pb-10 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-[#006b55]/15 bg-white/75 px-4 py-2 text-[12px] font-bold text-[#006b55] shadow-[0_10px_30px_rgba(12,43,35,0.08)] backdrop-blur">
            <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-[#ff6b4a]" />
            Jonli ma'lumot — 5 daqiqada yangilanadi
          </div>
          <h1 className="animate-fade-up delay-2 mt-7 text-[38px] font-black leading-[1.05] tracking-tight text-[#123f34] sm:text-[52px] md:text-[64px]">
            Platforma <span className="hero-title-accent">raqamlarda.</span>
          </h1>
          <p className="animate-fade-up delay-3 mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-[#506861]">
            Soha vakillari, Telegram bot orqali ro'yxatdan o'tganlar va shaharlar kesimi —
            hammasi ochiq va shaffof.
          </p>
        </div>
      </Section>

      {empty ? (
        <Section className="pb-20">
          <div className="surface-apple-strong mx-auto max-w-2xl p-10 text-center">
            <div className="text-5xl">🌱</div>
            <h2 className="mt-4 text-[24px] font-bold tracking-tight">Hozircha statistika bo'sh</h2>
            <p className="mt-2 text-[15px] text-[#5f6864]">
              Birinchi mutaxassislar ro'yxatdan o'tgach, bu sahifa jonli raqamlar bilan to'ladi.
            </p>
            <Link href="/register" className="btn-primary mt-6 inline-flex !px-7 !py-3.5 text-[14px]">
              Birinchi bo'lib qo'shilish
            </Link>
          </div>
        </Section>
      ) : (
        <>
          {/* TOP STAT CARDS */}
          <Section className="pb-14">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {topCards.map((card, i) => (
                <div
                  key={card.label}
                  className="stat-card animate-fade-up p-5"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ring-1 ${accentStyles[card.accent]}`}
                  >
                    <card.Icon size={22} strokeWidth={1.8} />
                  </span>
                  <div className="mt-3 text-[34px] font-black tracking-tight leading-none">
                    {card.value}
                  </div>
                  <div className="mt-1.5 text-[13px] font-bold text-[#123f34]">{card.label}</div>
                  <div className="mt-0.5 text-[12px] font-medium text-[#7b827f]">{card.note}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* SOHA VAKILLARI + TOP SHAHARLAR */}
          <Section className="defer-paint pb-14">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Kategoriyalar kesimi */}
              <div className="surface-apple-strong p-7 md:p-9">
                <SectionHeading
                  eyebrow="Soha vakillari"
                  title="Kategoriyalar kesimi"
                  subtitle="Har bir sohada nechta mutaxassis e'lon qilingan."
                />
                <div className="mt-8 space-y-5">
                  {stats.categories.map((c) => {
                    const share = Math.round((c.count / Math.max(1, p.total)) * 100);
                    return (
                      <div key={c.key}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[16px]"
                              style={{ background: categoryGradient(c.key === "hotel" ? "yellow" : c.key === "transfer" ? "blue" : c.key === "translator" ? "dark" : c.key === "tour_agent" ? "blue" : "orange") }}
                            >
                              <span className="drop-shadow-sm">{categoryEmoji(c.key)}</span>
                            </span>
                            <span className="truncate text-[15px] font-bold text-[#123f34]">
                              {categoryLabel(c.key)}
                            </span>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="text-[18px] font-black tracking-tight">{c.count}</span>
                            <span className="ml-1.5 text-[12px] font-semibold text-[#7b827f]">{share}%</span>
                          </div>
                        </div>
                        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#123f34]/[0.06]">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.max(4, (c.count / maxCategory) * 100)}%`,
                              background: categoryGradient(c.key === "hotel" ? "yellow" : c.key === "transfer" ? "blue" : c.key === "translator" ? "dark" : c.key === "tour_agent" ? "blue" : "orange"),
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top shaharlar */}
              <div className="surface-apple-strong p-7 md:p-9">
                <SectionHeading
                  eyebrow="Geografiya"
                  title="Faol shaharlar"
                  subtitle="Mutaxassislar eng ko'p jamlangan yo'nalishlar."
                />
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {stats.cities.map((c, i) => (
                    <Link
                      key={c.city}
                      href={`/experts?city=${encodeURIComponent(c.city)}`}
                      className="quick-access-card group flex items-center gap-3 p-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf4ef] text-[#006b55]">
                        <PinIcon size={17} strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14.5px] font-bold text-[#123f34]">{c.city}</span>
                        <span className="block text-[12px] font-medium text-[#7b827f]">
                          {c.count} ta mutaxassis
                        </span>
                      </span>
                      {i === 0 ? (
                        <span className="ml-auto shrink-0 rounded-full bg-[#ff6b4a] px-2 py-0.5 text-[10px] font-black text-white">
                          TOP
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* SO'NGGI RO'YXATDAN O'TGANLAR */}
          <Section className="defer-paint pb-14">
            <SectionHeading
              eyebrow="Yangi a'zolar"
              title="So'nggi ro'yxatdan o'tganlar"
              subtitle="Bot va web orqali qo'shilgan eng so'nggi profillar."
            />
            <div className="surface-apple-strong mt-10 divide-y divide-[#123f34]/[0.06] overflow-hidden">
              {stats.recent.map((r) => (
                <Link
                  key={r.id}
                  href={`/providers/${r.id}`}
                  className="group flex items-center gap-4 px-6 py-4 transition hover:bg-[#fbf7f1] md:px-8"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[18px] text-white shadow-sm"
                    style={{ background: categoryGradient(r.coverColor) }}
                  >
                    {categoryEmoji(r.category)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold text-[#123f34] group-hover:underline underline-offset-4">
                      {r.fullName}
                    </span>
                    <span className="block text-[12.5px] font-medium text-[#7b827f]">
                      {categoryLabel(r.category)} · {r.city}
                    </span>
                  </span>
                  <span
                    className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black sm:inline-flex ${
                      r.viaBot
                        ? "bg-[#eef1ff] text-[#0717b8]"
                        : "bg-[#eaf4ef] text-[#006b55]"
                    }`}
                  >
                    {r.viaBot ? "🤖 Bot orqali" : "🌐 Web orqali"}
                  </span>
                  <span className="w-24 shrink-0 text-right text-[12px] font-semibold text-[#7b827f]">
                    {timeAgo(r.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
          </Section>

          {/* ZAYAVKALAR HOLATI */}
          <Section className="defer-paint pb-14">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="surface-apple-strong flex items-center gap-5 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff8e3] text-[#8a6d00] ring-1 ring-[#ffc400]/25">
                  <CheckIcon size={22} strokeWidth={2} />
                </span>
                <div>
                  <div className="text-[26px] font-black tracking-tight leading-none">{b.pending}</div>
                  <div className="mt-1 text-[13px] font-bold text-[#123f34]">Kutayotgan zayavkalar</div>
                  <div className="text-[12px] text-[#7b827f]">Mutaxassis javobini kutmoqda</div>
                </div>
              </div>
              <div className="surface-apple-strong flex items-center gap-5 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4ef] text-[#006b55] ring-1 ring-[#006b55]/10">
                  <UsersIcon size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <div className="text-[26px] font-black tracking-tight leading-none">{p.verified}</div>
                  <div className="mt-1 text-[13px] font-bold text-[#123f34]">Tekshirilgan profillar</div>
                  <div className="text-[12px] text-[#7b827f]">Verified belgisini olgan mutaxassislar</div>
                </div>
              </div>
            </div>
          </Section>
        </>
      )}

      {/* CTA */}
      <Section className="defer-paint pb-20">
        <div className="dark-panel relative overflow-hidden rounded-[32px] p-8 text-white apple-shadow-lg md:p-12">
          <div className="dot-grid-light" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_auto]">
            <div>
              <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/60">
                Soha vakillasizmi?
              </div>
              <h2 className="mt-3 text-[28px] font-semibold leading-[1.08] tracking-tight md:text-[38px]">
                Statistikani birga o'stiramiz
              </h2>
              <p className="mt-3 max-w-xl text-[16px] text-white/80">
                Telegram bot orqali 2 daqiqada ro'yxatdan o'ting — profilingiz shu ro'yxatda va
                katalogda darhol paydo bo'ladi.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/register" className="btn-gold !px-8 !py-4 text-[15px]">
                Hozir qo'shilish
              </Link>
              <Link href="/experts" className="btn-primary !px-8 !py-4 text-center text-[15px]">
                Mutaxassislar
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
