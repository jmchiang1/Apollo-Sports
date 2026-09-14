import type { CSSProperties } from "react";
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
 *
 * TWO LAYERS, and that is the whole point of the hero. Every marking is drawn
 * twice: once as a faint GHOST that is always present, and once as solid INK
 * that draws itself on as the page scrolls. The ghost means the landing frame
 * is a complete, legible court rather than an empty rectangle; the ink means
 * what you watch is the court being marked out, not a facility being toured.
 * A club that is still being drawn cannot be mistaken for one you can book,
 * which is the entire reason this replaced the old fly-over.
 *
 * The ghost is static: it is just there, at rest, from first paint. Only the
 * ink moves, driven by `--draw` from SCROLL and staggered by `--i` (see
 * globals.css). `--draw` is registered with `initial-value: 1`, so anything
 * that never sets it — reduced motion, another consumer of this component —
 * gets the finished court rather than a bare plan.
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

type Seg = [number, number, number, number];
/** A marking, with the stroke weight it carries. */
type Mark = { p: Seg; w: number };

const LINE_W = 1.15;
const NET_W = 1.8; // the net reads a touch bolder than the markings

/**
 * Badminton markings, simplified: one service line per end, spanning only the
 * singles side lines, with the centre line running from it to the net.
 *
 * ORDER IS THE DRAW ORDER, and it is the order a court actually gets marked:
 * the boundary goes down first (and runs around, side by side), then the
 * singles lines, the service lines, the centre lines, and the net last. Keep
 * new markings in the place they would really be painted.
 */
function badmintonMarks(): Mark[] {
  const sgl = x0 + span * 0.075; // singles side lines inset
  const sglR = x1 - span * 0.075;
  const svc = half * 0.13; // service line inset from the back boundary
  return [
    { p: [x0, y0, x1, y0], w: LINE_W }, // outer, drawn around
    { p: [x1, y0, x1, y1], w: LINE_W },
    { p: [x1, y1, x0, y1], w: LINE_W },
    { p: [x0, y1, x0, y0], w: LINE_W },
    { p: [sgl, y0, sgl, y1], w: LINE_W }, // singles side lines
    { p: [sglR, y0, sglR, y1], w: LINE_W },
    { p: [sgl, y0 + svc, sglR, y0 + svc], w: LINE_W }, // service lines
    { p: [sgl, y1 - svc, sglR, y1 - svc], w: LINE_W },
    { p: [cx, y0 + svc, cx, midY], w: LINE_W }, // centre: service line → net
    { p: [cx, midY, cx, y1 - svc], w: LINE_W },
    { p: [x0, midY, x1, midY], w: NET_W }, // the net goes up last
  ];
}

/** Pickleball markings, proportional to a real court. Same draw-order rule. */
function pickleballMarks(): Mark[] {
  const kitchen = half * 0.318; // non-volley zone from net
  return [
    { p: [x0, y0, x1, y0], w: LINE_W },
    { p: [x1, y0, x1, y1], w: LINE_W },
    { p: [x1, y1, x0, y1], w: LINE_W },
    { p: [x0, y1, x0, y0], w: LINE_W },
    { p: [x0, midY - kitchen, x1, midY - kitchen], w: LINE_W }, // kitchen
    { p: [x0, midY + kitchen, x1, midY + kitchen], w: LINE_W },
    { p: [cx, y0, cx, midY - kitchen], w: LINE_W }, // centre (service areas)
    { p: [cx, midY + kitchen, cx, y1], w: LINE_W },
    { p: [x0, midY, x1, midY], w: NET_W },
  ];
}

const SURFACE = {
  slab: { surface: "#0a1513", side: "#050f0e" },
  lifted: { surface: "#1a2b28", side: "#101d1b" },
} as const;

const C = {
  zone: "#c6a15b",
  line: "#f2ece0",
} as const;

/** How visible the un-inked plan is. Enough to read the court, faint enough
 *  that the ink arriving over it is the thing you notice. */
const GHOST = 0.17;

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
  const marks = sport === "pickleball" ? pickleballMarks() : badmintonMarks();
  const kitchen = half * 0.318;

  return (
    <svg
      viewBox={`0 0 ${W} ${L}`}
      className={cn("court-plan-svg", className)}
      // Subtle gold glow like the original IsoCourt art — overrides the
      // stylesheet's heavier dark drop-shadow, which read as 3D bloom once
      // the camera scaled the tile up.
      style={{ filter: "drop-shadow(0 6px 16px rgba(198, 161, 91, 0.22))" }}
      role="img"
      aria-label={`Plan of a ${sport} court`}
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

      {/* Ghost: the faint plan, simply present. It briefly drew itself in on
          page load; that was taken back out, so these are plain strokes with
          no dash machinery. */}
      {marks.map(({ p: [ax, ay, bx, by], w }, i) => (
        <line
          key={`g${i}`}
          x1={ax}
          y1={ay}
          x2={bx}
          y2={by}
          stroke={C.line}
          strokeOpacity={GHOST}
          strokeWidth={w}
          strokeLinecap="round"
        />
      ))}

      {/* Ink: the same markings, drawn on. `pathLength={1}` normalises every
          segment so one dash length covers all of them regardless of their
          real lengths — the same trick the palmette uses. */}
      {marks.map(({ p: [ax, ay, bx, by], w }, i) => (
        <line
          key={`i${i}`}
          className="court-plan-ink"
          style={{ "--i": i } as CSSProperties}
          pathLength={1}
          x1={ax}
          y1={ay}
          x2={bx}
          y2={by}
          stroke={C.line}
          strokeWidth={w}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
