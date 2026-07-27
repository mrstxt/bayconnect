// bayClub brand tokens
export const brand = {
  name: "bayClub",
  tagline: "Sayohatingiz uchun eng zo'r hamroh",
  colors: {
    orange: "#FF6B4A",
    orangeDark: "#E05235",
    yellow: "#FFC400",
    blue: "#0717B8",
    green: "#006B55",
    cream: "#F7EDE4",
    ink: "#123F34",
    muted: "#7B827F",
    surface: "#F7F2ED",
    white: "#FFFFFF",
  },
};

// Asosiy kategoriyalar
export const CATEGORIES = [
  { key: "guide", label: "Gid", emoji: "🕌", color: "orange", description: "Tarixiy va madaniy ekskursiyalar" },
  { key: "translator", label: "Tarjimon", emoji: "🗣️", color: "dark", description: "Sinxron va yo'riqnoma tarjima" },
  { key: "photographer", label: "Fotograf", emoji: "📸", color: "orange", description: "Sayohat va portret suratlar" },
  { key: "tour_agent", label: "Tur agent", emoji: "🌍", color: "blue", description: "To'liq paket va viza yordami" },
  { key: "transfer", label: "Transfer", emoji: "✈️", color: "blue", description: "Aeroport va shaharlararo" },
  { key: "hotel", label: "Mehmonxona", emoji: "🏨", color: "yellow", description: "Qulay joylashuv" },
] as const;

// Faqat mutaxassislar (odamlar) — /experts sahifasi uchun
export const EXPERT_CATEGORIES = [
  { key: "guide", label: "Gidlar", emoji: "🕌", color: "orange", description: "Mahalliy tarix va madaniyat mutaxassislari" },
  { key: "translator", label: "Tarjimonlar", emoji: "🗣️", color: "dark", description: "Sinxron va ketma-ket tarjima" },
  { key: "photographer", label: "Fotograflar", emoji: "📸", color: "orange", description: "Sayohat va portret ustalar" },
  { key: "tour_agent", label: "Tur agentlari", emoji: "🌍", color: "blue", description: "Kompleks paket va viza" },
] as const;

// Transport turlari — /transfer sahifasi uchun
export const TRANSFER_TYPES = [
  { key: "sedan", label: "Yengil avto", emoji: "🚗", capacity: "1–4", description: "Sedan va krossover" },
  { key: "minivan", label: "Minivan", emoji: "🚐", capacity: "5–8", description: "Kichik guruhlar uchun" },
  { key: "suv", label: "Yo'ltanlamas", emoji: "🚙", capacity: "4–7", description: "Tog' va qishloq yo'llari" },
  { key: "bus", label: "Avtobus", emoji: "🚌", capacity: "20–50", description: "Katta guruh va tur" },
  { key: "airport", label: "Aeroport", emoji: "✈️", capacity: "1–8", description: "24/7 aeroport transferi" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];
export type TransferKey = (typeof TRANSFER_TYPES)[number]["key"];

export function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export function categoryEmoji(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.emoji ?? "🌴";
}

export function categoryMeta(key: string) {
  return CATEGORIES.find((c) => c.key === key);
}

export function transferMeta(key: string) {
  return TRANSFER_TYPES.find((t) => t.key === key);
}

export function transferLabel(key: string): string {
  return TRANSFER_TYPES.find((t) => t.key === key)?.label ?? key;
}

export function coverBg(color: string): string {
  switch (color) {
    case "yellow":
      return "bg-gradient-to-br from-yellow-200 via-[#ffc400] to-[#ffcf3b]";
    case "blue":
      return "bg-gradient-to-br from-[#6d79ff] via-[#2738e8] to-[#0717b8]";
    case "dark":
      return "bg-gradient-to-br from-[#1f5b4c] via-[#123f34] to-[#09251f]";
    case "green":
      return "bg-gradient-to-br from-[#45c5a4] via-[#159477] to-[#006b55]";
    case "orange":
    default:
      return "bg-gradient-to-br from-[#ff9c7e] via-[#ff6b4a] to-[#e05235]";
  }
}

export function categoryGradient(color: string): string {
  switch (color) {
    case "yellow":
      return "linear-gradient(135deg,#FFD94A,#FFC400)";
    case "blue":
      return "linear-gradient(135deg,#2738E8,#0717B8)";
    case "dark":
      return "linear-gradient(135deg,#1F5B4C,#123F34)";
    case "green":
      return "linear-gradient(135deg,#159477,#006B55)";
    case "orange":
    default:
      return "linear-gradient(135deg,#FF8A68,#FF6B4A)";
  }
}

export function formatPrice(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatRating(value: number | string): string {
  return Number(value).toFixed(1);
}

export const CITIES = [
  "Toshkent",
  "Samarqand",
  "Buxoro",
  "Xiva",
  "Chimyon",
  "Andijon",
  "Namangan",
  "Farg'ona",
  "Nukus",
  "Qarshi",
  "Termiz",
  "Shahrisabz",
] as const;

// Hamkor sayt — tayyor tur paketlari shu yerda sotiladi (biz faqat reklama qilamiz)
export const PARTNER_NAME = "bayTrip";
export const PARTNER_URL = "https://baytrip.vercel.app";

// Navbar bo'limlari
export const NAV_ITEMS = [
  { href: "/", label: "Bosh sahifa", external: false },
  { href: "/experts", label: "Mutaxassislar", external: false },
  { href: "/transfer", label: "Transfer", external: false },
  { href: PARTNER_URL, label: "Hamkor", external: true },
  { href: "/hotels", label: "Mehmonxonalar", external: false },
  { href: "/blog", label: "Blog", external: false },
] as const;
