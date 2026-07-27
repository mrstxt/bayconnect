"use client";

const KEY = "bayclub:favorites";

function read(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function write(ids: number[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("bayclub:favorites-changed"));
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

export const FAVORITES_EVENT = "bayclub:favorites-changed";
