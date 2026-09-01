"use client";

import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import {
  useRef,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * `useReducedMotion` knows the real preference on the first client render, but
 * the server rendered with `false` — anything that branches render output on it
 * must gate behind hydration or React reports a mismatch. Shared by every
 * scroll-reveal surface (SectionWrapper, StatsBand, Hero).
 */
const emptySubscribe = () => () => {};
export function useSafeReducedMotion() {
  const prefers = useReducedMotion();
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  return hydrated && !!prefers;
}

/**
 * Scroll-reveal system.
 *
 * `SectionWrapper` is a section shell: consistent vertical rhythm, a centered
 * max-width container, and a motion parent that triggers once on scroll and
 * staggers its `Reveal` children. `Reveal` is a motion child that inherits the
 * parent's variant state — so children fade up in sequence with no manual
 * delays. Both respect prefers-reduced-motion.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE },
  },
};

type SectionWrapperProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  /** Set false to opt out of the centered max-width container (full-bleed). */
  contained?: boolean;
};

export function SectionWrapper({
  id,
  className,
  containerClassName,
  children,
  contained = true,
}: SectionWrapperProps) {
  const reduce = useSafeReducedMotion();

  return (
    <section id={id} className={cn("section", className)}>
      <motion.div
        variants={containerVariants}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        className={cn(contained && "section-inner", containerClassName)}
      >
        {children}
      </motion.div>
    </section>
  );
}

/**
 * A nested reveal orchestrator — same trigger as SectionWrapper, but usable
 * *inside* a section to give a sub-group its own stagger. Needed because Motion
 * only reliably staggers a `Reveal`'s nearest orchestrating ancestor; grouping
 * cards under extra wrappers (e.g. the pricing groups) otherwise leaves them
 * stuck hidden for non-reduced-motion visitors.
 */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useSafeReducedMotion();
  return (
    <motion.div
      variants={containerVariants}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-90px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * A per-element scroll reveal that plays as a single move, in or out.
 *
 * Each item watches its OWN position, so in a group taller than the viewport
 * (e.g. the Programs rows) they arrive top to bottom as the user scrolls,
 * instead of a section-level trigger firing rows that are still below the fold.
 * `once` is off, so scrolling back up plays the move in reverse.
 *
 * Opacity is a hard on/off switch rather than a scrubbed fade: it exists only
 * so a row isn't sitting visibly out of position before its turn. The visible
 * animation is the slide.
 *
 * It deliberately takes NO `variants` prop — that is what stops an ancestor
 * orchestrator from propagating "visible" and animating it independently.
 */
export function RevealOnScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useSafeReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      // fires once a third of the row has come onto the screen
      viewport={{ amount: 0.35 }}
      transition={{
        y: { duration: 0.55, ease: EASE },
        opacity: { duration: 0.12, ease: "linear" },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Inscriptional heading. Renders a real <h2> that is VISIBLE by default, and
 * adds `.is-cut` shortly before it scrolls into view to start the left-to-right
 * wipe (see `.heading-cut` in globals.css).
 *
 * WHY NOT A MOTION VARIANT: Motion writes its `initial` straight into the SSR
 * HTML. The page already ships 52 inline `opacity: 0` and renders blank without
 * JS; using `Reveal`/`RevealOnScroll` here would have added eight more, on the
 * headings — the worst possible elements to lose. Here JS only ever ADDS the
 * animation, so a heading whose script never runs is simply present.
 *
 * WHY NOT `animation-timeline: view()`: that resolves against the nearest
 * SCROLL CONTAINER, and these sections carry `overflow: hidden` to clip their
 * motifs. Measured it — the timeline's source came back as the section itself,
 * which never scrolls, so progress sat pinned at 1 and every heading rendered
 * fully revealed at all scroll positions.
 *
 * The 20% bottom margin fires the class while the heading is still below the
 * fold, so the wipe plays into view rather than snapping over a heading the
 * reader can already see.
 */
/**
 * Renders a `<section>` and adds `flag` to it once it scrolls into view. That
 * is all it does — the animation itself, and any staggering between children,
 * lives in CSS under that class.
 *
 * WHY A CLASS AND NOT MOTION VARIANTS: the same reason as `HeadingCut` below.
 * A variant bakes its `initial` into the SSR HTML as an inline `opacity: 0`,
 * and this page already renders blank without JS — animating a section this way
 * would add one hide per child. Because the keyframes only exist under the flag
 * class, an element that never receives it is simply visible, so this costs
 * nothing in the no-JS render. One ref can then drive any number of staggered
 * children, which Motion would need a wrapper per child to do.
 *
 * The generous default `margin` matters: the flag has to land while the section
 * is still below the fold, because `backwards` fill snaps the children to their
 * hidden state the instant the class arrives. Fire it on something already on
 * screen and you get a visible revealed -> hidden -> replay flicker.
 */
export function CarveIn({
  className,
  flag = "is-carved",
  children,
  ...rest
}: {
  className?: string;
  flag?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "className" | "children">) {
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px 25% 0px" });

  return (
    <section
      ref={ref}
      className={cn(className, !reduce && inView && flag)}
      {...rest}
    >
      {children}
    </section>
  );
}

export function HeadingCut({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  // 30%, up from 20%: the wipe now runs 2s, so it needs a longer run-up to do
  // most of its work before the heading is actually on screen.
  const inView = useInView(ref, { once: true, margin: "0px 0px 30% 0px" });

  return (
    <h2
      ref={ref}
      className={cn("heading-cut", className, !reduce && inView && "is-cut")}
    >
      {children}
    </h2>
  );
}

const MOTION_TAGS = {
  div: motion.div,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  span: motion.span,
  ul: motion.ul,
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Semantic element to render (default div). */
  as?: keyof typeof MOTION_TAGS;
};

export function Reveal({ children, className, as = "div" }: RevealProps) {
  const MotionTag = MOTION_TAGS[as];
  return (
    <MotionTag variants={itemVariants} className={className}>
      {children}
    </MotionTag>
  );
}
