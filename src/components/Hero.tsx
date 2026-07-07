"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { hero } from "@/config/siteConfig";
import { ButtonLink } from "./Button";
import { CourtGraphic } from "./CourtGraphic";
import { Shuttlecock } from "./Shuttlecock";
import { PickleballDot } from "./PickleballDot";
import { PawPrint } from "./PawPrint";
import { ApolloMascot } from "./ApolloMascot";

const EASE = [0.22, 1, 0.36, 1] as const;

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const wordGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const ACCENT = new Set(["home"]);

export function Hero() {
  const reduce = useReducedMotion();
  const headlineWords = hero.headline.split(" ");

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-cream pt-28 pb-16 sm:pt-32 md:pt-40 md:pb-24"
    >
      {/* warm atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-12%] h-[44rem] w-[44rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,168,126,0.5) 0%, rgba(244,168,126,0) 62%)",
        }}
      />

      {/* scattered playful motifs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Shuttlecock className="absolute left-[3%] top-[16%] h-11 w-11 rotate-[-18deg] text-gold/80" />
        <PawPrint className="absolute bottom-[10%] left-[4%] h-9 w-9 rotate-12 text-rose" />
        <PickleballDot className="absolute left-[40%] top-[7%] hidden h-8 w-8 text-peach lg:block" />
        <PawPrint className="absolute right-[3%] top-[12%] hidden h-8 w-8 -rotate-12 text-gold/70 lg:block" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* copy column */}
        <motion.div
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
          variants={group}
        >
          <motion.p
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-cream-2 px-4 py-2 text-sm font-semibold text-ink ring-1 ring-plum/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-deep" />
            </span>
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={wordGroup}
            className="font-display text-[2.85rem] font-extrabold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[4.4rem]"
          >
            {headlineWords.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  variants={word}
                  className={
                    ACCENT.has(w.replace(/[.,]/g, ""))
                      ? "marker mr-[0.25em] inline-block"
                      : "mr-[0.25em] inline-block"
                  }
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
          >
            {hero.subhead}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <ButtonLink href={hero.primaryCta.href} variant="accent" size="lg">
              {hero.primaryCta.label}
            </ButtonLink>
            <a
              href={hero.secondaryCta.href}
              className="group inline-flex items-center gap-2 text-[0.95rem] font-semibold text-ink transition-colors hover:text-gold-deep"
            >
              {hero.secondaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>

        {/* court graphic column */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1, ease: EASE, delay: 0.2 }}
          className="relative mx-auto w-full max-w-[280px] [perspective:1400px] sm:max-w-[300px] lg:mx-0 lg:ml-auto lg:max-w-[340px]"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={
              reduce ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }
            }
            className="relative aspect-[220/460] w-full drop-shadow-[0_40px_70px_rgba(56,40,44,0.28)] [transform:rotateY(-13deg)_rotateX(4deg)]"
          >
            <CourtGraphic />
          </motion.div>

          {/* Apollo mascot badge */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={
              reduce ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 14, delay: 1 }
            }
            className="absolute -right-2 top-2 grid h-20 w-20 place-items-center rounded-full border-2 border-plum/10 bg-cream shadow-xl sm:-right-4"
          >
            <ApolloMascot className="h-14 w-14" />
          </motion.div>

          {/* floating credential chip */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: 0.9 }}
            className="absolute -bottom-2 -left-3 rounded-2xl border-2 border-plum/10 bg-cream px-4 py-3 shadow-xl sm:-left-6"
          >
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-gold-deep">
              Now touring spaces
            </p>
            <p className="font-display text-sm font-bold text-ink">
              Great Neck · Nassau County
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
