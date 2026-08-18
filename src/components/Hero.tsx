"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type Variants,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { hero } from "@/config/siteConfig";
import { ButtonLink } from "./Button";
import { CourtPlan, W, L, type Sport } from "./CourtPlan";
import { useSafeReducedMotion } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── facility layout ─────────────────────────────────────────────────────
// Courts are drawn length-vertical (see CourtPlan). Eight badminton courts on
// one even 4×2 grid — a dedicated all-badminton club — with the same gap in
// both axes so the floor reads as a single regular block.
const GAP = 22;
const COL = [0, W + GAP, 2 * (W + GAP), 3 * (W + GAP)]; // x of each column (4)
const ROW = [0, L + GAP]; // y of each row (2)
const GRID_W = COL[3] + W;
const GRID_H = ROW[1] + L;

type Court = { sport: Sport; x: number; y: number; hero?: boolean };

const COURTS: Court[] = [
  { sport: "badminton", x: COL[0], y: ROW[0] },
  { sport: "badminton", x: COL[1], y: ROW[0] },
  { sport: "badminton", x: COL[2], y: ROW[0] },
  { sport: "badminton", x: COL[3], y: ROW[0] },
  { sport: "badminton", x: COL[0], y: ROW[1] },
  { sport: "badminton", x: COL[1], y: ROW[1], hero: true }, // camera starts here
  { sport: "badminton", x: COL[2], y: ROW[1] },
  { sport: "badminton", x: COL[3], y: ROW[1] },
];

const heroCourt = COURTS.find((c) => c.hero)!;
const HERO_CX = heroCourt.x + W / 2;
const HERO_CY = heroCourt.y + L / 2;

// Standing net, in plan px. Real badminton proportions: posts ~5ft tall with
// the ~2.5ft-deep mesh hanging from the top — clear air beneath it.
const POST_H = 22; // post height (plane height)
const MESH_H = 10; // mesh depth, hanging from the tape

// Tiles are LAID OUT at K× plan size and the camera scale is divided by K.
// Geometry is identical, but the browser rasterizes composited 3D layers at
// layout size — at K=1 the opening frame stretched a 92px-wide texture ~7×,
// which is what made the court look blurry/glowy ("3D") instead of flat art.
const K = 6;

// ── viewport stores (useSyncExternalStore helpers) ──────────────────────
const resizeSubscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const readW = () => window.innerWidth;
const readH = () => window.innerHeight;
const readZero = () => 0;

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Accents `hero.headlineHighlight` within a line, if it appears there. */
function headlineLine(line: string) {
  const i = line.indexOf(hero.headlineHighlight);
  if (i === -1) return line;
  return (
    <>
      {line.slice(0, i)}
      <span className="hero-headline-accent">{hero.headlineHighlight}</span>
      {line.slice(i + hero.headlineHighlight.length)}
    </>
  );
}

/** Vertical squash from the end frame's rotateX(26°). */
const COS_RX = Math.cos((26 * Math.PI) / 180);

export function Hero() {
  // The reduced-motion branch renders a different tree (a single static frame,
  // no camera) — useSafeReducedMotion keeps SSR and hydration consistent.
  const reduce = useSafeReducedMotion();

  const wrapRef = useRef<HTMLDivElement>(null);

  // Camera keyframes depend on the viewport: the opening frame parks the hero
  // court oversized in the bottom-right (as the original static hero did).
  // Server snapshot is 0×0; React re-renders with the real size on hydration.
  // Projection matches the original IsoCourt art's dimetric ±30.5° axes:
  // rotateZ(45°)·rotateX(54°) — width axis (net) slopes down-right, length
  // axis runs lower-left → upper-right. The translate is SOLVED so the net's
  // base-right end lands exactly on the viewport's bottom-right corner (as in
  // the old art): that endpoint sits (29.7·s, 17.5·s)px from the court centre
  // (42 plan-units along the width axis, whose screen vector is
  // (cos45, sin45·cos54)·s), and the centre itself sits at
  // viewport-centre + (tx0, ty0).
  const vpW = useSyncExternalStore(resizeSubscribe, readW, readZero);
  const vpH = useSyncExternalStore(resizeSubscribe, readH, readZero);
  const lg = vpW >= 1024;
  // Mobile opens with a large, low court so it reads as the full-bleed hero
  // element from the Figma mobile design (was 2.2 → 3.1 → 4.3).
  const s0 = vpW === 0 ? 4 : lg ? vpW / 172 : 5.9;
  const tx0 = lg ? vpW / 2 - 29.7 * s0 : 0;
  const ty0 = lg ? vpH / 2 - 17.5 * s0 : vpH * 0.36;
  // End frame: the plan fills the screen between the header and a bottom
  // margin, and centres in what's left. Grid visual height is
  // GRID_H·s·cos(26°).
  const TOP = lg ? 96 : 84; // clearance under the sticky header
  const BOTTOM = lg ? 64 : 48; // breathing room at the foot of the frame
  const avail = Math.max(160, vpH - TOP - BOTTOM);
  const fitH = avail / (GRID_H * COS_RX);
  const fitW = (vpW - (lg ? 96 : 24)) / GRID_W;
  const sEnd = vpH === 0 ? 1.4 : Math.max(0.7, Math.min(fitH, fitW));
  // Vertical placement. The plan's top edge sits `planTop` down the viewport;
  // solving the camera translate for that lands the transform origin (the hero
  // court centre, HERO_CY plan-units down the grid) in the right place.
  const planH = GRID_H * sEnd * COS_RX;
  const planTop = TOP + (avail - planH) / 2;
  const tyEnd =
    vpH === 0 ? 200 : planTop + HERO_CY * COS_RX * sEnd - vpH / 2;
  // Horizontal: centre the whole grid. The hero court (the transform origin)
  // sits GRID_W/2 − HERO_CX plan-units left of the grid centre, so translating
  // by (HERO_CX − GRID_W/2)·s lands the grid centre on the viewport centre for
  // any hero-court choice or grid width.
  const txEnd = (HERO_CX - GRID_W / 2) * sEnd;

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.4,
  });
  // The camera completes in the first 78% of the (320svh) track; the rest is
  // a dwell that holds the finished facility on screen before the page moves.
  const t = useTransform(p, [0, 0.78, 1], [0, 1, 1]);

  // Camera: angled hero court bottom-right → flattens overhead, centered →
  // pulls back to the facility.
  const rx = useTransform(t, [0, 0.5, 1], [54, 18, 26]);
  const rz = useTransform(t, [0, 0.5, 1], [45, 12, 0]);
  const s = useTransform(t, [0, 0.5, 1], [s0 / K, 2.7 / K, sEnd / K]);
  const tx = useTransform(t, [0, 0.5, 1], [tx0, 0, txEnd]);
  const ty = useTransform(t, [0, 0.5, 1], [ty0, 0, tyEnd]);
  const floorTransform = useMotionTemplate`translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${s})`;

  // Copy fades out early so the camera move owns the frame.
  const copyOpacity = useTransform(t, [0, 0.26], [1, 0]);
  const copyY = useTransform(t, [0, 0.26], [0, -64]);
  // The five surrounding courts fade in as we pull back.
  const othersOpacity = useTransform(t, [0.22, 0.52], [0, 1]);
  // Standing net recedes as we go overhead, fully gone by the reveal.
  const netOpacity = useTransform(t, [0.34, 0.7], [1, 0]);

  const staticFloor = reduce
    ? {
        transform: `translate3d(${tx0}px, ${ty0}px, 0) rotateX(54deg) rotateZ(45deg) scale(${s0 / K})`,
      }
    : { transform: floorTransform };

  return (
    <section
      id="top"
      ref={wrapRef}
      className="hero-wrap"
      // reduced-motion users get no camera move — collapse the scroll track so
      // there's no dead pinned region. 320svh: camera uses ~78%, the rest
      // dwells on the finished facility.
      style={reduce ? { height: "auto" } : { height: "320svh" }}
    >
      {/* nav anchor: lands mid-pin, right at the facility reveal. The offset
          is a point on the camera timeline (progress ≈ top/160svh), so it
          lives here beside the keyframes rather than in the stylesheet. In
          reduce mode there's no track to land on, so it sits at the top. */}
      <div
        id="sports"
        className="hero-sports-anchor"
        style={reduce ? undefined : { top: "175svh" }}
        aria-hidden
      />

      {/* In reduce mode there's no scroll track, so the pin must not stick —
          a sticky element would slide down over the section below. */}
      <div
        className="hero-pin"
        style={reduce ? { position: "relative" } : undefined}
      >
        {/* ── 3D camera scene ─────────────────────────────────────────── */}
        <motion.div
          className="hero-scene"
          aria-hidden
          // Near-parallel projection: the original IsoCourt art had no
          // perspective — a long focal length keeps lines from diverging
          // and the court from ballooning toward the viewer. (Inline so it
          // wins over the stylesheet's perspective.)
          style={{ perspective: "9000px" }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          <motion.div
            className="hero-floor"
            style={{
              width: GRID_W * K,
              height: GRID_H * K,
              marginLeft: -HERO_CX * K,
              marginTop: -HERO_CY * K,
              transformOrigin: `${HERO_CX * K}px ${HERO_CY * K}px`,
              ...staticFloor,
            }}
          >
            {COURTS.map((court, i) => (
              <motion.div
                key={i}
                className="hero-court-tile"
                style={{
                  left: court.x * K,
                  top: court.y * K,
                  width: W * K,
                  height: L * K,
                  opacity: court.hero ? 1 : reduce ? 0 : othersOpacity,
                }}
              >
                <CourtPlan sport={court.sport} />
                {court.hero && (
                  <motion.div
                    className="hero-net"
                    // Posts stand full height; the mesh hangs from the top
                    // tape and stops well clear of the floor, like a real
                    // badminton net. Inline (K-scaled px) so the pattern
                    // stays crisp at layout resolution; background cleared
                    // so the stylesheet's floor-to-tape mesh doesn't show.
                    style={{
                      height: POST_H * K,
                      top: (L / 2 - POST_H) * K,
                      opacity: reduce ? 0.7 : netOpacity,
                      backgroundColor: "transparent",
                      backgroundImage: "none",
                    }}
                  >
                    {/* hanging mesh */}
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        height: MESH_H * K,
                        backgroundColor: "rgba(0,0,0,0.16)",
                        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0 ${0.3 * K}px, transparent ${0.3 * K}px ${2.4 * K}px), repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0 ${0.3 * K}px, transparent ${0.3 * K}px ${2.4 * K}px)`,
                      }}
                    />
                    <span
                      className="hero-net-tape"
                      style={{ height: 0.9 * K }}
                    />
                    {/* posts */}
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 1.3 * K,
                        background: "#000",
                      }}
                    />
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 1.3 * K,
                        background: "#000",
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── copy overlay ────────────────────────────────────────────── */}
        <motion.div
          className="hero-copy-wrap"
          style={reduce ? undefined : { opacity: copyOpacity, y: copyY }}
        >
          <motion.div
            initial={reduce ? "visible" : "hidden"}
            animate="visible"
            variants={group}
            className="hero-copy"
          >
            <motion.p variants={fadeUp} className="hero-eyebrow">
              {hero.eyebrow}
            </motion.p>
            <motion.h1 variants={fadeUp} className="hero-headline">
              {hero.headlineLines.map((line) => (
                <span key={line} className="hero-headline-line">
                  {headlineLine(line)}
                </span>
              ))}
            </motion.h1>
            <motion.p variants={fadeUp} className="hero-subhead">
              {hero.subhead}
            </motion.p>
            <motion.div variants={fadeUp} className="hero-actions">
              <ButtonLink
                href={hero.primaryCta.href}
                variant="accent"
                size="lg"
                // Full-bleed on mobile (matches the Figma mobile hero); reverts
                // to its natural width once the row goes horizontal at sm.
                className="w-full sm:w-auto"
              >
                {hero.primaryCta.label}
              </ButtonLink>
              <a href={hero.secondaryCta.href} className="group hero-secondary">
                {hero.secondaryCta.label}
                <ArrowRight className="hero-secondary-icon" />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mobile-only status pill — sits bottom-centre over the court, matching
            the Figma mobile hero. Shortened to just the opening line, on a
            translucent-black chip. Fades out with the copy as the fly-over
            begins (desktop keeps the full eyebrow at the top instead). */}
        <motion.div
          className="hero-eyebrow-bottom"
          style={reduce ? undefined : { opacity: copyOpacity }}
        >
          {hero.eyebrow.split("·").pop()?.trim()}
        </motion.div>
      </div>
    </section>
  );
}
