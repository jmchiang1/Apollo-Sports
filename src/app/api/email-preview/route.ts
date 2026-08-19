import { waitlistConfirmationEmail } from "@/lib/emails/waitlistConfirmation";

/**
 * Dev-only preview of the waitlist confirmation email so you can tweak the
 * design and refresh the browser instead of re-sending. Open:
 *   http://localhost:3001/api/email-preview
 *
 * Query params:
 *   ?name=Priya Patel   render with a different signer name (default Jonathan)
 *   ?view=text          the plain-text part instead of the HTML
 *   ?view=subject       just the subject line
 *
 * Returns 404 in production so it's never exposed on the live site.
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(req.url);
  const params = url.searchParams;
  // Point image URLs at this dev server so the artwork in `public/email/`
  // renders locally instead of waiting on a deploy to the live domain.
  const { subject, html, text } = waitlistConfirmationEmail(
    params.get("name") || "Jonathan",
    { assetBase: url.origin },
  );
  const view = params.get("view");

  if (view === "text" || view === "subject") {
    return new Response(view === "subject" ? subject : text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
