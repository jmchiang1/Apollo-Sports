import { brand } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { ApolloMark } from "./ApolloMark";

/**
 * Luxury wordmark: the triangular mark beside the serif name with a tracked
 * "RACQUET CLUB" descriptor — mirrors the logo lockup.
 */
export function LuxeWordmark({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  const [first, ...rest] = brand.name.split(" ");
  const descriptor = rest.join(" ");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3",
        invert ? "text-butter" : "text-olive-ink",
        className,
      )}
    >
      <ApolloMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.6rem] font-medium leading-none tracking-tight">
          {first}
        </span>
        {descriptor && (
          <span
            className={cn(
              "mt-1 font-luxe text-[0.56rem] font-medium uppercase tracking-[0.3em]",
              invert ? "text-butter/70" : "text-olive-muted",
            )}
          >
            {descriptor}
          </span>
        )}
      </span>
    </span>
  );
}
