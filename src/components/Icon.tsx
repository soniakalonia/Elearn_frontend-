import type { SVGProps } from "react";

const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  bag: <><path d="M6 8h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  arrowRight: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  arrowLeft: <><path d="M20 12H5" /><path d="m11 6-6 6 6 6" /></>,
  arrowUpRight: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  check: <path d="m4.5 12.5 5 5L20 7" />,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.6 2.6L16 9" /></>,
  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  menu: <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>,
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.4l6.1-.9L12 3Z" />,
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" /><circle cx="9" cy="7" r="3.4" /><path d="M17 4.2a3.4 3.4 0 0 1 0 6.6" /><path d="M22 20v-1.5a4 4 0 0 0-3-3.8" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  download: <><path d="M12 4v11" /><path d="m7 11 5 5 5-5" /><path d="M4 20h16" /></>,
  award: <><circle cx="12" cy="9" r="5.5" /><path d="m8.5 14-1.5 7 5-2.6 5 2.6-1.5-7" /></>,
  lock: <><rect x="4" y="10" width="16" height="10" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  phone: <path d="M6.6 3h2.9l1.4 4-2 1.3a13 13 0 0 0 5.8 5.8l1.3-2 4 1.4v2.9A2.6 2.6 0 0 1 17.4 19C10.4 18.6 5.4 13.6 5 6.6A2.6 2.6 0 0 1 6.6 3Z" />,
  mapPin: <><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.8" /></>,
  send: <><path d="M21 3 10.5 13.5" /><path d="M21 3l-6.6 18-3.9-7.5L3 9.6 21 3Z" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4.5h6V7" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v5M14 11v5" /></>,
  filter: <><path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" /></>,
  grid: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.6" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" /></>,
  zap: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  refresh: <><path d="M20 11a8 8 0 0 0-14.6-4.4L3 9" /><path d="M3 4v5h5" /><path d="M4 13a8 8 0 0 0 14.6 4.4L21 15" /><path d="M21 20v-5h-5" /></>,
  quote: <path d="M9.5 5C6.5 6.3 5 9 5 12.2V19h6v-7H7.6c0-1.8.7-3.1 2.6-4.2L9.5 5Zm9 0C15.5 6.3 14 9 14 12.2V19h6v-7h-3.4c0-1.8.7-3.1 2.6-4.2L18.5 5Z" />,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2.5" /><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3H5.5A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8" /></>,
  cloud: <path d="M17.5 19H7a4.5 4.5 0 0 1-.6-8.96A6.5 6.5 0 0 1 19 10.6 4.2 4.2 0 0 1 17.5 19Z" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4 5.4-2.2Z" /></>,
  sparkle: <><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
  shield: <><path d="M12 3 4.5 6v6c0 4.5 3 7.8 7.5 9 4.5-1.2 7.5-4.5 7.5-9V6L12 3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>,
  code: <><path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /><path d="m13.5 4-3 16" /></>,
  pen: <><path d="m3 21 1.2-5 12-12a2.5 2.5 0 0 1 3.6 0l1 1a2.5 2.5 0 0 1 0 3.6l-12 12L3 21Z" /><path d="m14 6 4 4" /></>,
  chart: <><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 16v-5M13 16V7M18 16v-8" /></>,
  bot: <><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M12 7V3.5" /><circle cx="9" cy="12.5" r="1.2" /><circle cx="15" cy="12.5" r="1.2" /><path d="M9.5 16h5" /></>,
  layout: <><rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M3 9h18" /><path d="M9 21V9" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
  receipt: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z" /><path d="M9 7h6M9 11h6M9 15h4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.5 1Z" /></>,
  logout: <><path d="M9 21H5.5A2.5 2.5 0 0 1 3 18.5v-13A2.5 2.5 0 0 1 5.5 3H9" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>,
  flame: <path d="M12 22c4 0 7-2.7 7-6.5 0-4.5-4-6.5-4-10.5-2 1.5-3.3 3.3-3.3 5.5 0 1-.6 1.7-1.4 1.7-.9 0-1.4-.7-1.4-1.9C7.5 12 5 13.5 5 15.7 5 19.2 8 22 12 22Z" />,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 6-2 7-2 7h16s-2-1-2-7Z" /><path d="M10.5 20a2 2 0 0 0 3 0" /></>,
  brain: <><path d="M9.5 3a3 3 0 0 0-3 3 3.2 3.2 0 0 0-2 5.7A3.2 3.2 0 0 0 6 17.5a3 3 0 0 0 3.5 3.2V3Z" /><path d="M14.5 3a3 3 0 0 1 3 3 3.2 3.2 0 0 1 2 5.7A3.2 3.2 0 0 1 18 17.5a3 3 0 0 1-3.5 3.2V3Z" /></>,
  route: <><circle cx="6" cy="19" r="2.5" /><circle cx="18" cy="5" r="2.5" /><path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" /></>,
  alert: <><path d="M10.3 3.7 2.5 17.3A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.7L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  share: <><circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" /><path d="m8.3 10.7 7.4-4.2M8.3 13.3l7.4 4.2" /></>,
  video: <><rect x="2.5" y="5" width="14" height="14" rx="3" /><path d="m16.5 10 5-3v10l-5-3" /></>,
  file: <><path d="M13 2H7a2.5 2.5 0 0 0-2.5 2.5v15A2.5 2.5 0 0 0 7 22h10a2.5 2.5 0 0 0 2.5-2.5V8.5L13 2Z" /><path d="M13 2v6.5h6.5" /></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  whatsapp: <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.6ZM8.4 7.5c-.3 0-.7.1-1 .5-.4.4-1 1.1-1 2.5 0 1.5 1.1 3 1.3 3.2.2.3 2.1 3.3 5.1 4.5 2.5 1 3 .8 3.6.8.6-.1 1.8-.8 2.1-1.5.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.7-.4l-2-1c-.3-.1-.5-.2-.7.1l-1 1.2c-.2.2-.4.2-.7.1a6.9 6.9 0 0 1-2-1.3 7.7 7.7 0 0 1-1.4-1.8c-.1-.2 0-.4.1-.5l.6-.7c.2-.2.2-.3.3-.5 0-.2 0-.4-.1-.6l-.9-2.2c-.2-.5-.4-.4-.6-.4h-.4Z" />,
  linkedin: <><path d="M4.5 9h3v12h-3z" /><circle cx="6" cy="5" r="2" /><path d="M10.5 21V9h3v1.7c.8-1.2 1.9-2 3.5-2 3 0 4 1.9 4 5.3V21h-3v-6.2c0-1.7-.6-2.6-1.9-2.6-1.4 0-2.6 1-2.6 2.9V21h-3Z" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" /></>,
  twitter: <path d="M4 4h4l4.2 5.8L17 4h3l-6.5 8L21 20h-4l-4.7-6.4L6.5 20H3.5l7.1-8.7L4 4Z" />,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10.5 9.5 5 2.5-5 2.5v-5Z" /></>,
  creditCard: <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19" /><path d="M6 15h3" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  spark: <><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><path d="m5 5 4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" /></>,
  mic: <><rect x="9" y="2.5" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></>,
  paperclip: <path d="M21 11.5 12.5 20a5 5 0 0 1-7-7L14 4.5a3.4 3.4 0 0 1 4.8 4.8L10.4 18a1.8 1.8 0 1 1-2.5-2.5l8.4-8.4" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  shieldCheck: <><path d="m12 2 8 3.5v6C20 17 16.4 20.6 12 22c-4.4-1.4-8-5-8-10.5v-6L12 2Z" /><path d="m8.5 11.5 2.5 2.5 4.5-4.5" /></>,
  graduation: <><path d="m2.5 8.5 9.5-4 9.5 4-9.5 4-9.5-4Z" /><path d="M6.5 10.5V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5.5" /><path d="M21.5 8.5V15" /></>,
  ticket: <><path d="M3 8.5V6a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 6v2.5a3.5 3.5 0 0 0 0 7V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-2.5a3.5 3.5 0 0 0 0-7Z" /><path d="M14 5v14" /></>,
  gift: <><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M3 12h18M12 8v13" /><path d="M12 8S10.5 3 7.5 3 5 8 8.5 8M12 8s1.5-5 4.5-5S19 8 15.5 8" /></>,
  rocket: <><path d="M5 15c-1.5 1.5-2 6-2 6s4.5-.5 6-2" /><path d="M9 15l-3-3c2-6 8-10 15-10 0 7-4 13-10 15l-2-2Z" /><circle cx="15" cy="9" r="1.8" /></>,
  monitor: <><rect x="2.5" y="4" width="19" height="13" rx="2.5" /><path d="M8 21h8M12 17v4" /></>,
  infinity: <path d="M18.5 8a4 4 0 0 1 0 8c-3.5 0-5.5-8-9-8a4 4 0 0 0 0 8c3.5 0 5.5-8 9-8Z" />,
};

export type IconName = keyof typeof paths;

type Props = {
  name: IconName | string;
  size?: number;
  className?: string;
  strokeWidth?: number;
} & Omit<SVGProps<SVGSVGElement>, "name" | "className" | "strokeWidth">;

export default function Icon({ name, size = 18, className = "", strokeWidth = 1.8, ...rest }: Props) {
  const node = paths[name as IconName];
  if (!node) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {node}
    </svg>
  );
}
