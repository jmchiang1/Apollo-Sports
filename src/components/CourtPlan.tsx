import { cn } from "@/lib/cn";

/**
 * Flat, top-down court plan — drawn in a plain 2D coordinate space so it can be
 * placed in a CSS-3D scene by its parent (see Hero). Unlike IsoCourt, which
 * bakes an isometric projection into the geometry, this stays perfectly flat:
 * the "camera" angle is entirely a `rotateX`/`rotateZ` on the floor above it.
 *
 * Coordinate space is `W` (width, horizontal) × `L` (length, vertical); the net
 * runs horizontally across the middle at y = L/2. Markings are proportional,
 * simplified for legibility at plan scale.
 */

export type Sport = "pickleball" | "badminton";

// plan units — the court is drawn length-vertical so the net sits horizontally
export const W = 92; // width  (the 20ft dimension)
export const L = 200; // length (the 44ft dimension)
const PAD = 4; // breathing room inside the viewBox

const x0 = PAD;
const x1 = W - PAD;
const y0 = PAD;
const y1 = L - PAD;
const cx = W / 2;
const midY = L / 2; // net line

const span = x1 - x0;
const half = y1 - y0;

type Line = [number, number, number, number];

/** Badminton doubles markings, proportional to a real court. */
function badmintonLines(): Line[] {
  const sgl = x0 + span * 0.075; // singles side lines inset
  const sglR = x1 - span * 0.075;
  const shortSvc = half * 0.295; // short service line offset from net
  const longSvc = half * 0.06; // doubles long service line inset from back
  return [
    [x0, y0, x1, y0],
    [x1, y0, x1, y1],
    [x1, y1, x0, y1],
    [x0, y1, x0, y0], // outer
    [sgl, y0, sgl, y1],
    [sglR, y0, sglR, y1], // singles side lines
    [x0, midY - shortSvc, x1, midY - shortSvc], // short service lines
    [x0, midY + shortSvc, x1, midY + shortSvc],
    [x0, y0 + longSvc, x1, y0 + longSvc], // long service lines (doubles)
    [x0, y1 - longSvc, x1, y1 - longSvc],
    [cx, y0 + longSvc, cx, midY - shortSvc], // centre lines (service courts)
    [cx, midY + shortSvc, cx, y1 - longSvc],
  ];
}

/** Pickleball markings, proportional to a real court. */
function pickleballLines(): Line[] {
  const kitchen = half * 0.318; // non-volley zone from net
  return [
    [x0, y0, x1, y0],
    [x1, y0, x1, y1],
    [x1, y1, x0, y1],
    [x0, y1, x0, y0], // outer
    [x0, midY - kitchen, x1, midY - kitchen], // kitchen lines
    [x0, midY + kitchen, x1, midY + kitchen],
    [cx, y0, cx, midY - kitchen], // centre lines (service areas only)
    [cx, midY + kitchen, cx, y1],
  ];
}

const SURFACE = {
  slab: { surface: "#1D3C44", side: "#132a30" },
  lifted: { surface: "#2c5c68", side: "#1d434d" },
} as const;

const C = {
  zone: "#5fc5b3",
  line: "#f6f5f0",
} as const;

export function CourtPlan({
  sport,
  tone = "lifted",
  className,
}: {
  sport: Sport;
  tone?: keyof typeof SURFACE;
  className?: string;
}) {
  const { surface } = SURFACE[tone];
  const lines = sport === "pickleball" ? pickleballLines() : badmintonLines();
  const kitchen = half * 0.318;

  return (
    <svg
      viewBox={`0 0 ${W} ${L}`}
      className={cn("court-plan-svg", className)}
      // Subtle teal glow like the original IsoCourt art — overrides the
      // stylesheet's heavier dark drop-shadow, which read as 3D bloom once
      // the camera scaled the tile up.
      style={{ filter: "drop-shadow(0 6px 16px rgba(95, 197, 179, 0.25))" }}
      role="img"
      aria-label={`Top-down plan of a ${sport} court`}
    >
      {/* slab */}
      <rect x={0} y={0} width={W} height={L} rx={2} fill={surface} />

      {/* pickleball kitchen accent */}
      {sport === "pickleball" && (
        <rect
          x={x0}
          y={midY - kitchen}
          width={span}
          height={kitchen * 2}
          fill={C.zone}
          fillOpacity={0.9}
        />
      )}

      {/* net line — a touch bolder than the markings */}
      <line
        x1={x0}
        y1={midY}
        x2={x1}
        y2={midY}
        stroke={C.line}
        strokeWidth={1.8}
        strokeLinecap="round"
      />

      {lines.map(([ax, ay, bx, by], i) => (
        <line
          key={i}
          x1={ax}
          y1={ay}
          x2={bx}
          y2={by}
          stroke={C.line}
          strokeWidth={1.15}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
