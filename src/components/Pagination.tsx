import Link from "next/link";

/**
 * Server komponent sahifalash. Har bir sahifa oddiy <Link> — JS'siz ham ishlaydi
 * va Next.js ularni prefetch qiladi.
 */
export function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Sahifalar">
      <PageLink
        href={makeHref(page - 1)}
        disabled={page <= 1}
        label="Oldingi sahifa"
        text="←"
      />

      {pages.map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-2 text-[13px] text-[#7b827f]">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[13px] font-semibold transition ${
              p === page
                ? "chip-apple-active"
                : "chip-apple text-[#123f34] hover:border-[#006b55]/30"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      <PageLink
        href={makeHref(page + 1)}
        disabled={page >= totalPages}
        label="Keyingi sahifa"
        text="→"
      />
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
  text,
}: {
  href: string;
  disabled: boolean;
  label: string;
  text: string;
}) {
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[13px] text-[#7b827f]/40"
      >
        {text}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="chip-apple inline-flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold text-[#123f34] transition hover:border-[#006b55]/30"
    >
      {text}
    </Link>
  );
}

/** 1 … 4 5 [6] 7 8 … 20 ko'rinishidagi oyna. */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const out: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) out.push("gap");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("gap");
  out.push(total);

  return out;
}
