import Link from "next/link";
import { db } from "@/db";
import { providers } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { ProviderCard } from "@/components/ProviderCard";
import {
  EXPERT_CATEGORIES,
  TRANSFER_TYPES,
  categoryGradient,
  PARTNER_NAME,
  PARTNER_URL,
} from "@/lib/brand";
import { Section, SectionHeading } from "@/components/ui";
import {
  GuideIcon,
  TranslatorIcon,
  PhotographerIcon,
  TourAgentIcon,
  TransferIcon,
  HotelIcon,
  CarIcon,
  TransferTypeIcon,
  CheckIcon,
  UsersIcon,
  ExternalLinkIcon,
  HandshakeIcon,
  MountainIcon,
  BusIcon,
  GlobeGridIcon,
} from "@/components/Icon";

export const dynamic = "force-dynamic";

const EXPERT_ICON_NODES = {
  guide: GuideIcon,
  translator: TranslatorIcon,
  photographer: PhotographerIcon,
  tour_agent: TourAgentIcon,
} as const;

export default async function HomePage() {
  const [featured, statsRow] = await Promise.all([
    db.select().from(providers).orderBy(desc(providers.rating), desc(providers.reviewsCount)).limit(6),
    db
      .select({
        total: sql<number>`count(*)::int`,
        verified: sql<number>`count(*) filter (where ${providers.verified} = true)::int`,
        guides: sql<number>`count(*) filter (where ${providers.category} = 'guide')::int`,
        transfers: sql<number>`count(*) filter (where ${providers.category} = 'transfer')::int`,
        hotels: sql<number>`count(*) filter (where ${providers.category} = 'hotel')::int`,
      })
      .from(providers),
  ]);

  const stats = statsRow[0] ?? { total: 0, verified: 0, guides: 0, transfers: 0, hotels: 0 };

  const quickAccess = [
    { href: "/experts?category=guide", Icon: GuideIcon, title: "Gidlar", sub: "Tarix va madaniyat" },
    { href: "/transfer", Icon: CarIcon, title: "Transfer", sub: "Yengil avto → avtobus" },
    { href: "/hotels", Icon: HotelIcon, title: "Mehmonxonalar", sub: "Qulay joylashuv" },
    { href: PARTNER_URL, Icon: TourAgentIcon, title: "Turlar", sub: PARTNER_NAME, external: true },
  ];

  return (
    <>
      {/* HERO */}
      <section className="identity-hero noise relative overflow-hidden min-h-[760px]">
        <div className="identity-mountain" />
        <div className="identity-river" />
        <div className="identity-arc -right-16 top-28 hidden md:block" />
        <div className="identity-arc-coral -left-24 bottom-20 hidden md:block" />

        <FloatingBubble className="left-[9%] top-16 hidden md:flex" tone="blue" Icon={GlobeGridIcon} />
        <FloatingBubble className="right-[18%] top-20 hidden md:flex" tone="yellow" Icon={MountainIcon} />
        <FloatingBubble className="left-[25%] bottom-24 hidden lg:flex" tone="blue" Icon={TransferIcon} />
        <FloatingBubble className="right-[14%] bottom-28 hidden lg:flex" tone="yellow" Icon={BusIcon} />

        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-16 md:pt-24 md:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[#006b55]/10 bg-white/60 backdrop-blur px-4 py-2 text-[12px] font-semibold text-[#006b55] shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]" />
              O'zbekiston bo'ylab turizm xizmatlari
            </div>

            <div className="animate-fade-up delay-1 mt-8 inline-flex items-center gap-5 rounded-[34px] bg-white/52 px-6 py-5 backdrop-blur-xl ring-1 ring-[#006b55]/10 shadow-[0_24px_70px_rgba(18,63,52,0.10)] md:px-8">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px] border-2 border-[#006b55] bg-[#fffaf5] text-[#006b55] md:h-24 md:w-24">
                <MountainIcon size={48} strokeWidth={1.55} />
              </span>
              <span className="text-left text-[42px] font-semibold tracking-[-0.055em] leading-none text-[#006b55] sm:text-[58px] md:text-[76px]">
                bayClub
              </span>
            </div>

            <h1 className="animate-fade-up delay-2 mt-8 text-[36px] font-semibold tracking-[-0.035em] leading-[1.05] text-[#123f34] sm:text-[48px] md:text-[64px]">
              Turizm xizmatlarini topish endi ancha oson.
            </h1>

            <p className="animate-fade-up delay-3 mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-[#5f6864] md:text-[20px]">
              Gid, tarjimon, fotograf, transfer va mehmonxona xizmatlarini bitta joyda ko'ring.
              Keraklisini tanlang, profilni tekshiring va to'g'ridan-to'g'ri zayavka yuboring.
            </p>

            <div className="animate-fade-up delay-4 mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/experts" className="btn-primary !px-7 !py-3.5 text-[15px]">
                Mutaxassisni topish
              </Link>
              <a
                href={PARTNER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0717b8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(7,23,184,0.20)] transition hover:scale-[1.02] hover:bg-[#06139d]"
              >
                Turlar — {PARTNER_NAME}
                <ExternalLinkIcon size={15} strokeWidth={2} />
              </a>
            </div>

            <div className="animate-fade-up delay-5 mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#5f6864]">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon size={14} strokeWidth={2} className="text-[#006b55]" />
                Tekshirilgan profillar
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon size={14} strokeWidth={2} className="text-[#006b55]" />
                Shaffof narxlar
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon size={14} strokeWidth={2} className="text-[#006b55]" />
                Tez zayavka
              </span>
            </div>
          </div>

          {/* Quick access cards */}
          <div className="relative mt-14 md:mt-18">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
              {quickAccess.map((item, i) =>
                item.external ? (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`animate-fade-up delay-${i + 1} identity-card group relative rounded-[24px] p-4 transition hover:-translate-y-1`}
                  >
                    <span className="absolute right-3 top-3 text-[#0717b8]">
                      <ExternalLinkIcon size={13} strokeWidth={2} />
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0717b8] text-white">
                      <item.Icon size={22} />
                    </span>
                    <div className="mt-3 text-[15px] font-semibold tracking-tight text-[#123f34]">{item.title}</div>
                    <div className="mt-0.5 text-[12px] text-[#7b827f]">Hamkor · {item.sub}</div>
                  </a>
                ) : (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`animate-fade-up delay-${i + 1} identity-card group rounded-[24px] p-4 transition hover:-translate-y-1`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#006b55] text-white">
                      <item.Icon size={22} />
                    </span>
                    <div className="mt-3 text-[15px] font-semibold tracking-tight text-[#123f34]">{item.title}</div>
                    <div className="mt-0.5 text-[12px] text-[#7b827f]">{item.sub}</div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section className="py-16">
        <div className="rounded-[36px] border border-black/[0.06] bg-[#f5f5f7] p-8 md:p-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-[12px] font-semibold tracking-[0.14em] uppercase text-[#006b55]">
                bayClub haqida
              </div>
              <h2 className="mt-4 text-[32px] md:text-[44px] font-semibold tracking-tight leading-[1.05]">
                Sayohatni tashkillashtirishning eng oson yo'li.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-[#6e6e73]">
                bayClub — bu O'zbekiston va Markaziy Osiyoning turizm mutaxassislarini bir
                platformada birlashtirgan marketplace. Bu yerda siz gid, tarjimon, fotograf,
                transfer haydovchisi va mehmonxonalarni bir necha daqiqada topib bron
                qilishingiz mumkin.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {[
                  "Ishonchli va tekshirilgan xizmatlar",
                  "Shaffof narxlar — yashirin to'lov yo'q",
                  "Real mijoz sharhlari va reyting",
                  "To'g'ridan-to'g'ri aloqa — vositachisiz",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-[#006b55] text-white flex items-center justify-center">
                      <CheckIcon size={13} strokeWidth={2.4} />
                    </div>
                    <p className="text-[14px] text-[#123f34] leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard Icon={TourAgentIcon} value={`${stats.total}+`} label="Mutaxassis" />
              <StatCard Icon={CheckIcon} value={`${stats.verified}`} label="Verified" />
              <StatCard Icon={GuideIcon} value={`${stats.guides}`} label="Gidlar" />
              <StatCard Icon={HotelIcon} value={`${stats.hotels}`} label="Mehmonxona" />
            </div>
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section className="py-16">
        <SectionHeading
          eyebrow="Xizmatlar"
          title="bayClub'da nimalar bor?"
          subtitle="Sayohatingiz uchun kerak bo'lgan har bir xizmat — bir platformada."
        />

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ServiceBigCard href="/experts?category=guide" Icon={GuideIcon} title="Mahalliy gidlar" desc="Registon, Ichan-Qal'a, tog' yo'llari — har bir shahar bo'yicha tajribali gidlar." color="orange" />
          <ServiceBigCard href="/experts?category=translator" Icon={TranslatorIcon} title="Tarjimonlar" desc="Sinxron, ketma-ket va yo'riqnoma tarjima. 10 dan ortiq tillar bo'yicha." color="dark" />
          <ServiceBigCard href="/experts?category=photographer" Icon={PhotographerIcon} title="Fotograflar" desc="Sayohat kadrlari va professional portret. Drone va video xizmatlari ham." color="orange" />
          <ServiceBigCard href="/transfer" Icon={TransferIcon} title="Transfer xizmatlari" desc="Yengil avtodan avtobusgacha — har qanday guruh va marshrut uchun." color="blue" />
          <ServiceBigCard href="/hotels" Icon={HotelIcon} title="Mehmonxonalar" desc="Butik mehmonxonalardan zamonaviy 4* mehmonxonalargacha." color="yellow" />
          <ServiceBigCard
            href={PARTNER_URL}
            external
            Icon={TourAgentIcon}
            title="Tayyor tur paketlar"
            desc={`Ipak Yo'li, tog' sarguzashti va boshqa marshrutlar — hamkorimiz ${PARTNER_NAME} platformasida.`}
            color="blue"
          />
        </div>
      </Section>

      {/* EXPERTS */}
      <Section className="py-16">
        <SectionHeading
          eyebrow="Mutaxassislar"
          title="Sayohatingizga hamroh tanlang"
          subtitle="Gid, tarjimon, fotograf va tur agentlari."
          action={
            <Link href="/experts" className="hidden md:inline-flex text-[14px] font-semibold text-[#0717b8] hover:underline underline-offset-4">
              Barchasi →
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {EXPERT_CATEGORIES.map((c) => {
            const Icon = EXPERT_ICON_NODES[c.key as keyof typeof EXPERT_ICON_NODES];
            return (
              <Link
                key={c.key}
                href={`/experts?category=${c.key}`}
                className="group relative overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-5 md:p-6 card-lift"
              >
                <div
                  className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
                  style={{ background: c.color === "dark" ? "#123f34" : c.color === "blue" ? "#0717b8" : "#ff6b4a" }}
                />
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ background: categoryGradient(c.color) }}
                >
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <div className="relative mt-5">
                  <div className="text-[17px] font-semibold tracking-tight">{c.label}</div>
                  <div className="mt-1 text-[13px] text-[#86868b] leading-relaxed line-clamp-2">
                    {c.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* TRANSFER TYPES */}
      <Section className="py-16">
        <SectionHeading
          eyebrow="Transfer"
          title="Yengil avtodan avtobusgacha."
          subtitle="Har qanday guruh va yo'nalish uchun mos transport tanlang."
          action={
            <Link href="/transfer" className="hidden md:inline-flex text-[14px] font-semibold text-[#0717b8] hover:underline underline-offset-4">
              Barchasi →
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {TRANSFER_TYPES.map((t) => (
            <Link
              key={t.key}
              href={`/transfer?type=${t.key}`}
              className="group rounded-[24px] border border-black/[0.06] bg-white p-5 card-lift text-center"
            >
              <span className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-[#eef1ff] text-[#0717b8]">
                <TransferTypeIcon type={t.key} size={28} />
              </span>
              <div className="mt-4 text-[15px] font-semibold tracking-tight">{t.label}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#86868b]">
                <UsersIcon size={12} /> {t.capacity} kishi
              </div>
              <div className="mt-2 text-[11px] text-[#86868b] leading-relaxed line-clamp-2">
                {t.description}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* PARTNER PROMO — bayTrip */}
      <Section className="py-16">
        <a
          href={PARTNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0717b8] via-[#0d2097] to-[#123f34] text-white p-8 md:p-14 block"
        >
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#ffc400]/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-[#ff6b4a]/18 blur-3xl" />
          <div className="relative grid md:grid-cols-[auto_1.4fr_auto] gap-8 items-center">
            <span className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-white">
              <HandshakeIcon size={32} strokeWidth={1.6} />
            </span>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.14em] uppercase text-white/70">
                Rasmiy hamkorimiz
              </div>
              <h2 className="mt-3 text-[30px] md:text-[40px] font-semibold tracking-tight leading-[1.05]">
                Tayyor tur paketlari uchun {PARTNER_NAME}'ga tashrif buyuring
              </h2>
              <p className="mt-3 text-[16px] text-white/80 max-w-xl">
                Ipak Yo'li, tog' sarguzashtlari va boshqa marshrutlar bo'yicha tayyor
                paketlarni bayClub emas, hamkorimiz {PARTNER_NAME} platformasi taqdim etadi.
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white text-[#123f34] px-6 py-3.5 text-[14px] font-semibold group-hover:bg-[#ffc400] group-hover:text-[#123f34] transition">
              {PARTNER_NAME}.vercel.app
              <ExternalLinkIcon size={15} strokeWidth={2} />
            </span>
          </div>
        </a>
      </Section>

      {/* TOP EXPERTS */}
      <Section className="py-16">
        <SectionHeading
          eyebrow="Tanlanganlar"
          title="Yulduzli mutaxassislar"
          subtitle="Eng yuqori baho va tajribaga ega hamrohlar."
          action={
            <Link href="/experts" className="hidden md:inline-flex text-[14px] font-semibold text-[#0717b8] hover:underline underline-offset-4">
              Katalog →
            </Link>
          }
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <ProviderCard key={p.id} p={p} priority />
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <section className="mt-16 py-20 bg-[#f5f5f7]">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            align="center"
            eyebrow="Oddiy jarayon"
            title="Uch qadam. Hammasi shu."
            subtitle="Keraksiz murakkabliksiz — faqat natija."
          />

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Tanlang", desc: "Kategoriya, shahar yoki narx bo'yicha mos xizmatni toping." },
              { step: "02", title: "Tekshiring", desc: "Reyting, sharhlar, tillar va tajribani bir qarashda ko'ring." },
              { step: "03", title: "Bron qiling", desc: "Zayavka yuboring — mutaxassis tez orada siz bilan bog'lanadi." },
            ].map((item) => (
              <div key={item.step} className="rounded-[28px] bg-white border border-black/[0.05] p-7 apple-shadow">
                <div className="text-[13px] font-semibold tracking-[0.14em] text-[#006b55]">
                  {item.step}
                </div>
                <h3 className="mt-4 text-[24px] font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Section className="py-16">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#006b55] via-[#0b5e4d] to-[#123f34] text-white p-8 md:p-14">
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-black/10 blur-3xl" />
          <div className="relative grid md:grid-cols-[1.4fr_auto] gap-8 items-center">
            <div>
              <div className="text-[13px] font-semibold tracking-[0.14em] uppercase text-white/70">
                Mutaxassislar uchun
              </div>
              <h2 className="mt-3 text-[32px] md:text-[44px] font-semibold tracking-tight leading-[1.05]">
                Turizm sohasida ishlaysizmi?
              </h2>
              <p className="mt-3 text-[17px] text-white/85 max-w-xl">
                bayClub'ga qo'shiling va yangi mijozlar oqimini oching. Ro'yxatga olish bepul.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[#ffc400] hover:bg-[#ffd94a] text-[#123f34] font-semibold px-7 py-4 transition shadow-lg"
            >
              Hozir qo'shilish
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

function StatCard({
  Icon,
  value,
  label,
}: {
  Icon: (p: { size?: number }) => React.JSX.Element;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[24px] bg-white border border-black/[0.05] p-5 apple-shadow">
      <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#eaf4ef] text-[#006b55]">
        <Icon size={22} />
      </span>
      <div className="mt-3 text-[32px] font-semibold tracking-tight">{value}</div>
      <div className="text-[13px] text-[#86868b]">{label}</div>
    </div>
  );
}

function FloatingBubble({
  className,
  tone,
  Icon,
}: {
  className: string;
  tone: "blue" | "yellow";
  Icon: (p: { size?: number; strokeWidth?: number }) => React.JSX.Element;
}) {
  return (
    <div
      className={`identity-bubble animate-float absolute z-10 h-24 w-24 items-center justify-center rounded-[34px] ${className}`}
      style={{ color: tone === "blue" ? "#0717b8" : "#006b55", background: tone === "yellow" ? "rgba(255,196,0,0.22)" : "rgba(255,255,255,0.62)" }}
    >
      <Icon size={42} strokeWidth={1.55} />
    </div>
  );
}

function ServiceBigCard({
  href,
  Icon,
  title,
  desc,
  color,
  external = false,
}: {
  href: string;
  Icon: (p: { size?: number; strokeWidth?: number }) => React.JSX.Element;
  title: string;
  desc: string;
  color: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <div
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-15 blur-2xl transition group-hover:opacity-30"
        style={{
          background:
            color === "yellow" ? "#ffc400" : color === "blue" ? "#0717b8" : color === "dark" ? "#123f34" : "#ff6b4a",
        }}
      />
      {external ? (
        <span className="absolute top-5 right-5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0717b8] bg-[#eef1ff] px-2 py-1 rounded-full">
          Hamkor <ExternalLinkIcon size={10} strokeWidth={2.2} />
        </span>
      ) : null}
      <div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white"
        style={{ background: categoryGradient(color) }}
      >
        <Icon size={28} strokeWidth={1.8} />
      </div>
      <div className="relative mt-5">
        <h3 className="text-[20px] font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">{desc}</p>
      </div>
      <div className="relative mt-5 text-[13px] font-semibold text-[#0717b8] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
        {external ? "Saytga o'tish →" : "Ko'rish →"}
      </div>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-6 md:p-7 card-lift block"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-6 md:p-7 card-lift"
    >
      {inner}
    </Link>
  );
}
