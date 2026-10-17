import type { SVGProps } from "react";

export type IconName =
  | "dashboard"
  | "user"
  | "code"
  | "folder"
  | "image"
  | "mail"
  | "logout"
  | "plus"
  | "pencil"
  | "trash"
  | "x"
  | "check"
  | "chevron-down"
  | "arrow-up"
  | "arrow-right"
  | "external"
  | "github"
  | "linkedin"
  | "send"
  | "phone"
  | "download"
  | "eye"
  | "menu"
  | "refresh"
  | "alert"
  | "link"
  | "globe"
  | "inbox"
  | "spark"
  | "clock"
  | "map-pin"
  | "star"
  | "sun"
  | "moon"
  | "upload"
  | "message"
  | "shield";

const stroke: Record<string, React.ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  upload: <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />,
  message: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5C8 19.2 5 15.5 5 11V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7.5" height="9" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="5.5" rx="1.5" />
      <rect x="13.5" y="12" width="7.5" height="9" rx="1.5" />
      <rect x="3" y="15.5" width="7.5" height="5.5" rx="1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" />
    </>
  ),
  code: (
    <>
      <path d="M8 8l-4.5 4L8 16" />
      <path d="M16 8l4.5 4L16 16" />
      <path d="M13.5 5l-3 14" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />,
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="M21 15.5l-5-4.5-9 8" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7.5l9 6 9-6" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  pencil: <path d="M4 20l4.5-1L19.6 7.9a2.1 2.1 0 0 0-3-3L5.5 16 4 20z" />,
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7l1 12.5a2 2 0 0 0 2 1.5h5a2 2 0 0 0 2-1.5l1-12.5" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  "arrow-up": (
    <>
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </>
  ),
  external: (
    <>
      <path d="M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" />
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
    </>
  ),
  send: (
    <>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5h.01" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a5 5 0 0 0 7.1 0l2.4-2.4a5 5 0 0 0-7.1-7.1L11 5.9" />
      <path d="M14 10a5 5 0 0 0-7.1 0l-2.4 2.4a5 5 0 0 0 7.1 7.1L13 18.1" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 5h16l2 7v7H2v-7l2-7z" />
      <path d="M2 12h6l2 3h4l2-3h6" />
    </>
  ),
  spark: (
    <path d="M12 3l1.9 5.6L20 10l-5 3.6L16.5 20 12 16.6 7.5 20 9 13.6 4 10l6.1-1.4L12 3z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
  ),
};

const fill: Record<string, string> = {
  github:
    "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z",
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9z",
};

export function Icon({
  name,
  className = "h-4 w-4",
  ...props
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  const fillPath = fill[name];
  if (fillPath) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden {...props}>
        <path d={fillPath} />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {stroke[name] ?? stroke.spark}
    </svg>
  );
}

/* Skill marks — custom-drawn monochrome glyphs keyed by skill.icon */
export function SkillMark({
  icon,
  className = "h-7 w-7",
}: {
  icon: string;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const label = (t: string, size = 8) => (
    <text
      x="12"
      y="15.5"
      textAnchor="middle"
      fontSize={size}
      fontFamily="Manrope, sans-serif"
      fontWeight={700}
      fill="currentColor"
      stroke="none"
    >
      {t}
    </text>
  );
  switch (icon) {
    case "html5":
      return (
        <svg {...common}>
          <path d="M4.5 3h15l-1.4 16.5L12 21.5l-6.1-2L4.5 3z" />
          {label("5")}
        </svg>
      );
    case "css3":
      return (
        <svg {...common}>
          <path d="M4.5 3h15l-1.4 16.5L12 21.5l-6.1-2L4.5 3z" />
          {label("3")}
        </svg>
      );
    case "sass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <text x="12" y="15.8" textAnchor="middle" fontSize="10" fontStyle="italic" fontFamily="Georgia, serif" fill="currentColor" stroke="none">
            S
          </text>
        </svg>
      );
    case "bootstrap":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          {label("B", 9)}
        </svg>
      );
    case "javascript":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2.5" />
          {label("JS", 7)}
        </svg>
      );
    case "react":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
        </svg>
      );
    case "git":
      return (
        <svg {...common}>
          <circle cx="6.5" cy="6" r="2.2" />
          <circle cx="6.5" cy="18" r="2.2" />
          <circle cx="17.5" cy="8" r="2.2" />
          <path d="M6.5 8.2v7.6" />
          <path d="M17.5 10.2c0 3.4-4.5 3.3-8 4.6" />
        </svg>
      );
    case "figma":
      return (
        <svg {...common}>
          <path d="M9 3h3v6H9a3 3 0 0 1 0-6z" />
          <path d="M12 3h3a3 3 0 0 1 0 6h-3V3z" />
          <path d="M9 9h3v6H9a3 3 0 0 1 0-6z" />
          <circle cx="14.5" cy="12" r="3" />
          <path d="M9 15h3v3a3 3 0 1 1-3-3z" />
        </svg>
      );
    case "responsive":
      return (
        <svg {...common}>
          <rect x="2.5" y="5" width="14" height="10" rx="1.5" />
          <path d="M7 18.5h5" />
          <path d="M9.5 15v3.5" />
          <rect x="15.5" y="10" width="6" height="9" rx="1.5" />
        </svg>
      );
    case "comm":
      return (
        <svg {...common}>
          <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h7A2.5 2.5 0 0 1 15 6.5v4a2.5 2.5 0 0 1-2.5 2.5H8l-3.5 3v-3H5.5A2.5 2.5 0 0 1 3 10.5v-4z" />
          <path d="M17 9h2.5A1.5 1.5 0 0 1 21 10.5v4a1.5 1.5 0 0 1-1.5 1.5H19v2.5L16 16h-2" />
        </svg>
      );
    case "team":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="2.8" />
          <circle cx="16.5" cy="10.5" r="2.2" />
          <path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
          <path d="M15 15c2.6-.2 4.8 1.2 5.5 4" />
        </svg>
      );
    case "problem":
      return (
        <svg {...common}>
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M12 3a6 6 0 0 1 4 10.5c-.8.7-1 1.5-1 2.5h-6c0-1-.2-1.8-1-2.5A6 6 0 0 1 12 3z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 3l1.9 5.6L20 10l-5 3.6L16.5 20 12 16.6 7.5 20 9 13.6 4 10l6.1-1.4L12 3z" />
        </svg>
      );
  }
}
