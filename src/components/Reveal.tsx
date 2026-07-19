"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";
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
