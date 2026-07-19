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
import { ArrowRight, Check } from "lucide-react";
import { hero, sports } from "@/config/siteConfig";
import { ButtonLink } from "./Button";
import { CourtPlan, W, L, type Sport } from "./CourtPlan";
import { useSafeReducedMotion } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── facility layout ─────────────────────────────────────────────────────
// Courts are drawn length-vertical (see CourtPlan). Six courts on one even
// 3×2 grid — four badminton, then the pickleball column — with the same gap
// in both axes so the floor reads as a single regular block.
const GAP = 22;
const COL = [0, W + GAP, 2 * (W + GAP)]; // x of each column
const ROW = [0, L + GAP]; // y of each row
const GRID_W = COL[2] + W;
const GRID_H = ROW[1] + L;

type Court = { sport: Sport; x: number; y: number; hero?: boolean };

const COURTS: Court[] = [
  { sport: "badminton", x: COL[0], y: ROW[0] },
  { sport: "badminton", x: COL[1], y: ROW[0] },
  { sport: "badminton", x: COL[0], y: ROW[1] },
  { sport: "badminton", x: COL[1], y: ROW[1], hero: true }, // camera starts here
  { sport: "pickleball", x: COL[2], y: ROW[0] },
  { sport: "pickleball", x: COL[2], y: ROW[1] },
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

/** Sports copy (formerly SportsSection) — shown as the fly-over's final beat. */
function SportsCards() {
  return (
    <>
      {sports.cards.map((card) => (
        <div key={card.name} className="hero-sports-card">
          <p className="hero-sports-card-courts">{card.courts} courts</p>
          <h3 className="hero-sports-card-name">{card.name}</h3>
          <p className="hero-sports-card-body">{card.body}</p>
          <ul className="hero-sports-features">
            {card.features.map((f) => (
              <li key={f} className="hero-sports-feature">
                <Check className="hero-sports-feature-icon" strokeWidth={3} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function SportsHead() {
  return (
    <div className="hero-sports-head">
      {/* <p className="hero-facility-overline">Under one roof</p> */}
      <h2 className="hero-sports-heading">{sports.heading}</h2>
    </div>
  );
}

export function Hero() {
  // The reduced-motion branch renders a different tree (static hero + plain
  // sports block) — useSafeReducedMotion keeps SSR and hydration consistent.
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
  const s0 = vpW === 0 ? 4 : lg ? vpW / 172 : 2.2;
  const tx0 = lg ? vpW / 2 - 29.7 * s0 : 0;
  const ty0 = lg ? vpH / 2 - 17.5 * s0 : vpH * 0.3;
  // End frame: size the facility to FILL the frame — as large as fits between
  // the heading (top ≈ 190px) and a real bottom margin (~6vh), never bleeding
  // off the fold. Grid visual height ≈ GRID_H·s·cos(26°) ≈ 380·s; on phones
  // the width (344·s) is the binding constraint instead.
  const fitH = (0.94 * vpH - 210) / 380;
  const fitW = (vpW - 24) / 344;
  const sEnd =
    vpH === 0 ? 1.6 : lg ? Math.max(1.2, fitH) : Math.max(0.9, Math.min(fitW, fitH));
  // Place the grid's centre so its top row sits just below the heading
  // (transform-origin is the hero court, 100·s above the grid centre).
  const tyEnd = vpH === 0 ? 200 : (lg ? 190 : 170) + 290 * sEnd - vpH / 2;
  const txEnd = -12 * sEnd; // centres the grid (hero court is 12 left of centre)

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
  // Sports copy lands as the facility assembles.
  const sportsOpacity = useTransform(t, [0.76, 0.94], [0, 1]);
  const sportsY = useTransform(t, [0.76, 0.94], [28, 0]);

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
      // there's no dead pinned region (the sports copy renders statically below).
      // 320svh: camera uses ~78%, the rest dwells on the finished facility.
      style={reduce ? { height: "auto" } : { height: "320svh" }}
    >
      {/* nav anchor: lands mid-pin, right at the facility reveal. The offset
          is a point on the camera timeline (progress ≈ top/160svh), so it
          lives here beside the keyframes rather than in the stylesheet. */}
      {!reduce && (
        <div
          id="sports"
          className="hero-sports-anchor"
          style={{ top: "175svh" }}
          aria-hidden
        />
      )}

      {/* In reduce mode there's no scroll track, so the pin must not stick —
          a sticky element would slide down over the static sports block. */}
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
              <ButtonLink href={hero.primaryCta.href} variant="accent" size="lg">
                {hero.primaryCta.label}
              </ButtonLink>
              <a href={hero.secondaryCta.href} className="group hero-secondary">
                {hero.secondaryCta.label}
                <ArrowRight className="hero-secondary-icon" />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── sports copy — the fly-over's payoff (was SportsSection) ─── */}
        {!reduce && (
          <motion.div
            className="hero-sports-overlay"
            style={{ opacity: sportsOpacity, y: sportsY }}
          >
            <SportsHead />
            <div className="hero-sports-cards">
              <SportsCards />
            </div>
          </motion.div>
        )}

      </div>

      {/* Reduced motion: the sports copy still needs a home — render it as a
          plain static block below the (single-frame) hero. */}
      {reduce && (
        <div id="sports" className="hero-sports-static">
          <SportsHead />
          <div className="hero-sports-static-cards">
            <SportsCards />
          </div>
        </div>
      )}
    </section>
  );
}
