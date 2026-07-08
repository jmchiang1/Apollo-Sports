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
        "wordmark",
        invert ? "wordmark-cream" : "wordmark-ink",
        className,
      )}
    >
      <ApolloLogo className="wordmark-logo" />
      <span className="wordmark-text">Apollo Racket Club</span>
    </span>
  );
}
