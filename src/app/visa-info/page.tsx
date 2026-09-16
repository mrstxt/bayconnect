import type { Metadata } from "next";
import Link from "next/link";
import { VISA_INFO_BY_REGION } from "@/lib/brand";
import { CheckIcon, ShieldIcon, ExternalLinkIcon, CalendarIcon, ClockIcon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Uzbekistan Visa Information — E-Visa, Visa on Arrival | bayConnect",
  description:
    "Complete Uzbekistan visa guide: e-visa for 90+ countries (3-day processing), visa-free for CIS countries, visa on arrival. Plan your trip with confidence.",
  alternates: { canonical: "/visa-info" },
  openGraph: {
    title: "Uzbekistan Visa Guide | bayConnect",
    description: "E-visa, visa-free and visa on arrival — everything you need to enter Uzbekistan.",
  },
};

export const revalidate = 86400; // 24 soat

const VISA_COLORS = {
  free:     { bg: "bg-[#0d7377]/08", border: "border-[#0d7377]/20", text: "text-[#0d7377]",  badge: "visa-badge-free",  icon: "✅" },
  evisa:    { bg: "bg-[#1b4a8a]/08", border: "border-[#1b4a8a]/20", text: "text-[#1b4a8a]",  badge: "visa-badge-evisa", icon: "💻" },
  voa:      { bg: "bg-[#c8930a]/08", border: "border-[#c8930a]/20", text: "text-[#7a5500]",  badge: "visa-badge-voa",   icon: "🛂" },
  required: { bg: "bg-[#c1440e]/08", border: "border-[#c1440e]/20", text: "text-[#8b2500]",  badge: "visa-badge-full",  icon: "📋" },
};

const VISA_LABELS: Record<string, string> = {
  free:     "Visa-free",
  evisa:    "E-Visa",
  voa:      "Visa on Arrival",
  required: "Visa Required",
};

const EVISA_URL = "https://e-visa.gov.uz";

export default function VisaInfoPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="destination-hero-badge mx-auto mb-5">
          <ShieldIcon size={13} strokeWidth={2} />
          Visa Information
        </div>
        <h1 className="text-[36px] md:text-[54px] font-black tracking-[-0.02em] leading-[1.04] text-[#1a1a2e]">
          Entering{" "}
          <span className="text-gradient-national">Uzbekistan</span>
        </h1>
        <p className="mt-5 text-[17px] md:text-[19px] leading-relaxed text-[#6b6b7b] max-w-2xl mx-auto">
          Most travelers can visit Uzbekistan visa-free or with a simple e-visa.
          Here's everything you need to know before your trip.
        </p>
      </div>

      {/* Tez xulosalar */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: "✈️",  stat: "60+",  label: "Visa-free countries",  color: "text-[#0d7377]" },
          { icon: "💻",  stat: "90+",  label: "E-visa countries",     color: "text-[#1b4a8a]" },
          { icon: "⚡",  stat: "3",    label: "Days e-visa processing",color: "text-[#c8930a]" },
          { icon: "📅",  stat: "30",   label: "Days max stay",        color: "text-[#c1440e]" },
        ].map((s) => (
          <div key={s.label} className="stat-card group p-5 text-center">
            <span className="text-[28px]">{s.icon}</span>
            <div className={`mt-2 text-[32px] font-black ${s.color}`}>{s.stat}</div>
            <div className="mt-1 text-[12px] font-semibold text-[#6b6b7b]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Viza turlari */}
      <h2 className="text-[24px] md:text-[30px] font-black tracking-tight text-[#1a1a2e] mb-5">
        Entry requirements by region
      </h2>

      <div className="flex flex-col gap-5">
        {VISA_INFO_BY_REGION.map((region) => {
          const colors = VISA_COLORS[region.visaType as keyof typeof VISA_COLORS] ?? VISA_COLORS.required;
          const label  = VISA_LABELS[region.visaType] ?? "Visa Required";
          return (
            <div
              key={region.region}
              className={`surface-apple overflow-hidden border ${colors.border}`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between gap-4 px-6 py-4 ${colors.bg}`}>
                <div className="flex items-center gap-3">
                  <span className="text-[24px]">{colors.icon}</span>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1a1a2e]">
                      {region.regionEn}
                    </h3>
                    <p className="text-[12px] text-[#6b6b7b]">{region.regionRu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`visa-badge ${colors.badge}`}>
                    {label}
                  </span>
                  <span className={`text-[13px] font-bold ${colors.text}`}>
                    {region.maxDays} days max
                  </span>
                </div>
              </div>

              {/* Mazmun */}
              <div className="px-6 py-5">
                <p className="text-[14px] font-semibold text-[#1a1a2e] mb-3">
                  {region.noteEn}
                </p>

                {/* Mamlakatlar */}
                <div className="flex flex-wrap gap-1.5">
                  {region.countries.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 rounded-lg bg-white border border-[#1b4a8a]/08 px-2.5 py-1 text-[12px] font-semibold text-[#1a1a2e]">
                      {c}
                    </span>
                  ))}
                </div>

                {"evisaUrl" in region && region.evisaUrl && (
                  <div className="mt-4">
                    <a
                      href={region.evisaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary !py-2.5 !px-5 text-[13px] inline-flex items-center gap-2"
                    >
                      Apply for E-Visa Online
                      <ExternalLinkIcon size={13} strokeWidth={2} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* E-Visa qo'llanmasi */}
      <div className="mt-12 surface-apple-strong girih-pattern p-8 md:p-10">
        <div className="relative z-10">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#1b4a8a] mb-3">
            Step-by-step guide
          </div>
          <h2 className="text-[26px] md:text-[34px] font-black tracking-tight text-[#1a1a2e] mb-6">
            How to apply for Uzbekistan E-Visa
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "01", icon: "💻", title: "Visit e-visa portal",  desc: "Go to e-visa.gov.uz — available in English, Russian and Uzbek" },
              { step: "02", icon: "📝", title: "Fill the form",        desc: "Enter your passport details, travel dates and purpose of visit" },
              { step: "03", icon: "💳", title: "Pay the fee",          desc: "Online payment — approximately $20 USD depending on nationality" },
              { step: "04", icon: "📧", title: "Receive by email",     desc: "E-visa delivered to your email within 3 business days" },
            ].map((s) => (
              <div key={s.step} className="process-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-lg bg-[#1b4a8a]/08 px-2 py-0.5 text-[11px] font-black tracking-[0.10em] text-[#1b4a8a]">
                    {s.step}
                  </span>
                  <span className="text-[20px]">{s.icon}</span>
                </div>
                <h3 className="text-[15px] font-bold text-[#1a1a2e]">{s.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6b6b7b]">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={EVISA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-7 !py-3 text-[14px] inline-flex items-center gap-2"
            >
              Apply for E-Visa Now
              <ExternalLinkIcon size={14} strokeWidth={2} />
            </a>
            <Link href="/experts?category=tour_agent" className="btn-ghost !px-7 !py-3 text-[14px]">
              Need visa help? Find a tour agent
            </Link>
          </div>
        </div>
      </div>

      {/* Muhim ma'lumotlar */}
      <div className="mt-10 grid md:grid-cols-2 gap-5">
        <div className="surface-apple p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon size={18} strokeWidth={1.8} className="text-[#1b4a8a]" />
            <h3 className="text-[17px] font-bold text-[#1a1a2e]">Entry requirements</h3>
          </div>
          <ul className="space-y-2.5">
            {[
              "Valid passport (6+ months remaining validity)",
              "Return or onward ticket",
              "Proof of accommodation (hotel booking)",
              "Sufficient funds for stay",
              "Travel insurance (recommended)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-[#1a1a2e]">
                <CheckIcon size={13} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#0d7377]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-apple p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon size={18} strokeWidth={1.8} className="text-[#c8930a]" />
            <h3 className="text-[17px] font-bold text-[#1a1a2e]">Important tips</h3>
          </div>
          <ul className="space-y-2.5">
            {[
              "Register with local police within 3 days of arrival (hotels do this automatically)",
              "Keep e-visa printed or downloaded offline",
              "USD and EUR accepted at most exchange offices",
              "Download offline maps before arrival",
              "Sim card available at Tashkent airport",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-[#1a1a2e]">
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#c8930a]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Yordam CTA */}
      <div className="mt-10 rounded-[24px] bg-gradient-to-br from-[#0d7377] to-[#095559] p-8 text-center text-white">
        <h3 className="text-[22px] font-black mb-2">Need personalized visa help?</h3>
        <p className="text-white/75 text-[15px] mb-5">
          Our tour operators can assist with visa applications and travel documentation.
        </p>
        <Link href="/experts?category=tour_agent" className="btn-gold !px-8 !py-3.5 text-[14px]">
          Find a Tour Operator
        </Link>
      </div>
    </div>
  );
}
