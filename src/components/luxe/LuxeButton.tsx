import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-luxe text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none";

export const luxeButtonVariants = {
  // Solid brass — the primary luxury CTA.
  brass: "bg-brass text-ivory hover:bg-[#946c33]",
  // Thin outline for dark (forest) backgrounds.
  outlineLight:
    "border border-butter/40 text-butter hover:border-butter hover:bg-butter/[0.06]",
  // Thin outline for light (butter) backgrounds.
  outlineDark:
    "border border-olive-ink/25 text-olive-ink hover:border-olive-ink/60 hover:bg-olive-ink/[0.04]",
} as const;

export const luxeButtonSizes = {
  md: "px-6 py-3",
  lg: "px-8 py-4 text-[0.78rem]",
} as const;

export function luxeButtonClass({
  variant = "brass",
  size = "md",
  className,
}: {
  variant?: keyof typeof luxeButtonVariants;
  size?: keyof typeof luxeButtonSizes;
  className?: string;
} = {}) {
  return cn(base, luxeButtonVariants[variant], luxeButtonSizes[size], className);
}

type LuxeButtonLinkProps = {
  href: string;
  variant?: keyof typeof luxeButtonVariants;
  size?: keyof typeof luxeButtonSizes;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function LuxeButtonLink({
  href,
  variant = "brass",
  size = "md",
  className,
  children,
  ...rest
}: LuxeButtonLinkProps) {
  return (
    <a href={href} className={luxeButtonClass({ variant, size, className })} {...rest}>
      {children}
    </a>
  );
}
