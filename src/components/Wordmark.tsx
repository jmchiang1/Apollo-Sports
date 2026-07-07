import { brand } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { Shuttlecock } from "./Shuttlecock";

/**
 * Text wordmark: a plum medallion holding the gold shuttlecock, followed by the
 * brand name in the display face. `invert` flips it for dark plum backgrounds.
 */
export function Wordmark({
  className,
  descriptorClassName,
  invert = false,
}: {
  className?: string;
  descriptorClassName?: string;
  invert?: boolean;
}) {
  const [first, ...rest] = brand.name.split(" ");
  const descriptor = rest.join(" ");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight",
        invert ? "text-cream" : "text-ink",
        className,
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full shadow-sm",
          invert ? "bg-cream text-plum" : "bg-plum text-gold",
        )}
      >
        <Shuttlecock className="h-[1.2rem] w-[1.2rem]" />
      </span>
      <span className="leading-none">
        {first}
        {descriptor && (
          <span
            className={cn(
              "font-semibold",
              invert ? "text-cream/60" : "text-muted",
              descriptorClassName,
            )}
          >
            {" "}
            {descriptor}
          </span>
        )}
      </span>
    </span>
  );
}
