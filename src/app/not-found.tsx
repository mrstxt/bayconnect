import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <div className="text-[64px]">🌴</div>
      <h1 className="mt-6 text-[40px] md:text-[56px] font-semibold tracking-tight">
        Sahifa topilmadi
      </h1>
      <p className="mt-4 text-[17px] text-[#86868b] max-w-md mx-auto">
        Siz izlagan sahifa mavjud emas yoki ko'chirib yuborilgan bo'lishi mumkin.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Bosh sahifa
        </Link>
        <Link href="/providers" className="btn-ghost">
          Katalog
        </Link>
      </div>
    </div>
  );
}
