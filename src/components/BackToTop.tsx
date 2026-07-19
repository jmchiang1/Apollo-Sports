"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Floating "back to top" button — hidden over the hero, appears once you've
 * scrolled past the first viewport. Plain anchor to #top so it works without
 * JS and rides the html `scroll-behavior: smooth` (which the reduced-motion
 * media query already switches off).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn("back-to-top", !visible && "back-to-top-hidden")}
    >
      <ArrowUp className="back-to-top-icon" strokeWidth={2.5} />
    </a>
  );
}
