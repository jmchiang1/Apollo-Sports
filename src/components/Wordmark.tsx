import { cn } from "@/lib/cn";
import { ApolloLogo } from "./ApolloLogo";

/**
 * Wordmark: the gold shuttlecock mark + a stacked two-line lockup — "APOLLO"
 * in the title face over "RACKET CLUB" in the body face, both letterspaced.
 *
 * The two lines together are `brand.name` ("Apollo Racket Club"), split for the
 * lockup. Keep them in step with siteConfig if the brand name ever changes.
 *
 * The two lines are NOT scaled to the reference art's proportions. There the
 * mark is ~4x the cap height of "APOLLO", which at a 40px header mark would
 * put the sub-line under 10px. The line RATIO and the tracking carry the look;
 * the sizes are set for legibility at header scale instead.
 *
 * `invert` is kept for the callers, but the lockup is gold in both states — it
 * is a logo, not body copy, so it does not follow the ivory/onyx flip. The mark
 * paints its own gold gradient (see ApolloLogo); the text takes its gold here.
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
      <span className="wordmark-text">
        <span className="wordmark-name">Apollo</span>
        <span className="wordmark-sub">Racket Club</span>
      </span>
    </span>
  );
}
