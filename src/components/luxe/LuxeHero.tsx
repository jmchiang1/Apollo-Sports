"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { hero } from "@/config/siteConfig";
import { LuxeButtonLink } from "./LuxeButton";
import { ApolloMark } from "./ApolloMark";

const EASE = [0.22, 1, 0.36, 1] as const;

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export function LuxeHero() {
  const reduce = useReducedMotion();
  // Italicize one elegant word in the shared headline, if present.
  const accent = "Premier";
  const hasAccent = hero.headline.includes(accent);
  const [pre, post] = hasAccent ? hero.headline.split(accent) : [hero.headline, ""];

  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-forest text-butter"
    >
      {/* mark watermark */}
      <ApolloMark
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 text-butter/[0.04]"
      />
      {/* thin inset frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 border border-butter/12 sm:inset-6"
      />

      <motion.div
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        variants={group}
        className="relative mx-auto w-full max-w-3xl px-8 py-32 text-center"
      >
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-5">
          <span className="luxe-eyebrow text-brass-light">{hero.eyebrow}</span>
          <span className="h-px w-14 bg-brass-light/50" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-8 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-butter sm:text-6xl lg:text-[4.75rem]"
        >
          {pre}
          {hasAccent && <em className="italic text-brass-light">{accent}</em>}
          {post}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-8 max-w-xl font-luxe text-base font-light leading-relaxed text-butter/70 sm:text-lg"
        >
          {hero.subhead}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <LuxeButtonLink href={hero.primaryCta.href} variant="brass" size="lg">
            {hero.primaryCta.label}
          </LuxeButtonLink>
          <a
            href={hero.secondaryCta.href}
            className="group inline-flex items-center gap-2 font-luxe text-[0.78rem] font-medium uppercase tracking-[0.2em] text-butter/80 transition-colors hover:text-butter"
          >
            {hero.secondaryCta.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
