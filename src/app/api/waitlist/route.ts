import { NextResponse } from "next/server";

/**
 * Waitlist capture endpoint.
 *
 * For now this just validates and logs the signup (the brief's "no-op /
 * console.log handler"). To go live, swap the console.log for one of:
 *   • Formspree  → POST to your form endpoint
 *   • Resend     → send yourself / the subscriber an email
 *   • A database → insert the row (Vercel Postgres, Supabase, etc.)
 * The client contract (POST JSON → { ok: boolean }) stays the same.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const name = String(data?.name ?? "").trim();
    const email = String(data?.email ?? "").trim();
    const sport = String(data?.sport ?? "").trim();
    const zip = String(data?.zip ?? "").trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk) {
      return NextResponse.json(
        { ok: false, error: "Please provide a name and a valid email." },
        { status: 400 },
      );
    }

    // TODO(jonathan): replace with Formspree / Resend / DB insert.
    console.log("[waitlist] new signup", { name, email, sport, zip });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
