import { ImageResponse } from "next/og";

/**
 * Ijtimoiy tarmoqlar uchun OG rasm (1200×630).
 *
 * Avval /bayconnect.png ishlatilardi — u 5917×1375 banner bo'lib,
 * metadata esa 1200×630 deb ko'rsatgan edi, natijada Telegram/LinkedIn
 * preview'lari cho'zilib/qirqilib ko'rinardi. Endi rasm build paytida
 * aynan kerakli o'lchamda, brend dizaynida generatsiya qilinadi.
 */
export const alt = "bayConnect — O'zbekiston bo'ylab turizm xizmatlari marketplace'i";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#123f34",
          background:
            "radial-gradient(700px 420px at 8% 0%, rgba(255,196,0,0.28), transparent 60%), radial-gradient(760px 480px at 100% 8%, rgba(61,91,255,0.14), transparent 60%), linear-gradient(180deg, #f6f0e9 0%, #fdfaf6 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo qatori */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 76,
              height: 76,
              borderRadius: 22,
              background: "linear-gradient(135deg, #0b8267, #0c2b23)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
              <circle cx="31" cy="16" r="5.6" fill="#ffc400" />
              <path d="M10 33.5 L20 17.5 L27.5 28 L31.5 22.5 L40 33.5 Z" fill="#bfe3d6" opacity="0.55" />
              <path d="M14 33.5 L21.5 21.5 L26.5 28.5 L30.5 23 L38 33.5 Z" fill="#eaf4ef" />
              <rect x="9" y="36" width="30" height="3.4" rx="1.7" fill="#ff6b4a" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
            bay<span style={{ color: "#006b55" }}>Connect</span>
          </div>
        </div>

        {/* Sarlavha */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.06, letterSpacing: -2, maxWidth: 920 }}>
            O'zbekiston bo'ylab turizm xizmatlari bir platformada
          </div>
          <div style={{ fontSize: 30, color: "#506861", maxWidth: 860 }}>
            Gidlar · Tarjimonlar · Fotograflar · Transfer · Mehmonxonalar
          </div>
        </div>

        {/* Pastki chiziq */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {["Tekshirilgan profillar", "Shaffof narxlar", "Tez zayavka"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 999,
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(0,107,85,0.14)",
                padding: "10px 22px",
                fontSize: 24,
                fontWeight: 600,
                color: "#006b55",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
