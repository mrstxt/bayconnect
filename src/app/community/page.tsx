import type { Metadata } from "next";
import { COMMUNITY_PLAN } from "@/lib/brand";
import { CheckIcon, UsersIcon } from "@/components/Icon";
import { SubscribeButton } from "../register/SubscribeButton";

export const metadata: Metadata = {
  title: "BayCommunity",
  description:
    "BayCommunity yopiq guruhiga qo'shiling: turizm mutaxassislari, hamkorlar, yangiliklar va imkoniyatlar bir joyda.",
  alternates: { canonical: "/community" },
};

const formatter = new Intl.NumberFormat("uz-UZ");

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section className="pt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#006b55]/10 bg-white px-3.5 py-1.5 text-[12px] font-bold text-[#006b55]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b4a]" />
            Yopiq guruh
          </div>

          <h1 className="mt-6 max-w-2xl text-[40px] font-black leading-[1.05] text-[#123f34] md:text-[62px]">
            BayCommunity
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#506861] md:text-[19px]">
            Turizm sohasi vakillari, hamkorlar va sayohatga qiziqqan odamlar uchun yopiq
            Telegram community. Mutaxassis tarifiga ulanganlar ham shu guruhga kiradi,
            oddiy foydalanuvchilar esa alohida bitta community obunasi orqali qo'shiladi.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {COMMUNITY_PLAN.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-2xl bg-white/76 p-4 shadow-sm ring-1 ring-[#123f34]/[0.06]">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#006b55] text-white">
                  <CheckIcon size={12} strokeWidth={2.5} />
                </span>
                <span className="text-[14px] font-medium leading-relaxed text-[#123f34]">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-[#123f34]/[0.07] bg-white/80 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf4ef] text-[#006b55]">
                <UsersIcon size={22} />
              </span>
              <div>
                <div className="text-[15px] font-black text-[#123f34]">Tizim qanday ishlaydi?</div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#66716d]">
                  Saytda Telegram profilingiz bot orqali tasdiqlanadi va promokod tekshiriladi.
                  Keyin foydalanuvchi yopiq Telegram guruhiga join request yuboradi. Bot ruxsatni
                  bazadan tekshiradi va avtomatik tasdiqlaydi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="surface-apple-strong p-6 md:p-8">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#123f34]/[0.06]">
            <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#006b55]">
              {COMMUNITY_PLAN.label}
            </div>
            <div className="mt-3 flex items-end gap-1 text-[#123f34]">
              <span className="text-[36px] font-black leading-none">
                {formatter.format(COMMUNITY_PLAN.priceMonthly)}
              </span>
              <span className="pb-1 text-[13px] font-semibold text-[#7b827f]">so'm / oy</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-[#66716d]">
              Promokod kiritilsa access avtomatik 1 yoki 3 oyga bepul ochiladi. Promokodsiz
              so'rov to'lov tekshiruviga tushadi.
            </p>
          </div>

          <div className="mt-6">
            <SubscribeButton audience="community" planKey={COMMUNITY_PLAN.key} label="Communityga qo'shilish" />
          </div>
        </aside>
      </div>
    </div>
  );
}
