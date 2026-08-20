import { brand, todo } from "@/config/siteConfig";

/**
 * The confirmation email sent after someone joins the waitlist.
 *
 * ✏️  EDIT THE COPY HERE — everything in `copy` below is the wording people
 * receive. The rest of the file is just presentation (HTML + plain-text) and
 * rarely needs touching. `{first}` is replaced with the signer's first name.
 *
 * ── Why the markup looks like this ─────────────────────────────────────────
 * Email clients are not browsers. Layout is tables + inline styles (no flex,
 * no grid, no external CSS), because Outlook and Gmail strip or ignore the
 * modern equivalents. Rounded corners, box-shadows and the dot texture are
 * progressive enhancement: clients that drop them fall back to flat blocks in
 * the same colours, which still reads as the site.
 */
const opening = todo.opening.replace(/^opening\s*/i, ""); // "Opening 2027" -> "2027"

const SITE = "https://apolloracketclub.com";

const copy = {
  subject: `You're on the ${brand.name} waitlist`,
  preheader: "Founding-member perks and opening-day news are on the way.",
  heading: "You're in the pack!",
  // Word inside `heading` to highlight with the site's marker sweep.
  headingHighlight: "in the pack",
  greeting: "Hey {first},",
  paragraphs: [
    `You're officially on the waitlist for ${brand.name}, ${brand.tagline}.`,
    `As a founding member you'll lock in our lowest rates and get first access to court booking the moment we open in ${opening}.`,
  ],
  // The membership-card block. `{first}` and `{name}` are both available.
  card: {
    label: "Founding member",
    nameFallback: "Friend of the club",
    footLeft: `Opening ${opening}`,
    footRight: "Great Neck, NY",
  },
  // `icon` names a PNG in `public/email/`, built by scripts/build-email-icons.mjs
  // from the same lucide icons the site's cards use.
  perks: [
    { icon: "icon-badge-check", label: "Founding rates" },
    { icon: "icon-calendar-clock", label: "Priority booking" },
    { icon: "icon-sparkles", label: "Opening invite" },
  ],
  stepsHeading: "What happens next",
  // Written for people who have ALREADY signed up, so these pick up where the
  // site's waitlist steps leave off (those still ask you to drop your email).
  steps: [
    {
      title: "We keep you posted",
      body: "Club news, court progress, and program updates land in your inbox as they happen.",
    },
    {
      title: "You claim your founding rate",
      body: `Before we open you get first pick of membership at founding prices.`,
    },
    {
      title: "You play opening day",
      body: `Booking opens to waitlist members first when the doors open in ${opening}.`,
    },
  ],
  cta: { label: "See what we're building", href: `${SITE}/#programs` },
  signOff: "See you on the court,",
  signName: "The Apollo pack",
  socials: [
    { label: "Instagram", url: todo.social.instagram },
    { label: "Facebook", url: todo.social.facebook },
  ],
};

// ── palette (matches the site tokens in globals.css) ─────────────────────
const PLUM = "#1D3C44"; // dark anchor
const PLUM_2 = "#244a54"; // dark anchor, lifted
const TEAL = "#159e8a"; // accent
const TEAL_DEEP = "#0e7466"; // accent, pressed
const TEAL_SOFT = "#cfeae3"; // pale accent (marker sweep)
const CREAM = "#f6f5f0"; // canvas
const CREAM_2 = "#e9e9e2"; // deeper canvas
const SAND = "#FFFFFF"; // pastel block
const MINT = "#cde7de"; // pastel block
const VIOLET = "#e7e1f0"; // pastel block
const INK = "#1f2340"; // primary text
const MUTED = "#6c6f80"; // secondary text
const LINE = "#e2ded4"; // hairline

const DISPLAY = `'Bricolage Grotesque','Figtree',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const SANS = `'Figtree',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

/** Dot texture from `.tex-dots`, tinted for a light or dark surface. */
function dots(color: string) {
  return `background-image:radial-gradient(${color} 1.6px,transparent 1.7px);background-size:22px 22px;`;
}

function firstNameOf(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

/**
 * Wraps the highlighted phrase in the site's `.marker` sweep — a band of pale
 * teal across the lower 42% of the text, not a full block. Clients that strip
 * background-image (Outlook) simply show plain text, which still reads fine.
 */
function markHeading(heading: string, phrase: string) {
  if (!phrase || !heading.includes(phrase)) return heading;
  return heading.replace(
    phrase,
    `<span style="background-image:linear-gradient(to top,${TEAL_SOFT} 0,${TEAL_SOFT} 42%,transparent 42%);padding:0 0.06em;">${phrase}</span>`,
  );
}

export function waitlistConfirmationEmail(
  name: string,
  /**
   * Where the email's images live. Defaults to the live site; the dev preview
   * route passes its own origin so the watermark shows up locally before a
   * deploy has shipped `public/email/`.
   */
  { assetBase = SITE }: { assetBase?: string } = {},
) {
  const first = firstNameOf(name);
  const cleanName = name.trim() || copy.card.nameFallback;
  const greeting = copy.greeting.replace("{first}", first);

  /**
   * Sleeping-Apollo watermark, parked in the top-right corner of the page and
   * bleeding off the right edge. The tint (plum at 13%) is baked into the PNG
   * rather than applied with CSS opacity, which email clients don't honour on
   * backgrounds. Deliberately set as CSS only — no `background` attribute — so
   * Outlook, which can't position or size a background image, drops it instead
   * of tiling a giant dog. The 2x asset is drawn at 360px to stay crisp.
   */
  const dogWatermark =
    `background-image:url('${assetBase}/email/dog-sleeping.png');` +
    `background-repeat:no-repeat;` +
    `background-position:right -150px top -50px;` +
    `background-size:400px auto;`;

  const paragraphsHtml = copy.paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 14px;font-family:${SANS};font-size:16px;line-height:1.65;color:${INK};">${p}</p>`,
    )
    .join("");

  /**
   * An icon from `public/email/`. Every mark in this email is a PNG built by
   * scripts/build-email-icons.mjs from the site's own artwork (the lucide icons
   * its cards use) — email clients render neither SVG nor icon
   * fonts. `alt=""` keeps them silent for screen readers and leaves no broken
   * placeholder when a client blocks remote images; the label text beside each
   * one already carries the meaning.
   */
  const icon = (
    file: string,
    width: number,
    height: number,
    valign = -3,
  ) =>
    `<img src="${assetBase}/email/${file}.png" width="${width}" height="${height}" alt="" style="display:inline-block;width:${width}px;height:${height}px;border:0;outline:none;vertical-align:${valign}px;">`;

  // Chips wrap on their own on narrow screens, so no media query needed.
  const perksHtml = copy.perks
    .map(
      (perk, i) =>
        `<span style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border-radius:999px;background-color:${[MINT, VIOLET, CREAM_2][i % 3]};font-family:${SANS};font-size:13px;font-weight:700;color:${PLUM};white-space:nowrap;">${icon(perk.icon, 15, 15)}&nbsp; ${perk.label}</span>`,
    )
    .join("");

  const stepsHtml = copy.steps
    .map(
      (step, i) => `
              <tr>
                <td width="44" valign="top" style="width:44px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="44" style="width:44px;">
                    <tr><td align="center" height="44" style="height:44px;border-radius:22px;background-color:${PLUM};font-family:${DISPLAY};font-size:17px;font-weight:800;color:${CREAM};line-height:44px;">${i + 1}</td></tr>
                  </table>
                </td>
                <td width="14" style="width:14px;">&nbsp;</td>
                <td valign="top" style="padding-bottom:${i === copy.steps.length - 1 ? 0 : 20}px;">
                  <div style="font-family:${DISPLAY};font-size:16px;font-weight:800;color:${INK};line-height:1.35;padding-top:2px;">${step.title}</div>
                  <div style="font-family:${SANS};font-size:14.5px;line-height:1.6;color:${MUTED};padding-top:3px;">${step.body}</div>
                </td>
              </tr>`,
    )
    .join("");

  const socials = copy.socials.filter((s) => s.url && !s.url.startsWith("["));
  const socialsHtml = socials
    .map(
      (s) =>
        `<a href="${s.url}" style="color:${TEAL_DEEP};text-decoration:none;font-weight:700;">${s.label}</a>`,
    )
    .join(`<span style="color:${MUTED};padding:0 8px;">·</span>`);

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${copy.subject}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;600;700;800&display=swap');
    :root { color-scheme: light; supported-color-schemes: light; }
    a { color: ${TEAL_DEEP}; }
    @media only screen and (max-width:600px) {
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .h1 { font-size: 30px !important; }
      .card-name { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${CREAM};font-family:${SANS};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;visibility:hidden;">${copy.preheader}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};${dots("rgba(29,60,68,0.055)")}">
    <tr><td align="center" style="padding:32px 16px 40px;">

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:28px;overflow:hidden;box-shadow:10px 10px 0 0 rgba(29,60,68,0.13);">

        <!-- Header band: deep teal + dot texture, same as the site's dark blocks -->
        <tr><td style="background-color:${PLUM};${dots("rgba(246,245,240,0.10)")}padding:24px 32px;" class="px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="left" style="font-family:${DISPLAY};font-size:19px;font-weight:800;letter-spacing:-0.01em;color:#ffffff;">${brand.name}</td>
              <td align="right" style="font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#8fd6c8;white-space:nowrap;">${todo.opening}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Headline, with Apollo asleep in the top-right corner behind it -->
        <tr><td style="padding:36px 32px 0;${dogWatermark}" class="px">
          <h1 class="h1" style="margin:0 0 18px;font-family:${DISPLAY};font-size:36px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${INK};">${markHeading(copy.heading, copy.headingHighlight)}</h1>
          <p style="margin:0 0 16px;font-family:${SANS};font-size:16px;font-weight:700;color:${INK};">${greeting}</p>
          ${paragraphsHtml}
        </td></tr>

        <!-- Founding-member card: sand block, dashed edge, teal rule -->
        <tr><td style="padding:22px 32px 0;" class="px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${SAND};border:2px dashed rgba(29,60,68,0.22);border-radius:22px;">
            <tr><td style="padding:22px 24px;">
              <div style="font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:${TEAL_DEEP};">${copy.card.label}</div>
              <div class="card-name" style="font-family:${DISPLAY};font-size:25px;font-weight:800;letter-spacing:-0.01em;color:${PLUM};padding-top:8px;">${cleanName}</div>
              <div style="height:2px;background-color:${TEAL};opacity:0.35;margin:14px 0 12px;font-size:0;line-height:0;">&nbsp;</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-family:${SANS};font-size:13px;font-weight:700;color:${PLUM};">${copy.card.footLeft}</td>
                  <td align="right" style="font-family:${SANS};font-size:13px;font-weight:700;color:${MUTED};">${copy.card.footRight}</td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Perk chips -->
        <tr><td style="padding:18px 32px 0;" class="px">${perksHtml}</td></tr>

        <!-- What happens next -->
        <tr><td style="padding:22px 32px 0;" class="px">
          <div style="font-family:${DISPLAY};font-size:18px;font-weight:800;letter-spacing:-0.01em;color:${INK};padding-bottom:16px;">${copy.stepsHeading}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${stepsHtml}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td align="center" style="padding:30px 32px 4px;" class="px">
          <a href="${copy.cta.href}" style="display:inline-block;background-color:${TEAL};color:#ffffff;font-family:${DISPLAY};font-size:16px;font-weight:800;text-decoration:none;padding:15px 30px;border-radius:999px;box-shadow:0 4px 0 0 ${TEAL_DEEP};">${copy.cta.label}</a>
        </td></tr>

        <!-- Sign-off -->
        <tr><td style="padding:28px 32px 34px;" class="px">
          <div style="border-top:2px dashed ${LINE};padding-top:22px;font-family:${SANS};font-size:16px;line-height:1.6;color:${INK};">
            ${copy.signOff}<br><strong style="font-family:${DISPLAY};font-weight:800;color:${PLUM};">${copy.signName}</strong>
          </div>
        </td></tr>

        <!-- Footer band -->
        <tr><td style="background-color:${CREAM_2};padding:22px 32px 26px;" class="px">
          ${socialsHtml ? `<p style="margin:0 0 10px;font-family:${SANS};font-size:14px;color:${MUTED};">Follow along: ${socialsHtml}</p>` : ""}
          <p style="margin:0 0 10px;font-family:${SANS};font-size:14px;color:${MUTED};">
            <a href="mailto:${todo.email}" style="color:${PLUM_2};text-decoration:none;font-weight:700;">${todo.email}</a>
            <span style="padding:0 8px;">·</span>${todo.phone}
          </p>
          <p style="margin:0;font-family:${SANS};font-size:11.5px;line-height:1.5;color:${MUTED};">${brand.legalEntity} · You're getting this because you joined the ${brand.name} waitlist.</p>
        </td></tr>

      </table>

      <div style="max-width:560px;padding-top:16px;font-family:${SANS};font-size:11.5px;color:${MUTED};text-align:center;">${brand.tagline}</div>

    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    copy.heading,
    "",
    greeting,
    "",
    ...copy.paragraphs,
    "",
    `${copy.card.label.toUpperCase()}: ${cleanName} · ${copy.card.footLeft} · ${copy.card.footRight}`,
    copy.perks.map((p) => p.label).join(" · "),
    "",
    copy.stepsHeading,
    ...copy.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`),
    "",
    `${copy.cta.label}: ${copy.cta.href}`,
    "",
    `${copy.signOff} ${copy.signName}`,
    "",
    ...socials.map((s) => `${s.label}: ${s.url}`),
    `${todo.email} · ${todo.phone}`,
    "",
    `${brand.legalEntity} · You're getting this because you joined the ${brand.name} waitlist.`,
  ].join("\n");

  return { subject: copy.subject, html, text };
}
