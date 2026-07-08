"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { brand, hero, nav } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { Wordmark } from "./Wordmark";
import { ButtonLink } from "./Button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
