"use client";

import { useEffect, useMemo, useState } from "react";
import { LOCALE_LABELS, LOCALE_NAMES, LOCALES, type Locale, isLocale, uiTranslations } from "@/lib/i18n";

const originalTextNodes = new WeakMap<Text, string>();

function getCookieLocale(): Locale {
  if (typeof document === "undefined") return "uz";
  const match = document.cookie.match(/(?:^|;\s*)bc_locale=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : "";
  return isLocale(value) ? value : "uz";
}

function translateText(value: string, locale: Locale): string {
  if (locale === "uz") return value;
  const dict = uiTranslations[locale];
  const exact = dict[value.trim()];
  if (exact) return value.replace(value.trim(), exact);

  let out = value;
  for (const [source, target] of Object.entries(dict)) {
    if (out.includes(source)) out = out.replaceAll(source, target);
  }
  out = out.replace(/(\d+)\s+ta natija/g, locale === "ru" ? "$1 результатов" : "$1 results");
  out = out.replace(/(\d+)\s+ta mehmonxona/g, locale === "ru" ? "$1 отелей" : "$1 hotels");
  out = out.replace(/(\d+)\s+yil tajriba/g, locale === "ru" ? "$1 лет опыта" : "$1 years experience");
  out = out.replace(/(\d+)\+\s+yil/g, locale === "ru" ? "$1+ лет" : "$1+ years");
  return out;
}

function applyTranslations(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const original = originalTextNodes.get(node) ?? node.nodeValue ?? "";
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, original);
    node.nodeValue = translateText(original, locale);
  }

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[placeholder]").forEach((el) => {
    const original = el.dataset.i18nOriginalPlaceholder ?? el.getAttribute("placeholder") ?? "";
    el.dataset.i18nOriginalPlaceholder = original;
    el.setAttribute("placeholder", translateText(original, locale));
  });

  document.querySelectorAll<HTMLElement>("[aria-label]").forEach((el) => {
    const original = el.dataset.i18nOriginalAria ?? el.getAttribute("aria-label") ?? "";
    el.dataset.i18nOriginalAria = original;
    el.setAttribute("aria-label", translateText(original, locale));
  });
}

export function AutoTranslator() {
  useEffect(() => {
    const run = () => applyTranslations(getCookieLocale());
    run();
    const observer = new MutationObserver(run);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("bc:locale-change", run);
    return () => {
      observer.disconnect();
      window.removeEventListener("bc:locale-change", run);
    };
  }, []);

  return null;
}

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>("uz");
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);
  const options = useMemo(() => LOCALES, []);

  useEffect(() => {
    setLocale(getCookieLocale());
  }, []);

  useEffect(() => {
    if (!pendingLocale) return;
    document.cookie = `bc_locale=${pendingLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.dispatchEvent(new Event("bc:locale-change"));
    setPendingLocale(null);
  }, [pendingLocale]);

  function choose(next: Locale) {
    setLocale(next);
    setPendingLocale(next);
  }

  return (
    <div className="inline-flex items-center rounded-full border border-[#123f34]/10 bg-white/70 p-0.5 shadow-sm">
      {options.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => choose(item)}
          title={LOCALE_NAMES[item]}
          aria-pressed={locale === item}
          className={`h-7 min-w-8 rounded-full px-2 text-[11px] font-bold transition ${
            locale === item ? "bg-[#006b55] text-white" : "text-[#123f34]/65 hover:bg-[#123f34]/[0.05]"
          }`}
        >
          {LOCALE_LABELS[item]}
        </button>
      ))}
    </div>
  );
}
