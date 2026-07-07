import { cn } from "@/lib/cn";
import { ApolloLogo } from "./ApolloLogo";

/**
 * Wordmark: the golden-retriever logo mark + "Apollo Racket Club". Mark and
 * text share currentColor, so `invert` flips both for dark backgrounds.
 */
export function Wordmark({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight sm:text-2xl",
        invert ? "text-cream" : "text-ink",
        className,
      )}
    >
      <ApolloLogo className="h-9 w-auto sm:h-10" />
      <span className="leading-none whitespace-nowrap">Apollo Racket Club</span>
    </span>
  );
}
