"use client";

import { useSyncExternalStore } from "react";
import { FAVORITES_EVENT, getFavoritesCount, isFavorite } from "./favorites";

/**
 * Sevimlilar holatini o'qish uchun hook.
 *
 * `useSyncExternalStore` ishlatilgan sabab: bu React'ning tashqi store uchun
 * rasmiy API'si. `useState + useEffect` variantida har bir komponent o'z
 * effektini ro'yxatdan o'tkazadi va birinchi render'dan keyin qo'shimcha
 * qayta-render bo'ladi. Bu yerda esa hidratsiyadan keyin bir marta o'qiladi.
 */
function subscribe(callback: () => void): () => void {
  window.addEventListener(FAVORITES_EVENT, callback);
  return () => window.removeEventListener(FAVORITES_EVENT, callback);
}

export function useIsFavorite(id: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isFavorite(id),
    // Server'da localStorage yo'q — hidratsiya mos kelishi uchun doim false.
    () => false,
  );
}

export function useFavoritesCount(): number {
  return useSyncExternalStore(
    subscribe,
    getFavoritesCount,
    () => 0,
  );
}
