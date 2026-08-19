import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { waitlistConfirmationEmail } from "@/lib/emails/waitlistConfirmation";

// Node runtime (Supabase + Resend SDKs), not edge.
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Waitlist capture:
 *   1. Save the signup to Supabase (private `waitlist` table, upsert on email).
 *   2. Send a confirmation email via Resend (best-effort — a save still counts
 *      as success even if the email fails).
 *
 * Both steps degrade gracefully: with no env keys set (e.g. local dev) the
 * route just logs the signup and returns ok, so the form keeps working.
 * Required env in production — see .env.example:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_FROM
 *   (optional: RESEND_REPLY_TO, WAITLIST_NOTIFY_TO)
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const name = String(data?.name ?? "").trim();
    const email = String(data?.email ?? "").trim().toLowerCase();
    const skill = String(data?.skill ?? "").trim() || null;
    const zip = String(data?.zip ?? "").trim() || null;

    if (!name || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a name and a valid email." },
        { status: 400 },
      );
    }

    // ── 1. Save ──────────────────────────────────────────────────────────
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from("waitlist")
        .upsert({ name, email, skill, zip }, { onConflict: "email" });
      if (error) {
        console.error("[waitlist] supabase insert failed:", error.message);
        return NextResponse.json(
          { ok: false, error: "Couldn't save your spot. Please try again." },
          { status: 500 },
        );
      }
    } else {
      console.warn(
        "[waitlist] Supabase not configured — signup NOT saved:",
        { name, email, skill, zip },
      );
    }

    // ── 2. Confirmation email (best-effort) ──────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    if (resendKey && from) {
      try {
        const resend = new Resend(resendKey);
        const { subject, html, text } = waitlistConfirmationEmail(name);
        // The Resend SDK reports API errors in `error` (it doesn't throw), so
        // check it explicitly — otherwise a rejected send would pass silently.
        const { error: sendError } = await resend.emails.send({
          from,
          to: email,
          subject,
          html,
          text,
          replyTo: process.env.RESEND_REPLY_TO || undefined,
        });
        if (sendError) {
          console.error("[waitlist] confirmation email rejected:", sendError);
        }

        // Optional heads-up to the club that someone joined.
        const notify = process.env.WAITLIST_NOTIFY_TO;
        if (notify) {
          await resend.emails.send({
            from,
            to: notify,
            subject: `New waitlist signup: ${name}`,
            text: `${name} <${email}>\nSkill: ${skill ?? "—"}\nZip: ${zip ?? "—"}`,
          });
        }
      } catch (err) {
        // They're already saved — don't fail the signup over an email hiccup.
        console.error("[waitlist] confirmation email failed:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
