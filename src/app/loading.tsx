export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded-full bg-[#006b55]/15" />
        <div className="h-10 w-full max-w-md animate-pulse rounded-2xl bg-white/70" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-full bg-white/60" />
      </div>

      <div className="filter-panel mt-8 h-24 animate-pulse" />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="card-compact h-[280px] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
