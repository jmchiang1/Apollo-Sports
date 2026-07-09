"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { hero } from "@/config/siteConfig";
import { ButtonLink } from "./Button";
import { IsoCourt } from "./IsoCourt";

const COURTS = ["pickleball", "badminton"] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a === 0 ? 1 : 0)), 4200);
    return () => clearInterval(id);
  }, [reduce]);

  const hi = hero.headline.indexOf(hero.headlineHighlight);

  return (
    <section id="top" className="hero-section">
      {/* cooler indigo-violet wash, lower-left, for atmospheric depth */}
      <div
        aria-hidden
        className="hero-glow-2"
        style={{
          background:
            "radial-gradient(circle, rgba(120,110,205,0.34) 0%, rgba(120,110,205,0) 60%)",
        }}
      />

      <div className="hero-grid">
        {/* copy */}
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
            {hi === -1 ? (
              hero.headline
            ) : (
              <>
                {hero.headline.slice(0, hi)}
                <span className="hero-headline-accent">
                  {hero.headlineHighlight}
                </span>
                {hero.headline.slice(hi + hero.headlineHighlight.length)}
              </>
            )}
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

        {/* court illustration — alternates between pickleball & badminton */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1, ease: EASE, delay: 0.2 }}
          className="hero-court"
        >
          <div className="hero-court-stage">
            {/* teal spotlight — centered on the court, sits still while it bobs */}
            <div
              aria-hidden
              className="hero-court-glow"
              style={{
                background:
                  "radial-gradient(circle, rgba(95,197,179,0.45) 0%, rgba(95,197,179,0) 62%)",
              }}
            />
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={
                reduce ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }
              }
              className="hero-court-float"
            >
              {COURTS.map((sport, i) => (
                <motion.div
                  key={sport}
                  aria-hidden={active !== i}
                  className="hero-court-layer"
                  animate={{ opacity: active === i ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <IsoCourt sport={sport} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
