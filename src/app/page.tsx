import Link from "next/link";
import { getFeaturedProviders, getProviderStats } from "@/lib/queries";
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
  BusIcon,
  GlobeGridIcon,
  PinIcon,
  SearchIcon,
  CompassIcon,
} from "@/components/Icon";

/**
 * ISR: sahifa 5 daqiqada bir marta qayta generatsiya qilinadi.
 * Ilgari `force-dynamic` edi — har bir tashrifda 2 ta DB so'rovi ketardi va
 * hech qanday kesh ishlamasdi. Endi birinchi foydalanuvchi sahifani "isitadi",
 * qolganlari tayyor HTML'ni CDN'dan oladi.
 */
export const revalidate = 300;

const EXPERT_ICON_NODES = {
  guide: GuideIcon,
  translator: TranslatorIcon,
  photographer: PhotographerIcon,
  tour_agent: TourAgentIcon,
} as const;

export default async function HomePage() {
  const [featured, stats] = await Promise.all([
    getFeaturedProviders(6),
    getProviderStats(),
  ]);

  const quickAccess = [
    { href: "/experts?category=guide", Icon: GuideIcon, title: "Gidlar", sub: "Tarix va madaniyat" },
    { href: "/transfer", Icon: CarIcon, title: "Transfer", sub: "Yengil avto → avtobus" },
    { href: "/hotels", Icon: HotelIcon, title: "Mehmonxonalar", sub: "Qulay joylashuv" },
    { href: PARTNER_URL, Icon: TourAgentIcon, title: "Turlar", sub: "Tur paketlar", external: true },
  ];

  const marqueeCities = [
    "Samarqand",
    "Buxoro",
    "Xiva",
    "Toshkent",
    "Shahrisabz",
    "Chimyon",
    "Farg'ona",
    "Nukus",
    "Termiz",
    "Qarshi",
  ];

  return (
    <>
      {/* HERO */}
      <section className="identity-hero relative overflow-hidden">
        <div className="relative z-20 mx-auto max-w-6xl px-5 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-[#006b55]/15 bg-white/75 px-4 py-2 text-[12px] font-bold text-[#006b55] shadow-[0_10px_30px_rgba(12,43,35,0.08)] backdrop-blur">
              <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-[#ff6b4a]" />
              Gidlar, transfer va sayohat xizmatlari bir joyda
            </div>

            <h1 className="hero-title-clean animate-fade-up delay-2 mx-auto mt-8 max-w-4xl text-[40px] font-black leading-[1.03] text-[#123f34] sm:text-[54px] md:text-[74px]">
              O'zbekistonda sayohatni{" "}
              <span className="hero-title-accent">oson qiladigan</span>{" "}
              zamonaviy marketplace.
            </h1>

            <p className="animate-fade-up delay-3 mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-[#506861] md:text-[19px]">
              Gid, tarjimon, fotograf, transfer va mehmonxonalarni rangli, tez va ishonchli
              platformada tanlang. Profilni ko'ring, narxni solishtiring va zayavkani bir necha soniyada yuboring.
            </p>

            <div className="animate-fade-up delay-4 mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/experts" className="btn-primary !px-8 !py-4 text-[15px]">
                Mutaxassislarni ko'rish
              </Link>
              <a
                href={PARTNER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="baytrip-button !px-7 !py-4 text-[15px]"
              >
                Tur paketlar — {PARTNER_NAME}
                <ExternalLinkIcon size={15} strokeWidth={2} />
              </a>
            </div>

            <div className="hero-command-panel animate-fade-up delay-5 mx-auto mt-8 max-w-3xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="hero-command-input flex min-w-0 flex-1 items-center gap-3">
                  <SearchIcon size={18} strokeWidth={2} className="shrink-0 text-[#006b55]" />
                  <span className="truncate text-[14px] font-semibold text-[#123f34]/70">
                    Qidiruv
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/experts?city=Samarqand" className="hero-command-chip">
                    <CompassIcon size={14} strokeWidth={2} />
                    Samarqand
                  </Link>
                  <Link href="/transfer" className="hero-command-chip">
                    <TransferIcon size={14} strokeWidth={2} />
                    Transfer
                  </Link>
                  <Link href="/hotels" className="hero-command-chip">
                    <HotelIcon size={14} strokeWidth={2} />
                    Mehmonxonalar
                  </Link>
                </div>
              </div>
            </div>

            <div className="animate-fade-up delay-5 mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-[13px] font-semibold text-[#123f34]/70">
              {["Tekshirilgan profillar", "Shaffof narxlar", "Tez zayavka"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#006b55] text-white shadow-[0_4px_10px_rgba(0,107,85,0.3)]">
                    <CheckIcon size={11} strokeWidth={2.6} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Quick access cards */}
          <div className="relative mt-14 md:mt-16">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
              {quickAccess.map((item, i) =>
                item.external ? (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ animationDelay: `${0.4 + (i + 1) * 0.08}s` }}
                    className="quick-access-card quick-access-card-partner animate-fade-up group p-4"
                  >
                    <span className="absolute right-3 top-3 rounded-full bg-[#eef3ff] p-1 text-[#1264f1]">
                      <ExternalLinkIcon size={13} strokeWidth={2} />
                    </span>
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#1264f1]"
                    >
                      <item.Icon size={22} />
                    </span>
                    <div className="mt-3 text-[15px] font-black tracking-tight text-[#123f34]">{item.title}</div>
                    <div className="mt-0.5 text-[12px] font-semibold text-[#1264f1]">{PARTNER_NAME} · {item.sub}</div>
                  </a>
                ) : (
                  <Link
                    key={item.title}
                    href={item.href}
                    style={{ animationDelay: `${0.4 + (i + 1) * 0.08}s` }}
                    className="quick-access-card animate-fade-up group p-4"
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8f5] text-[#006b55]"
                    >
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

        {/* Shaharlar marquee */}
        <div className="relative border-y border-[#123f34]/[0.07] bg-white/55 py-3.5 backdrop-blur-sm">
          <div className="overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-3 pr-3">
              {[...marqueeCities, ...marqueeCities].map((city, i) => (
                <span
                  key={`${city}-${i}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#123f34]/[0.07] bg-white/85 px-4 py-1.5 text-[12.5px] font-semibold text-[#123f34]/70"
                  aria-hidden={i >= marqueeCities.length}
                >
                  <PinIcon size={11} strokeWidth={2} className="text-[#006b55]" />
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section className="py-16">
        <div className="surface-apple-strong p-8 md:p-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#006b55]">
                bayConnect haqida
              </div>
              <h2 className="mt-4 text-[32px] md:text-[44px] font-semibold tracking-tight leading-[1.05]">
                Sayohatni tashkil etishning eng oson yo'li.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-[#5f6864]">
                bayConnect — bu O'zbekiston va Markaziy Osiyoning turizm mutaxassislarini bir
                platformada birlashtirgan marketplace. Bu yerda siz gid, tarjimon, fotograf,
                transfer haydovchisi va mehmonxonalarni bir necha daqiqada topib bron
                qilishingiz mumkin.
              </p>
              <div className="mt-7 grid sm:grid-cols-2 gap-3.5">
                {[
                  "Ishonchli va tekshirilgan xizmatlar",
                  "Shaffof narxlar — yashirin to'lov yo'q",
                  "Real mijoz sharhlari va reyting",
                  "To'g'ridan-to'g'ri aloqa — vositachisiz",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-gradient-to-b from-[#0b8267] to-[#006b55] text-white flex items-center justify-center shadow-[0_5px_12px_rgba(0,107,85,0.3)]">
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
      <Section className="defer-paint py-16">
        <SectionHeading
          eyebrow="Xizmatlar"
          title="bayConnect'da nimalar bor?"
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
      <Section className="defer-paint py-16">
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
                className="category-card group relative overflow-hidden p-5 md:p-6"
              >
                <div
                  className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
                  style={{ background: c.color === "dark" ? "#123f34" : c.color === "blue" ? "#3d5bff" : "#ff6b4a" }}
                />
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ background: categoryGradient(c.color) }}
                >
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <div className="relative mt-5">
                  <div className="text-[17px] font-semibold tracking-tight">{c.label}</div>
                  <div className="mt-1 text-[13px] text-[#7b827f] leading-relaxed line-clamp-2">
                    {c.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* TRANSFER TYPES */}
      <Section className="defer-paint py-16">
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
              className="transport-card group p-5 text-center"
            >
              <span className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-[#eef1ff] text-[#0717b8] transition duration-300 group-hover:scale-110">
                <TransferTypeIcon type={t.key} size={28} />
              </span>
              <div className="mt-4 text-[15px] font-semibold tracking-tight">{t.label}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#7b827f]">
                <UsersIcon size={12} /> {t.capacity} kishi
              </div>
              <div className="mt-2 text-[11px] text-[#7b827f] leading-relaxed line-clamp-2">
                {t.description}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* PARTNER PROMO — bayTrip */}
      <Section className="defer-paint py-16">
        <a
          href={PARTNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="baytrip-feature group relative block overflow-hidden p-8 text-white apple-shadow-lg md:p-14"
        >
          <div className="baytrip-grid" />
          <div className="baytrip-route-line" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f3c85a] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#17392e]">
                Rasmiy hamkor · bayTrip
              </div>
              <h2 className="mt-3 text-[30px] font-semibold leading-[1.05] tracking-tight md:text-[40px]">
                Tayyor tur paketlari uchun {PARTNER_NAME}'ga tashrif buyuring
              </h2>
              <p className="mt-3 max-w-xl text-[16px] text-white/75">
                Ipak Yo'li, tog' sarguzashtlari va boshqa marshrutlar bo'yicha tayyor
                paketlarni bayConnect emas, hamkorimiz {PARTNER_NAME} platformasi taqdim etadi.
              </p>
              <span className="baytrip-button mt-7 !px-6 !py-3.5 text-[14px]">
                Turlarni ko'rish
                <ExternalLinkIcon size={15} strokeWidth={2} />
              </span>
            </div>
            <div className="baytrip-orbit hidden min-h-[260px] lg:block" aria-hidden="true">
              <span className="baytrip-orbit-dot baytrip-orbit-dot-main">
                <TransferIcon size={44} strokeWidth={1.75} />
              </span>
              <span className="baytrip-orbit-dot baytrip-orbit-dot-yellow">
                <HotelIcon size={30} strokeWidth={1.8} />
              </span>
              <span className="baytrip-orbit-dot baytrip-orbit-dot-orange">
                <PhotographerIcon size={24} strokeWidth={2} />
              </span>
              <span className="baytrip-chip baytrip-chip-one">
                <TransferIcon size={19} strokeWidth={2} />
                <span><b>Aviachiptalar</b><small>qulay reyslar</small></span>
              </span>
              <span className="baytrip-chip baytrip-chip-two">
                <HotelIcon size={19} strokeWidth={2} />
                <span><b>Mehmonxona</b><small>tekshirilgan joylar</small></span>
              </span>
              <span className="baytrip-chip baytrip-chip-three">
                <CarIcon size={19} strokeWidth={2} />
                <span><b>Transfer</b><small>kutib olish</small></span>
              </span>
            </div>
          </div>
        </a>
      </Section>

      {/* TOP EXPERTS */}
      <Section className="defer-paint py-16">
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
      <section className="defer-paint mt-16 border-y border-[#123f34]/[0.07] bg-[#f6f0e9] py-20">
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
              <div key={item.step} className="process-card group p-7">
                <div className="inline-flex rounded-full bg-[#eaf4ef] px-3 py-1.5 text-[13px] font-bold tracking-[0.14em] text-[#006b55]">
                  {item.step}
                </div>
                <h3 className="mt-5 text-[24px] font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#5f6864]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Section className="defer-paint py-16">
        <div className="dark-panel relative overflow-hidden rounded-[32px] p-8 text-white apple-shadow-lg md:p-14">
          <div className="dot-grid-light" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_auto]">
            <div>
              <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/60">
                Mutaxassislar uchun
              </div>
              <h2 className="mt-3 text-[32px] font-semibold leading-[1.05] tracking-tight md:text-[44px]">
                Turizm sohasida ishlaysizmi?
              </h2>
              <p className="mt-3 max-w-xl text-[17px] text-white/80">
                bayConnect'ga qo'shiling va yangi mijozlar oqimini oching. Ro'yxatga olish bepul.
              </p>
            </div>
            <Link href="/register" className="btn-gold !px-8 !py-4 text-[15px]">
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
    <div className="stat-card p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf4ef] text-[#006b55] shadow-sm ring-1 ring-[#006b55]/10">
        <Icon size={22} />
      </span>
      <div className="mt-3 text-[32px] font-black tracking-tight">{value}</div>
      <div className="text-[13px] font-semibold text-[#7b827f]">{label}</div>
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
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-15 blur-2xl transition group-hover:opacity-30"
        style={{
          background:
            color === "yellow" ? "#ffc400" : color === "blue" ? "#3d5bff" : color === "dark" ? "#123f34" : "#ff6b4a",
        }}
      />
      {external ? (
        <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-[#f3c85a] px-2.5 py-1 text-[10px] font-black text-[#17392e]">
          bayTrip <ExternalLinkIcon size={10} strokeWidth={2.2} />
        </span>
      ) : null}
      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl text-white ${
          external ? "bg-white/12 text-[#f3c85a] ring-1 ring-white/18" : ""
        }`}
        style={external ? undefined : { background: categoryGradient(color) }}
      >
        <Icon size={28} strokeWidth={1.8} />
      </div>
      <div className="relative mt-5">
        <h3 className={`text-[20px] font-semibold tracking-tight ${external ? "text-white" : ""}`}>
          {title}
        </h3>
        <p className={`mt-2 text-[14px] leading-relaxed ${external ? "text-white/72" : "text-[#5f6864]"}`}>
          {desc}
        </p>
      </div>
      <div className={`relative mt-5 translate-y-1 text-[13px] font-semibold opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 ${
        external ? "text-[#f3c85a]" : "text-[#0717b8]"
      }`}>
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
        className="baytrip-service-card card-lift group relative block overflow-hidden p-6 md:p-7"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="service-card group relative overflow-hidden p-6 md:p-7"
    >
      {inner}
    </Link>
  );
}
