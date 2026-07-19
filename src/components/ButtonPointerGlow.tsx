"use client";

import { useEffect } from "react";

/**
 * Pointer-tracked gradient for every `.btn` on the page.
 *
 * Mounted once. Buttons are rendered from server components, client
 * components, and a bare `<button className={buttonClass(...)}>` in the
 * waitlist form, so per-component handlers would mean touching every call
 * site (and turning server components into client ones). A single delegated
 * listener covers anything carrying the `.btn` class instead, including
 * markup added later.
 *
 * The listener only writes two custom properties; the gradient itself lives
 * in globals.css next to the button variants.
 */
export function ButtonPointerGlow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active: HTMLElement | null = null;
    let frame = 0;
    let px = 0;
    let py = 0;

    const clear = (el: HTMLElement) => {
      el.style.removeProperty("--btn-x");
      el.style.removeProperty("--btn-y");
    };

    const paint = () => {
      frame = 0;
      if (!active) return;
      const r = active.getBoundingClientRect();
      if (!r.width || !r.height) return;
      active.style.setProperty("--btn-x", `${((px - r.left) / r.width) * 100}%`);
      active.style.setProperty("--btn-y", `${((py - r.top) / r.height) * 100}%`);
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const btn = target?.closest?.(".btn") as HTMLElement | null;

      // Left the previous button (or moved onto a different one) — reset it so
      // the gradient eases back to centre rather than freezing mid-travel.
      if (active && active !== btn) clear(active);
      active = btn;
      if (!btn) return;

      // Read coordinates now: the event is stale by the time rAF runs.
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      if (active) clear(active);
    };
  }, []);

  return null;
}
