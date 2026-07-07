import { chromium } from "playwright";
const OUT = "/private/tmp/claude-501/-Users-jonathanchiang-Desktop-Vibes-Apollo-Sports/6672fa02-2778-49c9-94cd-ac543478dc6a/scratchpad";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 1440, height: 820 }, deviceScaleFactor: 2 });
const p = await c.newPage(); await p.goto("http://localhost:4123", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${OUT}/court-pb.png` });
await p.waitForTimeout(4200); // let it cross-fade to badminton
await p.screenshot({ path: `${OUT}/court-bad.png` });
await b.close(); console.log("done");
