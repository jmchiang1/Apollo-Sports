import { cn } from "@/lib/cn";

/**
 * Illustrated top-down badminton court — the hero's centerpiece. A designed,
 * on-brand alternative to a stock photo. Warm palette: cream surface, plum
 * hairlines, caramel-gold net, with a stray pickleball for good measure.
 */
export function CourtGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 460"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Illustration of a badminton court"
    >
      <defs>
        <linearGradient id="court-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#f0e4cf" />
        </linearGradient>
        <radialGradient id="court-glow" cx="0.5" cy="0.42" r="0.7">
          <stop offset="0" stopColor="#f4dca6" stopOpacity="0.6" />
          <stop offset="1" stopColor="#f4dca6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* surface panel */}
      <rect
        x="4"
        y="4"
        width="212"
        height="452"
        rx="24"
        fill="url(#court-surface)"
        stroke="#e0cba8"
        strokeWidth="1.5"
      />
      <rect x="4" y="4" width="212" height="452" rx="24" fill="url(#court-glow)" />

      {/* court lines */}
      <g
        stroke="#38282c"
        strokeOpacity="0.34"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      >
        <rect x="20" y="20" width="180" height="420" rx="2" />
        <line x1="34" y1="20" x2="34" y2="440" />
        <line x1="186" y1="20" x2="186" y2="440" />
        <line x1="20" y1="44" x2="200" y2="44" />
        <line x1="20" y1="416" x2="200" y2="416" />
        <line x1="20" y1="168" x2="200" y2="168" />
        <line x1="20" y1="292" x2="200" y2="292" />
        <line x1="110" y1="44" x2="110" y2="168" />
        <line x1="110" y1="292" x2="110" y2="416" />
      </g>

      {/* net (gold, dashed) + posts */}
      <line
        x1="14"
        y1="230"
        x2="206"
        y2="230"
        stroke="#e4a835"
        strokeWidth="2.4"
        strokeDasharray="2 5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="230" r="3.6" fill="#a9761a" />
      <circle cx="206" cy="230" r="3.6" fill="#a9761a" />

      {/* shuttlecock mid-flight, upper court */}
      <g transform="translate(150 96) rotate(28)">
        <circle cx="0" cy="9" r="5.4" fill="#38282c" />
        <path
          d="M-4.9 5 L-9 -12 h18 L4.9 5"
          fill="none"
          stroke="#e4a835"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M0 5 V-12 M-2.9 4 L-6 -12 M2.9 4 L6 -12"
          stroke="#e4a835"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* motion arc */}
      <path
        d="M150 104 q-34 26 -60 8"
        fill="none"
        stroke="#e4a835"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />

      {/* a stray pickleball, lower court */}
      <g transform="translate(74 356)">
        <circle r="9" fill="#f4a87e" />
        <g fill="rgba(56,40,44,0.28)">
          <circle cx="0" cy="-4.6" r="1.15" />
          <circle cx="-4" cy="-1.6" r="1.15" />
          <circle cx="4" cy="-1.6" r="1.15" />
          <circle cx="-2.6" cy="3" r="1.15" />
          <circle cx="2.6" cy="3" r="1.15" />
        </g>
      </g>
    </svg>
  );
}
