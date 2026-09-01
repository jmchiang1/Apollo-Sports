"use client";

import { useEffect, useState } from "react";
import { ApolloLogo } from "./ApolloLogo";
import { useSafeReducedMotion } from "./Reveal";

/* Must stay in step with the `.page-loader` animation in globals.css: the
   mark finishes unfurling at 1150ms, holds, and the overlay starts fading at
   1550ms over 550ms. `.site-main` fades up from 1620ms, so the two crossfade.
   These two only drive the unmount — the visuals are entirely CSS. */
const HOLD_MS = 1550;
const FADE_MS = 550;

/**
 * Brand intro: the shuttlecock mark unfurls from its cork, holds, then the
 * overlay fades off the page.
 *
 * Rendered on the SERVER as well as the client (initial state is "showing"),
 * so it is in the first paint. A client-only overlay would let the page flash
 * before mounting on top of it, which is worse than no loader at all.
 *
 * THE WHOLE SEQUENCE IS CSS. This component only unmounts the node once the
 * animation has finished, and locks scroll while it runs. That split is
 * deliberate: if JS never runs, is slow to hydrate, or throws, the CSS still
 * fades and hides the overlay on its own, so a broken script can never leave
 * the site behind a permanent black screen. Reduced motion is handled in CSS
 * too (the overlay is `display: none`), for the same reason.
 */
export function PageLoader() {
  // Reduced motion is DERIVED, not written into state from an effect. Doing it
  // with a setState would fire the same `set-state-in-effect` lint the Header
  // trips, and derived is the honest shape anyway: nothing happened, we just
  // know more after hydration. The shared hook is SSR-safe (false until
  // hydrated), which matches the server render.
  const reduce = useSafeReducedMotion();
  const [elapsed, setElapsed] = useState(false);
  const gone = reduce || elapsed;

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setElapsed(true), HOLD_MS + FADE_MS);
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
      <ApolloLogo className="page-loader-mark" />
    </div>
  );
}
