"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { stats } from "@/config/siteConfig";
import { containerVariants, Reveal, useSafeReducedMotion } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Counts the numeric part of a stat up from 0 when it scrolls into view,
 * preserving any prefix/suffix ("~6" → ~0…~6, "'26" → '0…'26). Values with
 * no digits (and reduced-motion users) render as plain text.
 */
function StatValue({ value }: { value: string }) {
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const target = match ? parseInt(match[2], 10) : 0;

  const mv = useMotionValue(0);
  const text = useTransform(mv, (v: number): string =>
    match ? `${match[1]}${Math.round(v)}${match[3]}` : value,
  );

  // Imperative text updates: no React re-render per frame, and it sidesteps
  // the motion types not accepting a MotionValue as a child.
  useMotionValueEvent(text, "change", (t) => {
    if (ref.current) ref.current.textContent = t;
  });

  useEffect(() => {
    if (!match || reduce) return;
    if (!inView) return;
    const controls = animate(mv, target, { duration: 1.4, ease: EASE });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, target]);

  // Static markup shows the final value (SSR/SEO/no-JS); the animation
  // snaps it to 0 and counts up the moment the band enters the viewport.
  return <span ref={ref}>{value}</span>;
}

/** Big-number stat strip: charcoal band with gold figures. */
export function StatsBand() {
  const reduce = useSafeReducedMotion();

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
              <div className="stats-value">
                <StatValue value={s.value} />
              </div>
              <div className="stats-label">{s.label}</div>
              {"note" in s && typeof s.note === "string" && (
                <div className="stats-note">{s.note}</div>
              )}
            </div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}
