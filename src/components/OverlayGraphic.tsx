import { cn } from "@/lib/cn";

/**
 * Decorative transparent overlay graphic (e.g. the birdie / pickleball
 * watermarks). Rendered as a background image so it can be freely sized,
 * positioned, and inverted for dark sections.
 */
export function OverlayGraphic({
  src,
  className,
  invert = false,
}: {
  src: string;
  className?: string;
  invert?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bg-contain bg-center bg-no-repeat",
        className,
      )}
      style={{
        backgroundImage: `url(${src})`,
        ...(invert ? { filter: "invert(1)" } : null),
      }}
    />
  );
}
