/**
 * Rasterises the email's artwork into `public/email/`.
 *
 *   node scripts/build-email-icons.mjs
 *
 * Why PNGs: the site's icons are SVG (lucide-react) and its graphics are SVG
 * files, but Gmail and Outlook render neither, and Gmail strips `data:` URIs.
 * So every mark the confirmation email uses has to be a raster file served
 * from a real URL. This script is the bridge — it pulls from the SAME sources
 * the site uses (lucide's icon nodes, `public/birdie.svg`, `assets/`), so the
 * email can never drift into a different icon set.
 *
 * Colours are baked in at render time, including the watermark's opacity:
 * email clients don't honour CSS `opacity` on a background image.
 *
 * Requires Chrome for rasterising (override the binary with $CHROME).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "email");
const WORK = join(tmpdir(), "apollo-email-icons");
const CHROME =
  process.env.CHROME ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Palette tokens, mirrored from globals.css / the email template.
const PLUM = "#1D3C44";

/** lucide icons, imported from the same package the site renders. */
const LUCIDE = {
  "icon-badge-check": "badge-check", // Founding rates
  "icon-calendar-clock": "calendar-clock", // Priority booking
  "icon-sparkles": "sparkles", // Opening invite
};

/** Rebuilds a lucide icon's SVG from its exported node array. */
async function lucideSvg(name, color, px) {
  const { __iconNode } = await import(`lucide-react/dist/esm/icons/${name}.mjs`);
  const body = __iconNode
    .map(([tag, attrs]) => {
      const props = Object.entries(attrs)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${props}/>`;
    })
    .join("");
  // Matches lucide's default presentation: 24px grid, 2px round strokes.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

/** Recolours a source SVG file. `opacity` is applied to the whole group so
 *  overlapping paths don't compound into darker patches. */
function fileSvg(path, { color, width, height, opacity = 1 }) {
  const src = readFileSync(join(ROOT, path), "utf8");
  const inner = src.split(">", 1)[0].length
    ? src.slice(src.indexOf(">") + 1, src.lastIndexOf("</svg>"))
    : "";
  const viewBox = /viewBox="([^"]+)"/.exec(src)?.[1] ?? "0 0 24 24";
  const painted = inner.replace(/fill="(black|currentColor|#000000|#000)"/g, `fill="${color}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" fill="none"><g opacity="${opacity}">${painted}</g></svg>`;
}

/** Screenshots an SVG onto a transparent canvas at exactly w×h. */
function raster(name, svg, w, h) {
  const page = join(WORK, `${name}.html`);
  writeFileSync(page, `<!doctype html><html><body style="margin:0">${svg}</body></html>`);
  execFileSync(
    CHROME,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--default-background-color=00000000",
      `--window-size=${w},${h}`,
      `--screenshot=${join(OUT, `${name}.png`)}`,
      `file://${page}`,
    ],
    { stdio: "ignore" },
  );
  console.log(`  ${name}.png  ${w}×${h}`);
}

mkdirSync(OUT, { recursive: true });
mkdirSync(WORK, { recursive: true });
console.log("Building email artwork into public/email/");

// Perk-chip icons. Rendered at 4x their 16px display size to stay crisp.
for (const [out, icon] of Object.entries(LUCIDE)) {
  raster(out, await lucideSvg(icon, PLUM, 64), 64, 64);
}

// Oversized sleeping-Apollo watermark for the top-right of the page.
raster(
  "dog-sleeping",
  fileSvg("assets/dog-graphics/sleeping.svg", {
    color: PLUM,
    width: 680,
    height: 592,
    opacity: 0.13,
  }),
  680,
  592,
);

rmSync(WORK, { recursive: true, force: true });
console.log("Done.");
