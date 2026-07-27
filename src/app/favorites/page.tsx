"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Provider } from "@/db/schema";
import { ProviderCard } from "@/components/ProviderCard";
import { EmptyState, SectionHeading } from "@/components/ui";
import { FAVORITES_EVENT, getFavorites } from "@/lib/favorites";
import { HeartIcon } from "@/components/Icon";

export default function FavoritesPage() {
  const [providers, setProviders] = useState<Provider[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const ids = getFavorites();
      if (ids.length === 0) {
        if (!cancelled) setProviders([]);
        return;
      }
      try {
        const res = await fetch("/api/providers/by-ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });
        const j = (await res.json()) as { providers: Provider[] };
        if (!cancelled) {
          const order = new Map(ids.map((id, i) => [id, i]));
          const sorted = [...j.providers].sort(
            (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
          );
          setProviders(sorted);
        }
      } catch {
        if (!cancelled) setProviders([]);
      }
    }

    load();
    window.addEventListener(FAVORITES_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(FAVORITES_EVENT, load);
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionHeading
        eyebrow="Shaxsiy ro'yxat"
        title="Sevimlilar"
        subtitle="Saqlab qo'ygan mutaxassislaringiz shu yerda ko'rinadi."
      />

      <div className="mt-10">
        {providers === null ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[340px] rounded-[22px] bg-white/70 animate-pulse border border-[#006b55]/10 apple-shadow"
              />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <EmptyState
            icon={<HeartIcon size={28} className="text-[#ff3b30]" />}
            title="Hozircha bo'sh"
            description="Yoqqan mutaxassislarni yurak belgisi orqali shu yerga qo'shing."
            action={
              <Link href="/providers" className="btn-primary !py-2.5 !px-5 text-[13px]">
                Katalogni ko'rish
              </Link>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((p) => (
              <ProviderCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
