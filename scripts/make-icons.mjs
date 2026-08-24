/**
 * Generates the favicon set and the Open Graph card from one vector source.
 * Run with: node scripts/make-icons.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const BG = "#0a0b0d";
const ACCENT = "#f5a524";
const TEXT = "#edeef0";
const MUTED = "#9ba1ac";

/** Mark: three nodes on a segmented link. A network, cut into zones. */
const mark = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BG}"/>
  <path d="M16 32 H48" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 6"/>
  <circle cx="16" cy="32" r="6" fill="${ACCENT}"/>
  <circle cx="32" cy="32" r="4.5" fill="${BG}" stroke="${ACCENT}" stroke-width="3"/>
  <circle cx="48" cy="32" r="6" fill="${ACCENT}"/>
</svg>`;

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <path d="M80 250 H240" stroke="${ACCENT}" stroke-width="4" stroke-linecap="round" stroke-dasharray="14 9"/>
  <circle cx="80" cy="250" r="9" fill="${ACCENT}"/>
  <circle cx="240" cy="250" r="9" fill="${ACCENT}"/>
  <text x="80" y="360" fill="${TEXT}" font-family="Helvetica, Arial, sans-serif" font-size="76" font-weight="600" letter-spacing="-2">Tommy De Leon</text>
  <text x="80" y="424" fill="${ACCENT}" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="500">Networks, Security &amp; Software</text>
  <text x="80" y="486" fill="${MUTED}" font-family="Helvetica, Arial, sans-serif" font-size="27">Electronics Engineering student, training toward network and security work.</text>
</svg>`;

await mkdir("public", { recursive: true });

const png = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

await writeFile("public/icon-32.png", await png(mark(32), 32));
await writeFile("public/icon-192.png", await png(mark(192), 192));
await writeFile("public/icon-512.png", await png(mark(512), 512));
await writeFile("public/apple-touch-icon.png", await png(mark(180), 180));

// .ico: a 32px PNG payload is accepted by every browser that still asks for it.
await writeFile("public/favicon.ico", await png(mark(32), 32));

await writeFile(
  "public/og.png",
  await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toBuffer(),
);

console.log("icons + og written to public/");
