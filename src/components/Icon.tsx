/**
 * ไอคอนแบบ sprite
 *
 * เลือกใช้ SVG monoline แทน emoji เพราะ emoji เรนเดอร์ต่างกันในแต่ละเครื่อง
 * และบน Android รุ่นเก่าบางตัวจะกลายเป็นกล่องสี่เหลี่ยม
 * <Sprite /> ต้องถูกวางไว้ครั้งเดียวใน root layout
 */

export type IconName =
  | "leaf" | "sun" | "cloud" | "drop" | "camera" | "mic" | "map" | "coins"
  | "check" | "alert" | "clock" | "chevron" | "sparkle" | "flash" | "images"
  | "user" | "close" | "pin" | "chart" | "grid" | "calendar" | "flask"
  | "bug" | "bag" | "drone" | "cart" | "thermo" | "download" | "wifi-off"
  | "search" | "plus";

const PATHS: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),

  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9" />
    </>
  ),
  cloud: (
    <>
      <path d="M17.5 16a4 4 0 0 0-.8-7.9 6 6 0 0 0-11.4 2A3.5 3.5 0 0 0 6 16" />
      <path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" />
    </>
  ),
  drop: <path d="M12 2.7 6.6 9.3a7 7 0 1 0 10.8 0z" />,
  camera: (
    <>
      <path d="M3 8h3l2-3h8l2 3h3v11H3z" />
      <circle cx="12" cy="13" r="3.4" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
    </>
  ),
  map: (
    <>
      <path d="m9 3-6 3v15l6-3 6 3 6-3V3l-6 3z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3.2" />
      <path d="M4 6v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6" />
      <path d="M4 12v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-6" />
    </>
  ),
  check: <path d="m4 12.5 5.2 5.2L20 7" />,
  alert: (
    <>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 6.5V12l3.6 2.2" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
  sparkle: (
    <>
      <path d="M12 2.5 14.2 9 21 11.2 14.2 13.4 12 20l-2.2-6.6L3 11.2 9.8 9z" />
      <path d="M19 3v3M20.5 4.5h-3" />
    </>
  ),
  flash: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  images: (
    <>
      <rect x="7" y="3" width="14" height="14" rx="2" />
      <path d="M17 21H5a2 2 0 0 1-2-2V7" />
      <circle cx="11.5" cy="7.5" r="1.5" />
      <path d="m8 14 3-3 4 4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v17a1 1 0 0 0 1 1h17" />
      <path d="m7 14 4-4 3 3 5-6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  flask: (
    <>
      <path d="M10 2v6.5L4.5 18A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 8.5V2" />
      <path d="M8.5 2h7M7 15h10" />
    </>
  ),
  bug: (
    <>
      <rect x="8" y="6" width="8" height="14" rx="4" />
      <path d="M8 12H3M21 12h-5M8 8 5 5M16 8l3-3M8 17l-3 3M16 17l3 3" />
    </>
  ),
  bag: (
    <>
      <path d="M6 2 3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-5z" />
      <path d="M3 7h18M16 11a4 4 0 0 1-8 0" />
    </>
  ),
  drone: (
    <>
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <circle cx="5" cy="5" r="2.6" />
      <circle cx="19" cy="5" r="2.6" />
      <circle cx="5" cy="19" r="2.6" />
      <circle cx="19" cy="19" r="2.6" />
      <path d="m7 7 2 2M17 7l-2 2M7 17l2-2M17 17l-2-2" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.6 12.4a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </>
  ),
  thermo: <path d="M14 14.8V4a2 2 0 1 0-4 0v10.8a4.5 4.5 0 1 0 4 0Z" />,
  download: <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16" />,
  "wifi-off": (
    <>
      <path d="M3 3l18 18" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0M5 12a10 10 0 0 1 3.2-2.2M19 12a10 10 0 0 0-6.6-2.9M12 19.5h.01" />
    </>
  ),
};

/** วางไว้ครั้งเดียวใน root layout */
export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      {(Object.keys(PATHS) as IconName[]).map((name) => (
        <symbol key={name} id={`i-${name}`} viewBox="0 0 24 24">
          {PATHS[name]}
        </symbol>
      ))}
    </svg>
  );
}

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  /** ใส่เมื่อไอคอนสื่อความหมายเอง ไม่ได้มีข้อความกำกับอยู่ข้าง ๆ */
  label?: string;
}

export function Icon({ name, size = 18, color, className, label }: IconProps) {
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      style={{ width: size, height: size, color }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}
