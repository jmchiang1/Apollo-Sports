"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    // The bar stays transparent for the whole pinned hero fly-over and only
    // solidifies (cream bg, smaller logo) once the pin has scrolled past —
    // i.e. when its bottom edge slides under the header.
    const onScroll = () => {
      const pin = document.querySelector(".hero-pin");
      setScrolled(
        pin
          ? pin.getBoundingClientRect().bottom <= 80
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
        <a href="#top" aria-label={`${brand.name} — back to top`} className="header-brand">
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
      </AnimatePresence>
    </header>
  );
}
