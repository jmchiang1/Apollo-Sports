import { Fragment } from "react";
import { cn } from "@/lib/cn";

/**
 * Renders text, highlighting any literal "[TODO: …]" tokens so unconfirmed
 * values are impossible to miss in the built site. Use for any string that may
 * contain a placeholder from siteConfig.
 *
 *   <TodoText>{location.addressLabel}</TodoText>
 *   <TodoText>{`Pricing is TBD (${todo.pricing}).`}</TodoText>
 */

const TODO_RE = /(\[TODO[^\]]*\])/g;

export function TodoText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const parts = children.split(TODO_RE);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith("[TODO") ? (
          <mark
            key={i}
            title="Placeholder — confirm before launch"
            className="mx-0.5 whitespace-normal rounded-md bg-gold-soft/80 px-1.5 py-0.5 align-baseline text-[0.85em] font-semibold tracking-tight text-gold-deep ring-1 ring-gold/50"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </span>
  );
}

/** Standalone TODO token badge (no surrounding copy). */
export function TodoBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      title="Placeholder — confirm before launch"
      className={cn(
        "inline-flex items-center rounded-md bg-gold-soft/80 px-2 py-1 text-sm font-semibold text-gold-deep ring-1 ring-gold/50",
        className,
      )}
    >
      {label}
    </span>
  );
}
