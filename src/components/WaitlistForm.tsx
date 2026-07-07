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

const inputClass =
  "w-full rounded-2xl border-2 border-plum/12 bg-cream-2 px-4 py-3 text-ink placeholder:text-muted/60 outline-none transition focus:border-gold focus:bg-cream focus:ring-4 focus:ring-gold/20";

const labelClass = "mb-1.5 block text-sm font-bold text-ink";

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
            className="flex flex-col items-center gap-4 rounded-3xl border-2 border-gold/40 bg-cream-2 px-6 py-10 text-center"
          >
            <motion.span
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.05 }}
              className="grid h-20 w-20 place-items-center rounded-full bg-cream shadow-md"
            >
              <ApolloMascot className="h-14 w-14" />
            </motion.span>
            <p className="font-display text-xl font-extrabold text-ink">
              {waitlist.success}
            </p>
            <p className="text-sm text-muted">Apollo says welcome to the pack. 🐾</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={false}
            exit={{ opacity: 0 }}
            className="grid gap-4 text-left"
          >
            <div className="grid gap-4 sm:grid-cols-2">
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
                <span className="font-medium text-muted">(optional)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {waitlist.sportsOptions.map((opt) => {
                  const active = sport === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSport(active ? "" : opt)}
                      className={cn(
                        "rounded-full border-2 px-4 py-2 text-sm font-bold transition",
                        active
                          ? "border-plum bg-plum text-cream"
                          : "border-plum/15 bg-cream-2 text-ink/80 hover:border-plum/40",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="sm:max-w-[10rem]">
              <label htmlFor="wl-zip" className={labelClass}>
                Zip code <span className="font-medium text-muted">(optional)</span>
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
              <p className="text-sm font-semibold text-[#c0392b]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className={buttonClass({
                variant: "accent",
                size: "lg",
                className: "mt-1 w-full sm:w-auto",
              })}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Joining…
                </>
              ) : (
                waitlist.button
              )}
            </button>

            <p className="text-xs text-muted">
              No spam — just news about the club. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
