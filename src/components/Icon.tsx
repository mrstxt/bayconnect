import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number, props: SVGProps<SVGSVGElement>) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

/* ---------- Category / service icons ---------- */

export function GuideIcon({ size = 24, ...p }: IconProps) {
  // Mosque / landmark
  return (
    <svg {...base(size, p)}>
      <path d="M12 2c1.6 1.2 2.6 2.6 2.6 4.2 0 1.4-1.1 2.2-2.6 2.2s-2.6-.8-2.6-2.2C9.4 4.6 10.4 3.2 12 2Z" />
      <path d="M5 21v-7a7 7 0 0 1 14 0v7" />
      <path d="M3 21h18" />
      <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
      <path d="M5 11.5 3.5 13M19 11.5 20.5 13" />
    </svg>
  );
}

export function TranslatorIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 5h7" />
      <path d="M7 3v2c0 3.5-1.8 6.5-4 8" />
      <path d="M5 9c.7 1.6 2.3 3 4 4" />
      <path d="M12 20l3.5-8 3.5 8" />
      <path d="M13.4 17h4.2" />
    </svg>
  );
}

export function PhotographerIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

export function TourAgentIcon({ size = 24, ...p }: IconProps) {
  // Globe
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" />
    </svg>
  );
}

export function TransferIcon({ size = 24, ...p }: IconProps) {
  // Plane
  return (
    <svg {...base(size, p)}>
      <path d="M10.5 13.5 3 15l-1-2 6-4-1-6 2-1 3 6 5.5-1.2a2 2 0 0 1 .8 3.9L12 10l-1 8-2 1-1-5.5" />
    </svg>
  );
}

export function HotelIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 21V6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15" />
      <path d="M14 10h6a1 1 0 0 1 1 1v10" />
      <path d="M2 21h20" />
      <path d="M6 8h2M10 8h1M6 11h2M10 11h1M6 14h2M10 14h1M17 14h1M17 17h1" />
    </svg>
  );
}

/* ---------- Transfer sub-types ---------- */

export function CarIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M5 11l1.5-4A2 2 0 0 1 8.4 6h7.2a2 2 0 0 1 1.9 1.4L19 11" />
      <path d="M3 11h18v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" />
      <circle cx="7" cy="14.5" r=".6" fill="currentColor" />
      <circle cx="17" cy="14.5" r=".6" fill="currentColor" />
    </svg>
  );
}

export function MinivanIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 16V9a2 2 0 0 1 2-2h9l5 4v5" />
      <path d="M3 16h2M19 16h2" />
      <path d="M14 7v4h5" />
      <path d="M8 7v4M3 11h11" />
      <circle cx="8" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function SuvIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 15V10a2 2 0 0 1 2-2h4l3-3h4a2 2 0 0 1 2 2v8" />
      <path d="M3 15h2M19 15h2" />
      <path d="M9 5v3M3 10h16" />
      <circle cx="8" cy="16" r="2" />
      <circle cx="17" cy="16" r="2" />
    </svg>
  );
}

export function BusIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <rect x="4" y="4" width="16" height="13" rx="2" />
      <path d="M4 11h16" />
      <path d="M7 7h10" />
      <path d="M6 17v2M18 17v2" />
      <circle cx="8" cy="14" r=".6" fill="currentColor" />
      <circle cx="16" cy="14" r=".6" fill="currentColor" />
    </svg>
  );
}

export function AirportIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M10.5 13.5 3 15l-1-2 6-4-1-6 2-1 3 6 5.5-1.2a2 2 0 0 1 .8 3.9L12 10l-1 8-2 1-1-5.5" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function GlobeGridIcon({ size = 24, ...p }: IconProps) {
  return <TourAgentIcon size={size} {...p} />;
}

/* ---------- UI icons ---------- */

export function HeartIcon({
  size = 24,
  filled = false,
  ...p
}: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size, p)} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20.5s-7.5-4.6-10-9.2C0.3 8 1.7 4.3 5.1 3.4c2.1-.5 4.2.4 5.4 2.1C11.7 3.8 13.8 2.9 15.9 3.4c3.4.9 4.8 4.6 3.1 7.9-2.5 4.6-10 9.2-10 9.2Z" />
    </svg>
  );
}

export function StarIcon({
  size = 24,
  filled = true,
  ...p
}: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size, p)} fill={filled ? "currentColor" : "none"}>
      <path d="M12 3l2.5 5.3 5.8.8-4.2 4 1 5.7L12 22l-5.1-2.7 1-5.7-4.2-4 5.8-.8L12 3Z" />
    </svg>
  );
}

export function CheckIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 12.5 9 17.5 20 6.5" />
    </svg>
  );
}

export function CheckBadgeIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 2.5l2.2 1.6 2.7-.2 1 2.5 2.3 1.4-.5 2.7 1.3 2.4-1.9 1.9.2 2.7-2.6.8-1.3 2.4-2.6-.7-2.3 1.4-2.3-1.4-2.6.7-1.3-2.4-2.6-.8.2-2.7L2.5 15l1.3-2.4-.5-2.7 2.3-1.4 1-2.5 2.7.2L12 2.5Z" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function ExternalLinkIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M14 5h5v5" />
      <path d="M19 5 10 14" />
      <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function HandshakeIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 11l4-3 3 2 3-2.5L17 11" />
      <path d="M3 11v4l4 3 3-2 2 2 2-1.5 3 1.5v-3" />
      <path d="M10 13l2.5 2M13.5 10.5 16 12.5" />
    </svg>
  );
}

export function SearchIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function PinIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

export function PhoneIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
    </svg>
  );
}

export function MailIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

export function ClockIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function UsersIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-1a5 5 0 0 1 10 0v1" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5M21 20v-1a5 5 0 0 0-3.5-4.8" />
    </svg>
  );
}

export function MountainIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 19h18L14 7l-3 5-2-3-6 10Z" />
      <path d="M12.5 12.5 14 10" />
    </svg>
  );
}

export function CompassIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

export function SparkleIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.5 13 11l2.5 1L13 13l-1 2.5L11 13l-2.5-1L11 11l1-2.5Z" />
    </svg>
  );
}

export function CameraFilmIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <rect x="3" y="6" width="14" height="12" rx="2" />
      <path d="M17 10l4-2v8l-4-2" />
      <circle cx="8" cy="12" r="2" />
    </svg>
  );
}

export function BookOpenIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 6c-1.5-1-4-1.5-6-1.5V18c2 0 4.5.5 6 1.5 1.5-1 4-1.5 6-1.5V4.5c-2 0-4.5.5-6 1.5Z" />
      <path d="M12 6v13.5" />
    </svg>
  );
}

export function LightbulbIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export function DesertIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="17" cy="7" r="2.5" />
      <path d="M2 20c3-4 5-4 7 0M9 20c2-3 4-3 6 0M14 20c2-2.5 4-2.5 6 0" />
    </svg>
  );
}

export function MoonIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />
    </svg>
  );
}

export function SoupIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 11h16a8 8 0 0 1-16 0Z" />
      <path d="M3 20h18" />
      <path d="M9 7c0-1 1-1 1-2M13 7c0-1 1-1 1-2" />
    </svg>
  );
}

export function MenuIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function PlusIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function PalmIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 21V10.5" />
      <path d="M12 10.5c-1.6-3-5.2-4-7.2-2.9 1 1.9 2.9 2.9 5 2.9M12 10.5c1.6-3 5.2-4 7.2-2.9-1 1.9-2.9 2.9-5 2.9M12 10.5c0-3 2-5.7 4.9-5.7-.9 2.8-2 4.6-3.7 5.7M12 10.5c0-3-2-5.7-4.9-5.7.9 2.8 2 4.6 3.7 5.7" />
    </svg>
  );
}

/* ---------- Category resolver ---------- */

const CATEGORY_ICONS: Record<
  string,
  (props: IconProps) => React.JSX.Element
> = {
  guide: GuideIcon,
  translator: TranslatorIcon,
  photographer: PhotographerIcon,
  tour_agent: TourAgentIcon,
  transfer: TransferIcon,
  hotel: HotelIcon,
};

const TRANSFER_ICONS: Record<string, (props: IconProps) => React.JSX.Element> = {
  sedan: CarIcon,
  minivan: MinivanIcon,
  suv: SuvIcon,
  bus: BusIcon,
  airport: AirportIcon,
};

export function CategoryIcon({
  category,
  subCategory,
  ...props
}: IconProps & { category: string; subCategory?: string }) {
  if (category === "transfer" && subCategory && TRANSFER_ICONS[subCategory]) {
    const Comp = TRANSFER_ICONS[subCategory];
    return <Comp {...props} />;
  }
  const Comp = CATEGORY_ICONS[category] ?? PalmIcon;
  return <Comp {...props} />;
}

export function TransferTypeIcon({
  type,
  ...props
}: IconProps & { type: string }) {
  const Comp = TRANSFER_ICONS[type] ?? CarIcon;
  return <Comp {...props} />;
}
