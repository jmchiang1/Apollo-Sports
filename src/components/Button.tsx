import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const base = "btn";

/**
 * Chunky pill buttons with a solid offset "hard shadow" that presses down on
 * click — the retro-casual sticker feel borrowed from the reference sites.
 * Each variant/size maps to a semantic class defined in globals.css.
 */
export const buttonVariants = {
  // Deep plum — the reliable, high-contrast action on any light block.
  primary: "btn-primary",
  // Caramel gold — warm, inviting (the Apollo namesake). The signature CTA.
  accent: "btn-accent",
  // Cream — for use on dark plum sections.
  cream: "btn-cream",
  // Quiet outline.
  outline: "btn-outline",
} as const;

export const buttonSizes = {
  md: "btn-md",
  lg: "btn-lg",
} as const;

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
} = {}) {
  return cn(base, buttonVariants[variant], buttonSizes[size], className);
}

type ButtonLinkProps = {
  href: string;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a href={href} className={buttonClass({ variant, size, className })} {...rest}>
      {children}
    </a>
  );
}
