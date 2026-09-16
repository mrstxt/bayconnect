"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ProviderCardRow } from "@/lib/queries";
import { ProviderCard } from "@/components/ProviderCard";
import { EmptyState, SectionHeading } from "@/components/ui";
import { FAVORITES_EVENT, getFavorites } from "@/lib/favorites";
import { HeartIcon } from "@/components/Icon";

export default function FavoritesPage() {
  const [providers, setProviders] = useState<ProviderCardRow[] | null>(null);
  const [error, setError] = useState(false);

  // Eskirgan javob yangisining ustiga yozilmasligi uchun (race condition).
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    // Oldingi so'rov hali tugamagan bo'lsa bekor qilamiz.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const ids = getFavorites();
    if (ids.length === 0) {
      setProviders([]);
      setError(false);
      return;
    }

    try {
      const res = await fetch("/api/providers/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("fetch failed");

      const json = (await res.json()) as { providers?: ProviderCardRow[] };
      if (requestId !== requestIdRef.current) return; // eskirgan javob

      const order = new Map(ids.map((id, i) => [id, i]));
      const sorted = [...(json.providers ?? [])].sort(
        (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
      );
      setProviders(sorted);
      setError(false);
    } catch (e) {
      if (controller.signal.aborted) return;
      if (requestId !== requestIdRef.current) return;
      console.error("[favorites] yuklashda xato:", e);
      setProviders([]);
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load();
    window.addEventListener(FAVORITES_EVENT, load);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, load);
      abortRef.current?.abort();
    };
  }, [load]);

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
        ) : error ? (
          <EmptyState
            icon={<HeartIcon size={28} className="text-[#ff3b30]" />}
            title="Yuklab bo'lmadi"
            description="Internet aloqasini tekshiring va qayta urinib ko'ring."
            action={
              <button type="button" onClick={() => void load()} className="btn-primary !py-2.5 !px-5 text-[13px]">
                Qayta urinish
              </button>
            }
          />
        ) : providers.length === 0 ? (
          <EmptyState
            icon={<HeartIcon size={28} className="text-[#ff3b30]" />}
            title="Hozircha bo'sh"
            description="Yoqqan mutaxassislarni yurak belgisi orqali shu yerga qo'shing."
            action={
              <Link href="/experts" className="btn-primary !py-2.5 !px-5 text-[13px]">
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
