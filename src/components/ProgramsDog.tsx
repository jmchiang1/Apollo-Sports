"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { DogRunning } from "./DogRunning";
import { useSafeReducedMotion } from "./Reveal";

/**
 * Apollo travels across the Programs section, driven by scroll: he starts at
 * the left edge and moves right in the artwork's original pose.
 *
 * Both ends of the run are MEASURED as document-scroll fractions, so the run
 * is anchored to the section itself rather than to the page as a whole (which
 * would drift every time a section above is added, removed, or resized):
 *   start  — the moment the track crosses the viewport's bottom edge
 *   finish — the section's midpoint sitting at the centre of the viewport
 * Reduced motion pins him in place.
 */
export function ProgramsDog() {
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [span, setSpan] = useState<[number, number]>([0.3, 0.5]);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;

      // he becomes visible when the track crosses the viewport's bottom edge
      const enter =
        el.getBoundingClientRect().top + window.scrollY - window.innerHeight;

      // ...and lands when the section is half-scrolled — i.e. its vertical
      // midpoint reaches the middle of the viewport.
      const section = el.closest(".programs-section") ?? el;
      const box = section.getBoundingClientRect();
      const mid =
        box.top + window.scrollY + box.height / 2 - window.innerHeight / 2;

      const finish = Math.max(0, Math.min(1, mid / max));
      const start = Math.max(0, Math.min(finish - 0.01, enter / max));
      setSpan([start, finish]);
    };
    measure();
    // re-measure once fonts/images settle, and on resize
    const t = setTimeout(measure, 600);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const raw = useTransform(scrollYProgress, span, [0, 1]);
  // Stiffer than a purely decorative spring would need to be: the softer
  // settings trailed far enough behind `raw` that he was still visibly moving
  // well past the midpoint, which is exactly the beat he's supposed to hit.
  const p = useSpring(raw, { stiffness: 160, damping: 30, mass: 0.4 });
  const x = useTransform(p, [0, 1], ["0vw", "68vw"]);

  return (
    <div ref={ref} className="programs-dog-track" aria-hidden>
      <motion.div
        className="programs-dog-mover"
        style={reduce ? undefined : { x }}
      >
        <DogRunning className="programs-running-dog-svg" />
      </motion.div>
    </div>
  );
}
