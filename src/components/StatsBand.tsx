"use client";

import { motion, useReducedMotion } from "motion/react";
import { stats } from "@/config/siteConfig";
import { containerVariants, Reveal } from "./Reveal";

/** Big-number stat strip: charcoal band with gold figures. */
export function StatsBand() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-plum text-cream">
      <motion.div
        variants={containerVariants}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-10 px-6 py-12 sm:grid-cols-4 sm:px-8 sm:py-14"
      >
        {stats.items.map((s) => (
          <Reveal key={s.label}>
            <div className="border-l-[3px] border-gold/40 pl-4">
              <div className="font-display text-5xl font-extrabold leading-none tracking-tight text-gold sm:text-6xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm font-extrabold uppercase tracking-wide text-cream">
                {s.label}
              </div>
              {"note" in s && s.note && (
                <div className="text-xs font-semibold text-cream/50">{s.note}</div>
              )}
            </div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}
