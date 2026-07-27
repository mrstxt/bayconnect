export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:py-12 animate-fade-in">
      <div className="h-4 w-40 rounded-full bg-[#f0f0f2] animate-pulse" />
      <div className="mt-5 h-56 md:h-72 rounded-[8px] bg-[#fff7ef] animate-pulse" />

      <div className="mt-8 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="h-10 w-72 rounded-[8px] bg-[#f1e7df] animate-pulse" />
          <div className="h-32 rounded-[8px] bg-[#fff7ef] animate-pulse" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="h-28 rounded-[8px] bg-[#fff7ef] animate-pulse" />
            <div className="h-28 rounded-[8px] bg-[#fff7ef] animate-pulse" />
          </div>
          <div className="h-40 rounded-[8px] bg-[#fff7ef] animate-pulse" />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="h-[420px] rounded-[8px] bg-[#fff7ef] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
