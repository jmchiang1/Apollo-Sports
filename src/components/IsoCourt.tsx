import { cn } from "@/lib/cn";

/**
 * Isometric racquet court illustration, drawn to match the pickleball-court
 * aesthetic (tan surface, cream service boxes, charcoal lines, gold mesh net).
 * Both sports share the same outer court + net; only the internal markings
 * differ — so pickleball and badminton read as identical illustrations.
 */

type Sport = "pickleball" | "badminton";

// ── isometric projection ──────────────────────────────────────────────────
// court is 44 (length) x 20 (width) "feet"; P maps court coords → screen.
const SF = 12;
const AX = 0.85 * SF; // length-axis screen delta per foot
const AY = -0.5 * SF;
const NETH = 46; // net height (screen px)
const DEPTH = 15; // court slab thickness

function P(x: number, y: number, lift = 0) {
  return { x: (x + y) * AX, y: (y - x) * -AY - lift };
}
const s = (p: { x: number; y: number }) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
const poly = (corners: [number, number][]) => corners.map(([x, y]) => s(P(x, y))).join(" ");

type Marks = { boxes: [number, number][][]; lines: [number, number, number, number][] };

const OUTER: [number, number, number, number][] = [
  [0, 0, 44, 0],
  [44, 0, 44, 20],
  [44, 20, 0, 20],
  [0, 20, 0, 0],
];

const MARKINGS: Record<Sport, Marks> = {
  pickleball: {
    boxes: [
      [[0, 0], [15, 0], [15, 10], [0, 10]],
      [[0, 10], [15, 10], [15, 20], [0, 20]],
      [[29, 0], [44, 0], [44, 10], [29, 10]],
      [[29, 10], [44, 10], [44, 20], [29, 20]],
    ],
    lines: [
      ...OUTER,
      [15, 0, 15, 20], // non-volley (kitchen) lines
      [29, 0, 29, 20],
      [0, 10, 15, 10], // centre lines (service areas only)
      [29, 10, 44, 10],
    ],
  },
  badminton: {
    boxes: [
      [[2.5, 1.5], [15.5, 1.5], [15.5, 10], [2.5, 10]],
      [[2.5, 10], [15.5, 10], [15.5, 18.5], [2.5, 18.5]],
      [[28.5, 1.5], [41.5, 1.5], [41.5, 10], [28.5, 10]],
      [[28.5, 10], [41.5, 10], [41.5, 18.5], [28.5, 18.5]],
    ],
    lines: [
      ...OUTER,
      [0, 1.5, 44, 1.5], // singles side lines
      [0, 18.5, 44, 18.5],
      [15.5, 0, 15.5, 20], // short service lines
      [28.5, 0, 28.5, 20],
      [2.5, 0, 2.5, 20], // doubles long service lines
      [41.5, 0, 41.5, 20],
      [2.5, 10, 15.5, 10], // centre lines
      [28.5, 10, 41.5, 10],
    ],
  },
};

const C = {
  surface: "#cbb083",
  side: "#ab8d55",
  cream: "#f7efe0",
  line: "#2a2622",
  gold: "#e0a63a",
};

export function IsoCourt({
  sport,
  className,
}: {
  sport: Sport;
  className?: string;
}) {
  const m = MARKINGS[sport];

  // key screen points
  const A = P(0, 0);
  const D = P(0, 20);
  const Cc = P(44, 20);
  const N0 = P(22, 0);
  const N1 = P(22, 20);

  const NV = 16; // vertical mesh strands
  const NH = 5; // horizontal mesh strands

  return (
    <svg
      viewBox="0 0 701 447"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Illustration of a ${sport} court`}
    >
      <g transform="translate(24 288)">
        {/* court slab sides (3D thickness) */}
        <polygon
          points={`${s(A)} ${s(D)} ${D.x},${D.y + DEPTH} ${A.x},${A.y + DEPTH}`}
          fill={C.side}
        />
        <polygon
          points={`${s(D)} ${s(Cc)} ${Cc.x},${Cc.y + DEPTH} ${D.x},${D.y + DEPTH}`}
          fill={C.side}
        />

        {/* top surface */}
        <polygon points={poly([[0, 0], [44, 0], [44, 20], [0, 20]])} fill={C.surface} />

        {/* cream service boxes */}
        {m.boxes.map((b, i) => (
          <polygon key={i} points={poly(b)} fill={C.cream} />
        ))}

        {/* court lines */}
        {m.lines.map(([x1, y1, x2, y2], i) => {
          const p1 = P(x1, y1);
          const p2 = P(x2, y2);
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={C.line}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}

        {/* net */}
        <polygon
          points={`${s(N0)} ${s(N1)} ${N1.x},${N1.y - NETH} ${N0.x},${N0.y - NETH}`}
          fill={C.gold}
          fillOpacity={0.16}
        />
        {Array.from({ length: NV + 1 }).map((_, i) => {
          const t = i / NV;
          const bx = N0.x + (N1.x - N0.x) * t;
          const by = N0.y + (N1.y - N0.y) * t;
          return (
            <line
              key={`v${i}`}
              x1={bx}
              y1={by}
              x2={bx}
              y2={by - NETH}
              stroke={C.gold}
              strokeOpacity={0.55}
              strokeWidth={0.9}
            />
          );
        })}
        {Array.from({ length: NH + 1 }).map((_, j) => {
          const h = (NETH * j) / NH;
          return (
            <line
              key={`h${j}`}
              x1={N0.x}
              y1={N0.y - h}
              x2={N1.x}
              y2={N1.y - h}
              stroke={C.gold}
              strokeOpacity={0.55}
              strokeWidth={0.9}
            />
          );
        })}
        {/* top tape + posts */}
        <line
          x1={N0.x}
          y1={N0.y - NETH}
          x2={N1.x}
          y2={N1.y - NETH}
          stroke={C.gold}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <line x1={N0.x} y1={N0.y} x2={N0.x} y2={N0.y - NETH} stroke={C.line} strokeWidth={5} strokeLinecap="round" />
        <line x1={N1.x} y1={N1.y} x2={N1.x} y2={N1.y - NETH} stroke={C.line} strokeWidth={5} strokeLinecap="round" />
      </g>
    </svg>
  );
}
