"use client";

import { useEffect, useState } from "react";
import { FAVORITES_EVENT, isFavorite, toggleFavorite } from "@/lib/favorites";
import { HeartIcon } from "./Icon";

export function FavoriteButton({
  providerId,
  className = "",
}: {
  providerId: number;
  className?: string;
}) {
  const [fav, setFav] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setFav(isFavorite(providerId));
    const onChange = () => setFav(isFavorite(providerId));
    window.addEventListener(FAVORITES_EVENT, onChange);
    return () => window.removeEventListener(FAVORITES_EVENT, onChange);
  }, [providerId]);

  return (
    <button
      type="button"
      aria-label={fav ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = toggleFavorite(providerId);
        setFav(next);
        if (next) {
          setPulse(true);
          setTimeout(() => setPulse(false), 300);
        }
      }}
      className={`inline-flex items-center justify-center rounded-full glass w-9 h-9 transition-transform active:scale-90 ${
        pulse ? "scale-110" : ""
      } ${className}`}
      style={{ color: fav ? "#ff3b30" : "#1d1d1f" }}
    >
      <HeartIcon size={17} filled={fav} strokeWidth={1.8} />
    </button>
  );
}
