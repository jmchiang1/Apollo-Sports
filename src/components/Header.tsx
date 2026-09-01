"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { brand, hero, nav } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { Wordmark } from "./Wordmark";
import { ButtonLink } from "./Button";
import { useSafeReducedMotion } from "./Reveal";

export function Header() {
  const reduce = useSafeReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // The menu overlay is portaled to <body> so it can never be trapped by the
  // header's containing block (see the overlay render below). Portals need the
  // DOM, so gate on mount to stay SSR-safe.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // The bar stays transparent for the whole pinned hero fly-over and only
    // solidifies (cream bg, smaller logo) once the pin has scrolled past —
    // i.e. when its bottom edge slides under the header.
    const onScroll = () => {
      const pin = document.querySelector(".hero-pin");
      // The fly-over's payoff — the assembled 8-court facility — lands when
      // the courts anchor reaches the header. Solidify the bar to cream there
      // too (not only once the whole pin has scrolled past), so the nav reads
      // as a white bar over that frame. Matched by CLASS: the reduced-motion
      // anchor carries the same id but shouldn't trigger this.
      const courts = document.querySelector(".hero-courts-anchor");
      const atCourts = !!courts && courts.getBoundingClientRect().top <= 96;
      // `.hero-courts-anchor` exists ONLY while the pinned fly-over is on (the
      // still hero and the reduced-motion hero both use `-top`), so it doubles
      // as the signal for which rule applies. Waiting on the pin's travel is
      // right for a 320svh pinned track; on a one-screen hero there is no
      // travel to wait for, and holding the bar transparent that long lets the
      // hero copy scroll up into the nav. Fall back to the ordinary rule.
      setScrolled(
        pin && courts
          ? pin.getBoundingClientRect().bottom <= 80 || atCourts
          : window.scrollY > 16,
      );

      // Scroll-spy: the last nav target whose top has passed the header.
      // Hidden sections (0×0 rects) are skipped so they can never win.
      const y = window.scrollY + 120;
      let current: string | null = null;
      for (const item of nav) {
        const el = document.querySelector<HTMLElement>(item.href);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.top + window.scrollY <= y) current = item.href;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "header-bar",
        scrolled ? "header-bar-scrolled" : "header-bar-top",
      )}
    >
      <div
        className={cn(
          "header-inner",
          scrolled ? "header-inner-scrolled" : "header-inner-top",
        )}
      >
        <a href="#top" aria-label={`${brand.name}, back to top`} className="header-brand">
          <Wordmark />
        </a>

        <nav className="header-nav">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="group header-nav-link">
              {item.label}
              <span className="header-nav-underline" />
              {/* scroll-spy indicator — layoutId makes it slide between links */}
              {active === item.href &&
                (reduce ? (
                  <span className="header-nav-active" />
                ) : (
                  <motion.span
                    layoutId="header-nav-active"
                    className="header-nav-active"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                ))}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <ButtonLink
            href={hero.primaryCta.href}
            variant="accent"
            size="md"
            className="header-cta"
          >
            {hero.primaryCta.label}
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="header-menu-btn"
          >
            <Menu className="header-icon" />
          </button>
        </div>
      </div>

      {/* Portaled to <body>: the scrolled header carries a backdrop-filter,
          which would otherwise make it the containing block for this fixed
          overlay and collapse it to the bar's height (cream bg + nav only
          covering the top). Rendered at the document root, `inset-0` resolves
          against the viewport in every scroll state. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="header-overlay"
              >
            <div className="header-overlay-top">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="header-overlay-close"
              >
                <X className="header-icon" />
              </button>
            </div>

            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
              }}
              className="header-overlay-nav"
            >
              {nav.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="header-overlay-link"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="header-overlay-cta-wrap"
              >
                <ButtonLink
                  href={hero.primaryCta.href}
                  variant="accent"
                  size="lg"
                  onClick={() => setOpen(false)}
                  className="header-overlay-cta"
                >
                  {hero.primaryCta.label}
                </ButtonLink>
              </motion.div>
            </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
