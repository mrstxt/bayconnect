"use client";

const KEY = "bayconnect:favorites";
const LEGACY_KEY = "bayclub:favorites";
export const FAVORITES_EVENT = "bayconnect:favorites-changed";
const LEGACY_FAVORITES_EVENT = "bayclub:favorites-changed";

function read(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY) ?? window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function write(ids: number[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.localStorage.removeItem(LEGACY_KEY);
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
  window.dispatchEvent(new CustomEvent(LEGACY_FAVORITES_EVENT));
}

export function getFavorites(): number[] {
  return read();
}

export function isFavorite(id: number): boolean {
  return read().includes(id);
}

export function toggleFavorite(id: number): boolean {
  const current = read();
  const exists = current.includes(id);
  const next = exists ? current.filter((n) => n !== id) : [...current, id];
  write(next);
  return !exists;
}
