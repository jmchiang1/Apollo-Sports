"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { waitlist } from "@/config/siteConfig";
import { buttonClass } from "./Button";
import { cn } from "@/lib/cn";
import { ApolloMascot } from "./ApolloMascot";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass = "waitlist-form-input";

const labelClass = "waitlist-form-label";

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [sport, setSport] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const zip = String(fd.get("zip") ?? "").trim();

    if (!name) {
      setStatus("error");
      setError("Please enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, sport, zip }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="waitlist-form-success"
          >
            <motion.span
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.05 }}
              className="waitlist-form-success-badge"
            >
              <ApolloMascot className="waitlist-form-success-mascot" />
            </motion.span>
            <p className="waitlist-form-success-title">{waitlist.success}</p>
            <p className="waitlist-form-success-note">
              Apollo says welcome to the pack. 🐾
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={false}
            exit={{ opacity: 0 }}
            className="waitlist-form"
          >
            <div className="waitlist-form-fields">
              <div>
                <label htmlFor="wl-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="wl-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jordan Lee"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="wl-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="wl-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>
                Sports you play{" "}
                <span className="waitlist-form-label-muted">(optional)</span>
              </legend>
              <div className="waitlist-form-chips">
                {waitlist.sportsOptions.map((opt) => {
                  const active = sport === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSport(active ? "" : opt)}
                      className={cn(
                        "waitlist-form-chip",
                        active
                          ? "waitlist-form-chip-active"
                          : "waitlist-form-chip-idle",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="waitlist-form-zip">
              <label htmlFor="wl-zip" className={labelClass}>
                Zip code <span className="waitlist-form-label-muted">(optional)</span>
              </label>
              <input
                id="wl-zip"
                name="zip"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="11021"
                className={inputClass}
              />
            </div>

            {status === "error" && (
              <p className="waitlist-form-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className={buttonClass({
                variant: "accent",
                size: "lg",
                className: "waitlist-form-submit",
              })}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="waitlist-form-submit-icon" />
                  Joining…
                </>
              ) : (
                waitlist.button
              )}
            </button>

            <p className="waitlist-form-disclaimer">
              No spam — just news about the club. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
