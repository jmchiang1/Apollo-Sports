"use client";

import { useEffect, useRef, useState } from "react";
import { ApolloLogo } from "./ApolloLogo";
import { useSafeReducedMotion } from "./Reveal";

/* Must stay in step with globals.css. The mark finishes unfurling at 1150ms
   and holds; at 1450ms the scrim starts clearing and the mark flies to the
   header's logo slot, landing at 2350ms. The node is removed at 2450ms, a
   beat after the header's own logo has faded up underneath it. */
const FLIGHT_AT = 1450;
const FLIGHT_MS = 900;
const REMOVE_AT = 2450;

/** Where the mark flies to: the header's logo slot, measured at flight time. */
const TARGET = ".header-bar .wordmark-logo";

/**
 * Brand intro: the shuttlecock mark unfurls from its cork, then flies to the
 * navbar and becomes the site's logo.
 *
 * Rendered on the SERVER as well as the client (initial state is "showing"),
 * so it is in the first paint. A client-only overlay would let the page flash
 * before mounting on top of it, which is worse than no loader at all.
 *
 * THE FLIGHT IS THE ONLY PART THAT NEEDS JS, and only because the target moves
 * with the viewport — the header logo is `h-14` on phones and `h-24` from `sm`
 * up, so its box has to be measured rather than hardcoded. Everything else is
 * CSS, and the CSS is written so that a flight which never happens still ends
 * on a usable page: the scrim clears on its own, the mark fades on its own,
 * and the header's logo fades up on its own timer. A bundle that throws costs
 * the transition, not the site.
 */
export function PageLoader() {
  // Reduced motion is DERIVED, not written into state from an effect. Doing it
  // with a setState would fire the same `set-state-in-effect` lint the Header
  // trips, and derived is the honest shape anyway: nothing happened, we just
  // know more after hydration. The shared hook is SSR-safe (false until
  // hydrated), which matches the server render.
  const reduce = useSafeReducedMotion();
  const [elapsed, setElapsed] = useState(false);
  const flyer = useRef<HTMLDivElement>(null);
  const gone = reduce || elapsed;

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setElapsed(true), REMOVE_AT);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // The flight, as a FLIP: measure where the mark is, measure where the header
  // logo sits, then transform the first onto the second. Both rects are
  // viewport-relative and the overlay is `position: fixed` over a page whose
  // scroll is locked, so the delta needs no scroll correction.
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => {
      const el = flyer.current;
      const target = document.querySelector(TARGET);
      if (!el || !target) return; // CSS still clears the overlay on its own

      const from = el.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (!from.height || !to.height) return; // nothing sane to fly to

      // Same artwork at both ends, so one uniform scale preserves the aspect.
      const scale = to.height / from.height;

      // Take the element over from CSS: drop the fade that would otherwise
      // dissolve the mark mid-flight, and pin the origin to the top-left so the
      // translation lands corner on corner rather than centre on centre.
      el.style.animation = "none";
      el.style.transformOrigin = "top left";
      el.animate(
        [
          { transform: "translate(0px, 0px) scale(1)" },
          {
            transform:
              `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})`,
          },
        ],
        {
          duration: FLIGHT_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );
    }, FLIGHT_AT);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // Hold the page still under the overlay.
  //
  // A CLASS, not `body.style.overflow`. Header owns that inline property for
  // its menu and rewrites it on every `open` change, including the initial
  // `open === false` pass that sets it back to "". Effects run child-first, so
  // whichever of us runs last wins — and an inline write here was silently
  // losing that race, leaving the page free to scroll behind the overlay.
  // A class sidesteps the ordering entirely: Header's "" clears its own inline
  // declaration rather than overriding ours, so `body.is-loading` still holds.
  //
  // `body`, never `documentElement` — see the note in layout.tsx. On body the
  // value propagates to the viewport instead of making body a scroll
  // container, so the hero's sticky pin survives (this is the same mechanism
  // Header's menu already relies on).
  useEffect(() => {
    if (gone) return;
    document.body.classList.add("is-loading");
    return () => document.body.classList.remove("is-loading");
  }, [gone]);

  if (gone) return null;

  return (
    <div className="page-loader" role="status" aria-label="Loading">
      {/* The ground is its own layer so it can clear while the mark stays
          opaque and flies on over the revealed page. */}
      <div className="page-loader-scrim" />
      <div className="page-loader-flyer" ref={flyer}>
        <ApolloLogo className="page-loader-mark" />
      </div>
    </div>
  );
}
