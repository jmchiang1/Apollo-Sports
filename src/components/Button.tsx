import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none active:translate-y-[3px]";

/**
 * Chunky pill buttons with a solid offset "hard shadow" that presses down on
 * click — the retro-casual sticker feel borrowed from the reference sites.
 */
export const buttonVariants = {
  // Deep plum — the reliable, high-contrast action on any light block.
  primary:
    "bg-plum text-cream shadow-[0_5px_0_0_#201d18] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_#201d18] active:shadow-[0_2px_0_0_#201d18]",
  // Caramel gold — warm, inviting (the Apollo namesake). The signature CTA.
  accent:
    "bg-gold text-plum shadow-[0_5px_0_0_#a9761a] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_#a9761a] active:shadow-[0_2px_0_0_#a9761a]",
  // Cream — for use on dark plum sections.
  cream:
    "bg-cream text-plum shadow-[0_5px_0_0_rgba(0,0,0,0.28)] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_rgba(0,0,0,0.28)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.28)]",
  // Quiet outline.
  outline:
    "text-plum ring-2 ring-inset ring-plum/25 hover:ring-plum/50 hover:bg-plum/[0.04] active:translate-y-0",
} as const;

export const buttonSizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-4 text-[1.02rem]",
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
