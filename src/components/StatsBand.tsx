"use client";

import { motion, useReducedMotion } from "motion/react";
import { stats } from "@/config/siteConfig";
import { containerVariants, Reveal } from "./Reveal";

/** Big-number stat strip: charcoal band with gold figures. */
export function StatsBand() {
  const reduce = useReducedMotion();

  return (
    <section className="stats-section">
      <motion.div
        variants={containerVariants}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="stats-grid"
      >
        {stats.items.map((s) => (
          <Reveal key={s.label}>
            <div className="stats-item">
              <div className="stats-value">{s.value}</div>
              <div className="stats-label">{s.label}</div>
              {"note" in s && s.note && <div className="stats-note">{s.note}</div>}
            </div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}
