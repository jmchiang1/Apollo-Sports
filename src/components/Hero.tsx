"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type Variants,
  type MotionStyle,
} from "motion/react";
import Image from "next/image";
import { hero } from "@/config/siteConfig";
import heroImage from "../../assets/hero2.png";
import { ButtonLink } from "./Button";
import { CourtPlan, W, L, type Sport } from "./CourtPlan";
import { Wordmark } from "./Wordmark";
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
// ONE COURT. It used to be eight, on a grid whose shape followed the screen's
// (4x2 on desktop, 2x4 on a phone), and the fly-over's payoff was pulling back
// to reveal the whole block.
//
// That had to go for two reasons. The court count is not decided, so landing
// on exactly eight was a claim we cannot make. And the bigger one: the reveal
// showed a FINISHED FACILITY, which is the most persuasive thing on the page
// and the likeliest reason visitors thought the club was already open. The
// copy now says "We are building"; the hero has to agree with it.
//
// So the camera no longer reveals a facility. It watches a single court get
// marked out (see CourtPlan's two layers), swinging from an oblique angle to a
// flat architectural plan as the ink goes down. Nothing in here counts.
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

// One court, so it is its own hero and its centre is the transform origin.
// `buildLayout` is kept rather than inlined: it still solves the floor size and
// origin, and restoring a grid later is a one-argument change.
const LAYOUT_ONE = buildLayout(1, 1, 0);

// The end frame is a flat plan. A single court is 92x200 plan units, so it is
// far taller than it is wide — parked upright on a landscape desktop it is a
// narrow strip down the middle of the frame with dead space either side. So on
// desktop the camera finishes at rotateZ(90deg) and the court lies along the
// frame (200x92, about 2.17:1); on a portrait phone it stays upright, where
// that proportion already fits. `END_RX` is shallow on purpose: this is meant
// to read as a drawing, and the flatter it lands the more it does.
const END_RX = 14;
const COS_RX_END = Math.cos((END_RX * Math.PI) / 180);

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
  const { courts, gridW, gridH, heroCX, heroCY } = LAYOUT_ONE;
  // Desktop lays the court along the frame, a phone keeps it upright.
  const endRz = lg ? 90 : 0;
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
  // The court's END footprint, which is the plan SWAPPED on desktop because it
  // finishes at rotateZ(90°). Fitting the unrotated 92×200 there would size it
  // for a strip that never appears.
  const endW = lg ? gridH : gridW;
  const endH = lg ? gridW : gridH;
  const fitH = avail / (endH * COS_RX_END);
  const fitW = (vpW - (lg ? 160 : 40)) / endW;
  const sEnd = vpH === 0 ? 1.4 : Math.max(0.7, Math.min(fitH, fitW));
  // With a single court the transform origin IS the court's centre and the
  // grid's, so centring is just "put the origin in the middle of the space
  // under the header" — no hero-court offset to solve. The floor is anchored
  // at the viewport centre, hence the − vpH / 2.
  const planH = endH * sEnd * COS_RX_END;
  const planTop = TOP + (avail - planH) / 2;
  const tyEnd = vpH === 0 ? 200 : planTop + planH / 2 - vpH / 2;
  const txEnd = 0;

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

  // Camera: oblique court in the lower-right → swings flat and square on, and
  // lands as an architectural plan. Most of the move is now ROTATION rather
  // than scale — with one court there is no block to pull back from, and the
  // turn from an oblique view to a flat plan is what sells "drawing".
  const sMid = s0 + (sEnd - s0) * 0.55;
  const rx = useTransform(t, [0, 0.5, 1], [54, 32, END_RX]);
  const rz = useTransform(
    t,
    [0, 0.5, 1],
    lg ? [45, 68, endRz] : [45, 22, endRz],
  );
  const s = useTransform(t, [0, 0.5, 1], [s0 / K, sMid / K, sEnd / K]);
  const tx = useTransform(t, [0, 0.5, 1], [tx0, 0, txEnd]);
  const ty = useTransform(t, [0, 0.5, 1], [ty0, 0, tyEnd]);
  const floorTransform = useMotionTemplate`translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${s})`;

  // The ink. Starts just after the copy has begun clearing, and finishes at
  // 0.9 so the finished court holds for a beat before the pin releases rather
  // than the last line landing on the handover.
  const draw = useTransform(t, [0.05, 0.9], [0, 1]);

  // Copy fades out early so the camera move owns the frame.
  const copyOpacity = useTransform(t, [0, 0.26], [1, 0]);
  const copyY = useTransform(t, [0, 0.26], [0, -64]);
  // Standing net recedes as the camera flattens — a net seen from overhead is
  // just its line, which the ink draws last anyway.
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

        {/* Motion serialises `--draw`'s initial 0 into the SSR markup, which is
            right for a normal load (the client picks up from exactly there,
            with no flash) and wrong with scripting off, where nothing ever
            advances it and the court renders as ghost markings with no ink.
            `!important` is needed because it is beating an inline style, and
            <noscript> means it only ever applies when there is no JS to do
            the drawing. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: ".hero-floor{--draw:1 !important}",
            }}
          />
        </noscript>

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
            style={
              {
                width: gridW * K,
                height: gridH * K,
                marginLeft: -heroCX * K,
                marginTop: -heroCY * K,
                transformOrigin: `${heroCX * K}px ${heroCY * K}px`,
                // Inherited by the court's ink strokes. Set EXPLICITLY to 1
                // under reduced motion rather than omitted: Motion serialises
                // this MotionValue's initial 0 into the SSR markup, so leaving
                // it out does not fall back to the registered `initial-value`,
                // it keeps the 0 already in the HTML and the court stays a
                // ghost. Measured.
                "--draw": reduce ? 1 : draw,
                ...staticFloor,
                // `MotionStyle` does not model CSS custom properties, so the
                // `--draw` entry above has to go through `unknown`. Motion
                // itself handles them fine at runtime.
              } as unknown as MotionStyle
            }
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
        {/* The brand mark, at the top of the page and OUTSIDE `.hero-copy-wrap`.
            It used to sit at the head of the centred stack, which meant it
            inherited `copyOpacity` and was at 0 by roughly 0.6vh of scroll —
            so the whole pinned fly-over, about three screens of it, played with
            no brand anywhere on screen, and nothing appeared again until the
            footer. Measured. Out here it holds for the entire pin and then
            scrolls away with it.

            Keeps the `.hero-wordmark` class: PageLoader flies its opening mark
            to `.hero-wordmark .wordmark-logo`, and the `logo-land` hand-off in
            globals.css is scoped to the same selector. Both follow this
            element wherever it goes.

            Its own entrance rather than `variants={fadeUp}` — it is no longer a
            child of the copy's stagger container, so a variant here would never
            be triggered. */}
        <motion.div
          className="hero-wordmark"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          <Wordmark />
        </motion.div>

        {/* Ground for the type. The copy column is centred and the court fills
            the frame from about 63% of the width rightward, so the two overlap
            in the middle-right at every desktop size — measured 83px at 1512
            and 113px at 1280, putting the net's black post hard against the
            end of "Badminton". No shift of the camera fixes that at all widths
            (the overlap grows as the viewport narrows), so the type gets its
            own ground instead.

            Fades with `copyOpacity`, not held: once the copy clears, the camera
            owns the frame and a scrim still sitting there would just be dimming
            the court for no reason. */}
        <motion.div
          className="hero-copy-scrim"
          aria-hidden
          style={staticHero ? undefined : { opacity: copyOpacity }}
        />

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
          </motion.div>
        </motion.div>

        {/* The one action on the page, along the bottom of the viewport rather
            than inside the centred stack. It replaced the "Opening Fall 2027"
            line that used to sit here.

            NOT inside `.hero-copy`, and NOT tied to `copyOpacity`: the copy
            clears early so the camera owns the frame, and the only way to act
            on this page must not clear with it. It sits inside `.hero-pin`, so
            it holds for the whole pinned hero and then scrolls away with it. */}
        <div className="hero-cta-bottom">
          <ButtonLink href={hero.primaryCta.href} variant="accent" size="lg">
            {hero.primaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
