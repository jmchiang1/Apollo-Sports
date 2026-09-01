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
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { hero } from "@/config/siteConfig";
import heroImage from "../../assets/hero2.png";
import { ButtonLink } from "./Button";
import { CourtPlan, W, L, type Sport } from "./CourtPlan";
import { useSafeReducedMotion } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * THE HERO SWITCH. Two heroes live in this file; this picks one.
 *
 * `true` (current): the pinned 8-court fly-over — the camera rig, the two
 * layouts, the CourtPlan tiles. `false`: a single still image on a parallax
 * drift (see `.hero-media*` in globals.css).
 *
 * NEITHER is ever deleted. The still hero is skipped by a conditional render;
 * the fly-over parks under `.hero-scene-off` (display: none). Both stay
 * typechecked, so this one line is the whole switch — it has been flipped in
 * both directions and verified in a browser each way.
 *
 * What it actually switches, when the fly-over is OFF (the no-track geometry
 * the reduced-motion path has always used, so it is well-trodden):
 *   · the section's scroll track collapses (no 320svh of pinned dead space)
 *   · `.hero-pin` stops being sticky, so it cannot slide over the next section
 *   · the #courts anchor takes the `-top` class, which the header's solidify
 *     check deliberately ignores (see Header.tsx). With the fly-over ON, that
 *     anchor is also what gives the "Courts" nav link its target — the
 *     assembled facility.
 *   · the copy stops fading on scroll — there is no camera move to hand the
 *     frame over to
 */
const HERO_FLYOVER = true;

// ── facility layout ─────────────────────────────────────────────────────
// Eight badminton courts on one even grid — a dedicated all-badminton club —
// with the same gap in both axes so the floor reads as a single regular block.
//
// The grid's SHAPE follows the screen's. Courts are drawn length-vertical (see
// CourtPlan), so a 4×2 block is ~1.14:1 — fine in a landscape frame, but on a
// portrait phone it can only ever fill the width and leaves half the height
// empty. Tiled 2×4 the same eight courts run tall instead, and fill the frame.
const GAP = 22;

type Court = { sport: Sport; x: number; y: number; hero?: boolean };

/**
 * Tiles `cols × rows` courts and picks one as the camera's start — the
 * transform origin the fly-over opens on and pulls back from. Everything
 * downstream (floor size, tile offsets, the camera's end frame) is solved
 * from what this returns, so the two layouts need no special-casing.
 */
function buildLayout(cols: number, rows: number, heroIndex: number) {
  const courts: Court[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      courts.push({ sport: "badminton", x: c * (W + GAP), y: r * (L + GAP) });
    }
  }
  courts[heroIndex].hero = true;
  const heroCourt = courts[heroIndex]; // not `hero` — that's the copy import

  return {
    courts,
    gridW: (cols - 1) * (W + GAP) + W,
    gridH: (rows - 1) * (L + GAP) + L,
    heroCX: heroCourt.x + W / 2,
    heroCY: heroCourt.y + L / 2,
  };
}

// Both start the camera on a court in the lower-middle of the block, so the
// pull-back reveals courts on every side of it.
const LAYOUT_WIDE = buildLayout(4, 2, 5); // desktop — bottom row, 2nd column
const LAYOUT_TALL = buildLayout(2, 4, 4); // mobile — 3rd row, 1st column

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
  // Wide block on a landscape frame, tall block on a portrait one. Server
  // renders the tall layout (vpW is 0); useSyncExternalStore re-renders with
  // the real viewport straight after hydration, and at that point only the
  // hero court is visible anyway — the other seven are still at opacity 0.
  const { courts, gridW, gridH, heroCX, heroCY } = lg
    ? LAYOUT_WIDE
    : LAYOUT_TALL;
  // Mobile opens with a large, low court so it reads as the full-bleed hero
  // element from the Figma mobile design (was 2.2 → 3.1 → 4.3).
  const s0 = vpW === 0 ? 4 : lg ? vpW / 172 : 5.9;
  const tx0 = lg ? vpW / 2 - 29.7 * s0 : 0;
  const ty0 = lg ? vpH / 2 - 17.5 * s0 : vpH * 0.36;
  // End frame: the plan fills the screen between the header and a bottom
  // margin, and centres in what's left. Grid visual height is
  // gridH·s·cos(26°).
  const TOP = lg ? 96 : 84; // clearance under the sticky header
  const BOTTOM = lg ? 64 : 48; // breathing room at the foot of the frame
  const avail = Math.max(160, vpH - TOP - BOTTOM);
  const fitH = avail / (gridH * COS_RX);
  const fitW = (vpW - (lg ? 96 : 24)) / gridW;
  const sEnd = vpH === 0 ? 1.4 : Math.max(0.7, Math.min(fitH, fitW));
  // Vertical placement. The plan's top edge sits `planTop` down the viewport;
  // solving the camera translate for that lands the transform origin (the hero
  // court centre, heroCY plan-units down the grid) in the right place.
  const planH = gridH * sEnd * COS_RX;
  const planTop = TOP + (avail - planH) / 2;
  const tyEnd =
    vpH === 0 ? 200 : planTop + heroCY * COS_RX * sEnd - vpH / 2;
  // Horizontal: centre the whole grid. The hero court (the transform origin)
  // sits gridW/2 − heroCX plan-units left of the grid centre, so translating
  // by (heroCX − gridW/2)·s lands the grid centre on the viewport centre for
  // any hero-court choice or grid width.
  const txEnd = (heroCX - gridW / 2) * sEnd;

  // Both the fly-over and the still hero collapse to the same geometry when
  // there is no camera to drive: no track, no sticky pin, anchor at the top.
  const staticHero = !HERO_FLYOVER || reduce;

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Parallax for the still hero. Runs while the hero scrolls out of frame:
  // 0 with the hero's top at the viewport top, 1 once its bottom reaches it.
  const { scrollYProgress: exitProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  // The image drifts DOWN as the page scrolls UP, so it travels slower than
  // the copy — that difference IS the parallax, so it has to be big enough to
  // read. Expressed in px off the viewport height rather than a percentage of
  // the element, because the element's height differs per breakpoint (see
  // `.hero-media-inner`) and a percentage would silently mean different
  // distances. Each figure stays under that breakpoint's overflow margin
  // (26% < 30% desktop, 12% < 15% mobile), which is what guarantees no edge
  // is ever exposed. vpH is 0 until hydration, which parks the drift at 0.
  const parallaxPx = vpH === 0 ? 0 : (vpW >= 640 ? 0.26 : 0.12) * vpH;
  const mediaY = useTransform(exitProgress, [0, 1], [0, parallaxPx]);
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.4,
  });
  // The pin travels (TRACK − 100svh). The camera completes at CAM_END of that
  // travel; the remainder is a dwell holding the finished facility before the
  // pin releases and the next section (the stats band) scrolls up.
  //
  // Mobile cuts the dwell right down — the stats should arrive as the courts
  // land, not after another half-screen of scrolling past a finished picture —
  // and shortens the track to match, so the fly-over itself still takes about
  // the same amount of scrolling as before (~170svh) rather than stretching.
  const TRACK = lg ? 320 : 280; // svh
  const CAM_END = lg ? 0.78 : 0.94;
  const t = useTransform(p, [0, CAM_END, 1], [0, 1, 1]);

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
      // No camera move means no need for a scroll track — collapse it so there
      // is no dead pinned region. (`.hero-wrap` sets 300svh in CSS for the
      // fly-over; this overrides it.)
      style={staticHero ? { height: "auto" } : { height: `${TRACK}svh` }}
    >
      {/* Two jobs: it is the `#courts` nav target AND the signal Header.tsx
          watches to turn the bar opaque at the fly-over's payoff. Its position
          is solved from the timeline above rather than eyeballed, so it tracks
          whichever TRACK/CAM_END pair is in play:
            scrollY = p · (TRACK − 100svh)          [the pin's travel]
          landing 35% into the dwell puts it past the camera with room to
          spare before the pin releases. Jumping here also looks right:
          scrollYProgress is springed, so the fly-over plays itself in over
          ~half a second rather than snapping.
          The +96px is the `scroll-padding-top: 6rem` the browser subtracts
          when it scrolls a hash target into view.
          Reduce mode and the still hero have no track to land on, so it sits at
          the top of the hero — and takes a DIFFERENT class, because the
          solidify check looks for the fly-over anchor specifically. */}
      {staticHero ? (
        <div id="courts" className="hero-courts-anchor-top" aria-hidden />
      ) : (
        <div
          id="courts"
          className="hero-courts-anchor"
          style={{
            top: `calc(${(
              (CAM_END + (1 - CAM_END) * 0.35) *
              (TRACK - 100)
            ).toFixed(1)}svh + 96px)`,
          }}
          aria-hidden
        />
      )}

      {/* In reduce mode there's no scroll track, so the pin must not stick —
          a sticky element would slide down over the section below. */}
      <div
        className="hero-pin"
        style={staticHero ? { position: "relative" } : undefined}
      >
        {/* ── still hero ──────────────────────────────────────────────── */}
        {!HERO_FLYOVER && (
          <div className="hero-media" aria-hidden={false}>
            <motion.div
              className="hero-media-inner"
              style={reduce ? undefined : { y: mediaY }}
            >
              <Image
                src={heroImage}
                // Describes hero3.png. If the import above is pointed at a
                // different file, this has to change with it.
                alt="A fluted stone column carrying a gold laurel wreath, framed by olive branches."
                fill
                priority
                sizes="100vw"
                placeholder="blur"
                className="hero-media-img"
              />
            </motion.div>
            {/* Darkens the edges the copy sits on. The court itself stays
                readable in between. */}
            <div className="hero-media-scrim" />
          </div>
        )}

        {/* ── 3D camera scene ─────────────────────────────────────────── */}
        <motion.div
          // `.hero-scene-off` is display:none — the whole rig stays mounted and
          // typechecked, ready for HERO_FLYOVER to be flipped back on.
          className={HERO_FLYOVER ? "hero-scene" : "hero-scene hero-scene-off"}
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
              width: gridW * K,
              height: gridH * K,
              marginLeft: -heroCX * K,
              marginTop: -heroCY * K,
              transformOrigin: `${heroCX * K}px ${heroCY * K}px`,
              ...staticFloor,
            }}
          >
            {courts.map((court, i) => (
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
          style={staticHero ? undefined : { opacity: copyOpacity, y: copyY }}
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
          style={staticHero ? undefined : { opacity: copyOpacity }}
        >
          {hero.eyebrow.split("·").pop()?.trim()}
        </motion.div>
      </div>
    </section>
  );
}
