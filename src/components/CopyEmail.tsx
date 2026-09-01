"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TodoText } from "./Todo";

/** How long the confirmation stays up. */
const TOAST_MS = 2200;

/**
 * Writes `text` to the clipboard, returning whether it worked.
 *
 * The async Clipboard API is only defined in a SECURE CONTEXT — https, or
 * localhost. On a plain-http staging host `navigator.clipboard` is undefined
 * rather than merely failing, so this falls back to a throwaway textarea and
 * `execCommand`. That is deprecated but it is the only thing that works there,
 * and silently doing nothing is worse.
 */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path — a rejection here is usually a denied
    // permission, which execCommand can still get away with inside a click.
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    // Off-screen but still focusable: `display: none` cannot be selected.
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.top = "-9999px";
    document.body.append(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  } catch {
    return false;
  }
}

/**
 * The footer email, as a click-to-copy control with a corner confirmation.
 *
 * NOT a `mailto:` link. Clicking one opens whatever the OS thinks the mail
 * client is, which on a desktop without one configured does nothing visible —
 * for an address people mostly want to paste elsewhere, copying is the more
 * useful default. The address stays plain selectable text either way.
 */
export function CopyEmail({ address }: { address: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Without this, unmounting mid-toast leaves a timer to fire against a gone
  // component, and a second click would otherwise be cut short by the first
  // click's pending timeout.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async () => {
    const ok = await writeClipboard(address);
    setState(ok ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), TOAST_MS);
  }, [address]);

  return (
    <>
      <button type="button" onClick={copy} className="footer-copy">
        <Mail className="footer-contact-icon" />
        <TodoText>{address}</TodoText>
        {/* Decorative: the button already has an accessible name from the
            address itself, and the live region below announces the result. */}
        {state === "copied" ? (
          <Check className="footer-copy-hint footer-copy-hint-done" />
        ) : (
          <Copy className="footer-copy-hint" />
        )}
      </button>

      {/* Always mounted, so screen readers see a live region that already
          existed when the text arrives. Mounting the region and its content at
          the same moment is unreliable across readers. */}
      <div className="copy-toast-region" role="status" aria-live="polite">
        {state !== "idle" && (
          <p className={`copy-toast copy-toast-${state}`}>
            {state === "copied" ? "Email copied" : `Press ⌘C to copy`}
          </p>
        )}
      </div>
    </>
  );
}
