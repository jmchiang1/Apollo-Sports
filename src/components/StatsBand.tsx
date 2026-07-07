"use client";

import { motion, useReducedMotion } from "motion/react";
import { stats } from "@/config/siteConfig";
import { containerVariants, Reveal } from "./Reveal";

/** Bold big-number stat strip on a gold band. */
export function StatsBand() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-gold text-plum">
      <motion.div
        variants={containerVariants}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-10 px-6 py-12 sm:grid-cols-4 sm:px-8 sm:py-14"
      >
        {stats.items.map((s) => (
          <Reveal key={s.label}>
            <div className="border-l-[3px] border-plum/25 pl-4">
              <div className="font-display text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm font-extrabold uppercase tracking-wide">
                {s.label}
              </div>
              {"note" in s && s.note && (
                <div className="text-xs font-semibold text-plum/60">{s.note}</div>
              )}
            </div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}
