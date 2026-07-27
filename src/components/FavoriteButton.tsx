"use client";

import { useEffect, useRef, useState } from "react";
import { toggleFavorite } from "@/lib/favorites";
import { useIsFavorite } from "@/lib/useFavorites";
import { HeartIcon } from "./Icon";

export function FavoriteButton({
  providerId,
  className = "",
}: {
  providerId: number;
  className?: string;
}) {
  const fav = useIsFavorite(providerId);
  const [pulse, setPulse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memory leak tuzatildi: ilgari setTimeout tozalanmasdi va komponent
  // unmount bo'lgach "setState on unmounted component" holati yuzaga kelardi.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={fav ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
      aria-pressed={fav}
      onClick={(e) => {
        // Karta <Link> ichida — navigatsiyani to'xtatamiz.
        e.preventDefault();
        e.stopPropagation();
        const next = toggleFavorite(providerId);
        if (next) {
          setPulse(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setPulse(false), 300);
        }
      }}
      className={`inline-flex items-center justify-center rounded-full glass w-9 h-9 transition-transform active:scale-90 ${
        pulse ? "scale-110" : ""
      } ${className}`}
      style={{ color: fav ? "#ff6b4a" : "#123f34" }}
    >
      <HeartIcon size={17} filled={fav} strokeWidth={1.8} />
    </button>
  );
}
