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
            className="todo-token"
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
      className={cn("todo-badge", className)}
    >
      {label}
    </span>
  );
}
