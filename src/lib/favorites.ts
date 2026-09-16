"use client";

const KEY = "bayconnect:favorites";
const LEGACY_KEY = "bayclub:favorites";
export const FAVORITES_EVENT = "bayconnect:favorites-changed";

/**
 * Sevimlilar localStorage'da saqlanadi.
 *
 * Optimizatsiya: qiymat xotirada keshlanadi. Ilgari har bir `isFavorite()`
 * chaqiruvi `localStorage.getItem` + `JSON.parse` qilardi — ro'yxatda 12 ta
 * karta bo'lsa, bu har renderda 12 ta sinxron disk o'qish edi (main thread'ni
 * bloklaydi).
 */
let cache: number[] | null = null;

function read(): number[] {
  if (typeof window === "undefined") return [];
  if (cache) return cache;

  try {
    const raw = window.localStorage.getItem(KEY) ?? window.localStorage.getItem(LEGACY_KEY);
    if (!raw) {
      cache = [];
      return cache;
    }
    const parsed: unknown = JSON.parse(raw);
    cache = Array.isArray(parsed)
      ? parsed.filter((n): n is number => typeof n === "number" && Number.isSafeInteger(n) && n > 0)
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(ids: number[]) {
  cache = ids;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Private rejim yoki kvota to'lgan — UI baribir ishlashda davom etsin.
  }
  // Ilgari ikkita event yuborilardi (yangi + legacy) va Header ikkalasini ham
  // tinglardi → har bosishda ikki marta setState. Endi bitta event.
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
}

/** Boshqa tabda o'zgarish bo'lsa keshni yangilaymiz. */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY || e.key === LEGACY_KEY) {
      cache = null;
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
    }
  });
}

export function getFavorites(): number[] {
  return read();
}

export function getFavoritesCount(): number {
  return read().length;
}

export function isFavorite(id: number): boolean {
  return read().includes(id);
}

export function toggleFavorite(id: number): boolean {
  const current = read();
  const exists = current.includes(id);
  write(exists ? current.filter((n) => n !== id) : [...current, id]);
  return !exists;
}
