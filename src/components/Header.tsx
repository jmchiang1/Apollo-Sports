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
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-plum/10 bg-cream/90 backdrop-blur-md"
          : "border-b border-transparent bg-cream/0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-500 sm:px-8",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <a href="#top" aria-label={`${brand.name} — back to top`} className="shrink-0">
          <Wordmark descriptorClassName="hidden sm:inline" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-[3px] w-full origin-left scale-x-0 rounded-full bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={hero.primaryCta.href}
            variant="accent"
            size="md"
            className="hidden sm:inline-flex"
          >
            {hero.primaryCta.label}
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-plum/[0.06] md:hidden"
          >
            <Menu className="h-5 w-5" />
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
            className="fixed inset-0 z-50 bg-cream md:hidden"
          >
            <div className="flex h-20 items-center justify-between px-6">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-plum/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
              }}
              className="flex flex-col gap-1 px-6 pt-6"
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
                  className="border-b border-plum/10 py-4 font-display text-3xl font-extrabold text-ink"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="pt-8"
              >
                <ButtonLink
                  href={hero.primaryCta.href}
                  variant="accent"
                  size="lg"
                  onClick={() => setOpen(false)}
                  className="w-full"
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
