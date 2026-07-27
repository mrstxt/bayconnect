import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-[#f5f5f7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1d1d1f]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a00]" />
          Mutaxassislar uchun
        </div>
        <h1 className="mt-6 text-[40px] md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.05]">
          bayClub'ga qo'shiling
        </h1>
        <p className="mt-4 text-[17px] md:text-[19px] leading-relaxed text-[#6e6e73] max-w-xl mx-auto">
          Profilingizni yarating va yangi mijozlar sizni to'g'ridan-to'g'ri topsin.
          Ro'yxatga olish bepul.
        </p>
      </div>

      <div className="mt-10 rounded-[36px] border border-black/[0.06] bg-white p-6 md:p-10 apple-shadow">
        <div className="mb-8 grid sm:grid-cols-3 gap-3">
          {[
            { t: "1 daqiqa", d: "Tez ro'yxatdan o'tish" },
            { t: "Bepul", d: "Yashirin to'lov yo'q" },
            { t: "To'g'ridan-to'g'ri", d: "Mijozlar siz bilan bog'lanadi" },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-2xl bg-[#f5f5f7] border border-black/[0.04] px-4 py-3 text-center"
            >
              <div className="text-[15px] font-semibold tracking-tight">{item.t}</div>
              <div className="mt-0.5 text-[12px] text-[#86868b]">{item.d}</div>
            </div>
          ))}
        </div>

        <RegisterForm />
      </div>

      <p className="mt-8 text-center text-[13px] text-[#86868b]">
        Allaqachon ro'yxatdan o'tganmisiz?{" "}
        <Link href="/providers" className="font-semibold text-[#0071e3] hover:underline underline-offset-4">
          Katalogni ko'ring
        </Link>
      </p>
    </div>
  );
}
