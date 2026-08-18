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
 *   start  — half a viewport before the section's top reaches the fold
 *   finish — the section's top rising into the upper third of the viewport
 * The whole run therefore completes while Programs is still arriving, so it
 * reads as finished by the time the section fills the screen.
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

      // he sets off while the section is still half a viewport below the fold
      const enter =
        el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 1.5;

      // ...and lands once the section's top has risen into the upper third of
      // the viewport, well before the section is centred.
      const section = el.closest(".programs-section") ?? el;
      const box = section.getBoundingClientRect();
      const land = box.top + window.scrollY - window.innerHeight * 0.35;

      const finish = Math.max(0, Math.min(1, land / max));
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
  // End point stops short of 100vw on purpose: the section is `overflow-hidden`
  // and the sprite is ~200px wide at its landing angle, so anything much past
  // this clips his nose on narrower desktops.
  const x = useTransform(p, [0, 1], ["0vw", "75vw"]);

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
