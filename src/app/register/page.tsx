import type { Metadata } from "next";
import { COMMUNITY_PLAN, SPECIALIST_PLANS } from "@/lib/brand";
import { CheckIcon, UsersIcon } from "@/components/Icon";
import { SubscribeButton } from "./SubscribeButton";

export const metadata: Metadata = {
  title: "Hamkor bo'lish",
  description:
    "bayConnect hamkorlari uchun Start, Pro va Premium tariflari. Har bir tarif BayCommunity kirishini ham beradi.",
  alternates: { canonical: "/register" },
};

const formatter = new Intl.NumberFormat("uz-UZ");

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#006b55]/10 bg-white px-3.5 py-1.5 text-[12px] font-bold text-[#006b55]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b4a]" />
          Hamkorlar uchun
        </div>
        <h1 className="mt-6 text-[40px] font-black leading-[1.05] text-[#123f34] md:text-[56px]">
          Hamkorlik tariflari
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-[#506861] md:text-[19px]">
          Mutaxassislar uchun 3 xil obuna. Har bir tarif BayCommunity yopiq guruhiga
          kirish imkoniyatini ham beradi.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {SPECIALIST_PLANS.map((plan, index) => (
          <article
            key={plan.key}
            className={`flex flex-col rounded-3xl border bg-white/82 p-6 shadow-sm ${
              index === 1
                ? "border-[#006b55]/25 ring-2 ring-[#006b55]/10"
                : "border-[#123f34]/[0.07]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[24px] font-black tracking-tight text-[#123f34]">
                  {plan.label}
                </h2>
                <div className="mt-3 flex items-end gap-1 text-[#123f34]">
                  <span className="text-[34px] font-black leading-none">
                    {formatter.format(plan.priceMonthly)}
                  </span>
                  <span className="pb-1 text-[13px] font-semibold text-[#7b827f]">
                    so'm / oy
                  </span>
                </div>
              </div>
              {index === 1 ? (
                <span className="rounded-full bg-[#eaf4ef] px-3 py-1 text-[11px] font-black text-[#006b55]">
                  Tavsiya
                </span>
              ) : null}
            </div>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[14px] leading-relaxed text-[#123f34]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#006b55] text-white">
                    <CheckIcon size={11} strokeWidth={2.6} />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-7">
              <SubscribeButton audience="specialist" planKey={plan.key} />
            </div>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-3xl border border-[#123f34]/[0.07] bg-white/82 p-6 shadow-sm md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf4ef] text-[#006b55]">
              <UsersIcon size={24} />
            </span>
            <div>
              <h2 className="text-[24px] font-black tracking-tight text-[#123f34]">
                {COMMUNITY_PLAN.label}
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#66716d]">
                Mutaxassislar, oddiy foydalanuvchilar va mijozlar uchun yopiq community obunasi.
                Narx: {formatter.format(COMMUNITY_PLAN.priceMonthly)} so'm / oy.
              </p>
            </div>
          </div>
          <div className="min-w-[190px]">
            <SubscribeButton audience="community" planKey={COMMUNITY_PLAN.key} label="Qo'shilish" />
          </div>
        </div>
      </section>
    </div>
  );
}
