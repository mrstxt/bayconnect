import { ImageResponse } from "next/og";
import { siteUrl } from "@/lib/site";

/**
 * Ijtimoiy tarmoqlar uchun OG rasm (1200×630).
 */
export const alt = "bayConnect — O'zbekiston bo'ylab turizm xizmatlari marketplace'i";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const logoUrl = `${siteUrl()}/bayconnect.png`;

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
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logoUrl} alt="bayConnect" width={338} height={78} style={{ objectFit: "contain" }} />
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
