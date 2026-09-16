"use client";

import { useEffect, useState } from "react";

/**
 * bayConnect 2.0 — Welcome Splash Screen
 * Faqat birinchi tashrifda ko'rinadi (sessionStorage bilan).
 * 3 soniya davomida animatsiya, keyin smooth fade-out.
 *
 * Dizayn: Registon 3-arch silueti, islomiy medallion naqsh,
 * lapis lazuli + zar oltin + gilem qizili rang palitrasida.
 */

const SPLASH_KEY = "bay_splash_seen_v2";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // SSR xavfsizligi
    if (typeof window === "undefined") return;

    const seen = sessionStorage.getItem(SPLASH_KEY);
    if (seen) return;

    // Splash ko'rsat
    setVisible(true);
    sessionStorage.setItem(SPLASH_KEY, "1");

    // 2.8s dan so'ng fade-out boshlaydi
    const leaveTimer = setTimeout(() => setLeaving(true), 2800);
    // 3.5s dan so'ng DOM'dan o'chiriladi
    const hideTimer  = setTimeout(() => setVisible(false), 3500);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Sahifa yuklanmoqda"
      className={`splash-root ${leaving ? "splash-leaving" : ""}`}
    >
      {/* ── Fon teksturasi: islomiy geometrik to'r ─────────────────── */}
      <div className="splash-bg-grid" aria-hidden="true" />

      {/* ── Asosiy kontent ─────────────────────────────────────────── */}
      <div className="splash-content">

        {/* Medallion ornament — tepada */}
        <div className="splash-medallion" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tashqi halqa */}
            <circle cx="60" cy="60" r="56" stroke="rgba(233,196,106,0.45)" strokeWidth="1.5" />
            {/* Ichki halqa */}
            <circle cx="60" cy="60" r="44" stroke="rgba(233,196,106,0.35)" strokeWidth="1" />
            {/* 8 ta toj niqob — tashqi */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x = 60 + 52 * Math.cos(angle);
              const y = 60 + 52 * Math.sin(angle);
              return (
                <circle key={i} cx={x} cy={y} r="4"
                  fill="rgba(233,196,106,0.6)" />
              );
            })}
            {/* 8 ta toj niqob — ichki */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = ((i * 45 + 22.5) * Math.PI) / 180;
              const x = 60 + 40 * Math.cos(angle);
              const y = 60 + 40 * Math.sin(angle);
              return (
                <circle key={i} cx={x} cy={y} r="3"
                  fill="rgba(233,196,106,0.4)" />
              );
            })}
            {/* Markaziy yulduz — 8 qirrali */}
            <path
              d="M60 36 L63.5 52 L78 44 L67 56 L84 60 L67 64 L78 76 L63.5 68 L60 84 L56.5 68 L42 76 L53 64 L36 60 L53 56 L42 44 L56.5 52 Z"
              fill="rgba(233,196,106,0.25)"
              stroke="rgba(233,196,106,0.7)"
              strokeWidth="0.8"
            />
            {/* Markaziy aylana */}
            <circle cx="60" cy="60" r="10"
              fill="rgba(233,196,106,0.15)"
              stroke="rgba(233,196,106,0.8)"
              strokeWidth="1.2"
            />
            <circle cx="60" cy="60" r="4"
              fill="rgba(233,196,106,0.9)" />
          </svg>
        </div>

        {/* Registon 3-arch silueti */}
        <div className="splash-arches" aria-hidden="true">
          <svg viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="splash-arches-svg">
            {/* Uch arch — Registon motivida */}
            {/* Chap arch */}
            <path
              d="M20 190 L20 110 Q20 60 70 60 Q120 60 120 110 L120 190"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2.5"
              fill="rgba(255,255,255,0.06)"
            />
            {/* Chap arch ichki naqsh */}
            <path
              d="M35 190 L35 118 Q35 78 70 78 Q105 78 105 118 L105 190"
              stroke="rgba(233,196,106,0.5)"
              strokeWidth="1.2"
              fill="none"
            />
            {/* O'rta arch — kattaroq */}
            <path
              d="M110 190 L110 95 Q110 30 170 30 Q230 30 230 95 L230 190"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth="3"
              fill="rgba(255,255,255,0.08)"
            />
            {/* O'rta arch ichki */}
            <path
              d="M126 190 L126 104 Q126 50 170 50 Q214 50 214 104 L214 190"
              stroke="rgba(233,196,106,0.55)"
              strokeWidth="1.5"
              fill="none"
            />
            {/* O'ng arch */}
            <path
              d="M220 190 L220 110 Q220 60 270 60 Q320 60 320 110 L320 190"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2.5"
              fill="rgba(255,255,255,0.06)"
            />
            {/* O'ng arch ichki */}
            <path
              d="M235 190 L235 118 Q235 78 270 78 Q305 78 305 118 L305 190"
              stroke="rgba(233,196,106,0.5)"
              strokeWidth="1.2"
              fill="none"
            />
            {/* Poydevor chizig'i */}
            <line x1="0" y1="190" x2="340" y2="190"
              stroke="rgba(233,196,106,0.4)" strokeWidth="1.5" />
            {/* Arch ustidagi naqsh nuqtalari */}
            {[70, 170, 270].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy={i === 1 ? 30 : 60} r="4"
                  fill="rgba(233,196,106,0.8)" />
                <circle cx={cx} cy={i === 1 ? 30 : 60} r="8"
                  stroke="rgba(233,196,106,0.3)" strokeWidth="1" fill="none" />
              </g>
            ))}
          </svg>
        </div>

        {/* bayConnect 2.0 yozuvi */}
        <div className="splash-brand">
          <div className="splash-brand-line" aria-hidden="true" />
          <div className="splash-title-wrap">
            <span className="splash-title-prefix">Welcome to</span>
            <h1 className="splash-title">
              bay<span className="splash-title-accent">Connect</span>
            </h1>
            <span className="splash-version">2.0</span>
          </div>
          <div className="splash-brand-line" aria-hidden="true" />
        </div>

        {/* Tagline — 3 tilda */}
        <div className="splash-tagline">
          <span className="splash-tag-uz">O'zbekistonga xush kelibsiz</span>
          <span className="splash-tag-sep" aria-hidden="true">·</span>
          <span className="splash-tag-en">Discover the Silk Road</span>
          <span className="splash-tag-sep" aria-hidden="true">·</span>
          <span className="splash-tag-ru">Добро пожаловать</span>
        </div>

        {/* Progress bar */}
        <div className="splash-progress" aria-hidden="true">
          <div className="splash-progress-bar" />
        </div>

        {/* Pastdagi medallion nuqtalar */}
        <div className="splash-dots" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="splash-dot" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>

      {/* Pastki ornament chizig'i */}
      <div className="splash-footer-line" aria-hidden="true">
        <div className="splash-footer-ornament" />
      </div>

      <style>{`
        /* ================================================================
           SPLASH ROOT
           ================================================================ */
        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(42,107,199,0.18), transparent 60%),
            radial-gradient(ellipse 60% 50% at 100% 100%, rgba(193,68,14,0.12), transparent 55%),
            radial-gradient(ellipse 50% 40% at 0% 100%, rgba(200,147,10,0.10), transparent 50%),
            linear-gradient(165deg, #0a1a3a 0%, #0f2f5c 35%, #0a2240 65%, #06121e 100%);
          animation: splash-fadein 0.5s ease both;
        }

        .splash-leaving {
          animation: splash-fadeout 0.7s cubic-bezier(0.4, 0, 1, 1) both;
        }

        @keyframes splash-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes splash-fadeout {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.04); }
        }

        /* ================================================================
           FON TO'R NAQSHI
           ================================================================ */
        .splash-bg-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            repeating-conic-gradient(
              from 22.5deg at 50% 50%,
              rgba(255,255,255,0.025) 0deg 45deg,
              transparent 45deg 90deg
            );
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, transparent 75%);
        }

        /* ================================================================
           MEDALLION
           ================================================================ */
        .splash-medallion {
          width: 120px;
          height: 120px;
          animation: splash-spin 12s linear infinite, splash-pop 0.8s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        @keyframes splash-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes splash-pop {
          from { opacity: 0; transform: scale(0.4) rotate(-90deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        /* ================================================================
           REGISTON ARCHLARI
           ================================================================ */
        .splash-arches {
          margin-top: 8px;
          width: min(360px, 88vw);
          animation: splash-arch-in 0.9s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }

        .splash-arches-svg {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 0 24px rgba(233,196,106,0.25));
        }

        @keyframes splash-arch-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ================================================================
           BRAND
           ================================================================ */
        .splash-brand {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          animation: splash-brand-in 0.8s 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }

        .splash-brand-line {
          flex: 1;
          max-width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(233,196,106,0.6), transparent);
        }

        .splash-title-wrap {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .splash-title-prefix {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(233,196,106,0.7);
          font-family: Georgia, serif;
        }

        .splash-title {
          font-size: clamp(28px, 7vw, 44px);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #ffffff;
          font-family: -apple-system, "SF Pro Display", "Segoe UI", sans-serif;
          line-height: 1;
          margin: 0;
        }

        .splash-title-accent {
          color: #e9c46a;
        }

        .splash-version {
          font-size: 13px;
          font-weight: 800;
          color: rgba(233,196,106,0.75);
          background: rgba(233,196,106,0.12);
          border: 1px solid rgba(233,196,106,0.25);
          border-radius: 8px;
          padding: 2px 8px;
          letter-spacing: 0.05em;
          align-self: center;
        }

        @keyframes splash-brand-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ================================================================
           TAGLINE — 3 tilda
           ================================================================ */
        .splash-tagline {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 6px 10px;
          animation: splash-brand-in 0.8s 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }

        .splash-tag-uz {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        .splash-tag-en {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.65);
          font-style: italic;
        }

        .splash-tag-ru {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.50);
        }

        .splash-tag-sep {
          color: rgba(233,196,106,0.45);
          font-size: 12px;
        }

        /* ================================================================
           PROGRESS BAR — 3 soniyalik yuklanish
           ================================================================ */
        .splash-progress {
          margin-top: 28px;
          width: min(240px, 60vw);
          height: 3px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          overflow: hidden;
          animation: splash-brand-in 0.5s 0.8s both;
        }

        .splash-progress-bar {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #e9c46a, #c8930a, #e05535);
          animation: splash-progress 2.8s 0.2s cubic-bezier(0.4,0,0.2,1) both;
          transform-origin: left;
        }

        @keyframes splash-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ================================================================
           ANIMATSIYA NUQTALARI
           ================================================================ */
        .splash-dots {
          margin-top: 16px;
          display: flex;
          gap: 8px;
          animation: splash-brand-in 0.5s 0.9s both;
        }

        .splash-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(233,196,106,0.5);
          animation: splash-dot-pulse 1.2s ease-in-out infinite;
        }

        @keyframes splash-dot-pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.8); }
          50%       { opacity: 1;    transform: scale(1.2); }
        }

        /* ================================================================
           PASTKI ORNAMENT
           ================================================================ */
        .splash-footer-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1b4a8a, #c8930a 35%, #e9c46a 50%, #c8930a 65%, #0d7377);
          animation: splash-brand-in 0.5s 1s both;
        }

        .splash-footer-ornament {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(233,196,106,0.4), transparent);
        }

        /* ================================================================
           ASOSIY KONTENT
           ================================================================ */
        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          position: relative;
          z-index: 1;
          padding: 24px 16px;
        }

        /* ================================================================
           REDUCED MOTION
           ================================================================ */
        @media (prefers-reduced-motion: reduce) {
          .splash-medallion,
          .splash-arches,
          .splash-brand,
          .splash-tagline,
          .splash-progress,
          .splash-progress-bar,
          .splash-dots,
          .splash-dot,
          .splash-footer-line {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
