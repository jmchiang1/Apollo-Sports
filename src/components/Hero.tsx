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

  return (
    <section
      id="top"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-cream pt-28 pb-16 sm:pt-28"
    >
      {/* warm peach glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-12%] h-[44rem] w-[44rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(224,166,58,0.26) 0%, rgba(224,166,58,0) 62%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-6">
        {/* copy */}
        <motion.div
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
          variants={group}
          className="max-w-xl"
        >
          <motion.p
            variants={fadeUp}
            className="mb-6 inline-flex items-center rounded-full bg-cream-2 px-4 py-2 text-sm font-semibold text-ink ring-1 ring-plum/10"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[2.85rem] font-extrabold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[4.4rem]"
          >
            {hero.headline}
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

        {/* court illustration — alternates between pickleball & badminton */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1, ease: EASE, delay: 0.2 }}
          className="relative"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={
              reduce ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }
            }
            className="relative mx-auto aspect-[701/447] w-full max-w-[520px] drop-shadow-[0_30px_50px_rgba(38,34,30,0.14)] lg:mx-0 lg:ml-auto lg:max-w-[640px]"
          >
            {COURTS.map((sport, i) => (
              <motion.div
                key={sport}
                aria-hidden={active !== i}
                className="absolute inset-0"
                animate={{ opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <IsoCourt sport={sport} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
