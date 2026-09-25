/** Local raster fallback when the sandbox cannot start Chromium. */
import sharp from "sharp";
import fontkit from "next/dist/compiled/@next/font/dist/fontkit/index.js";
import { readFile, writeFile } from "node:fs/promises";

const serifFile = await readFile("brand/fonts/source-serif-4-latin.woff2");
const geistFile = await readFile("brand/fonts/geist-latin.woff2");
const serif = fontkit.default(serifFile);
const geist = fontkit.default(geistFile);
const mark = await readFile("brand/monogram.svg", "utf8");
const markPath = mark.match(/<path d="([^"]+)"/)?.[1];
if (!markPath) throw new Error("Brand monogram path missing");

function outlinedText(value, font, size, x, baseline, color, tracking = 0) {
  const run = font.layout(value);
  const scale = size / font.unitsPerEm;
  let advance = 0;
  const glyphs = run.glyphs.map((glyph, index) => {
    const position = run.positions[index];
    const at = x + advance + position.xOffset * scale;
    advance += position.xAdvance * scale + tracking;
    return `<path d="${glyph.path.toSVG()}" transform="translate(${at} ${baseline - position.yOffset * scale}) scale(${scale} ${-scale})"/>`;
  });
  return `<g fill="${color}">${glyphs.join("")}</g>`;
}

const title = serif;
const body = serif;
const label = geist;
const word = outlinedText("Tommy De Leon", title, 76, 0, 78, "#1D2924", -2.66);
const svg = (width, height, content) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`;
const mono = (x, y, size) => `<path d="${markPath}" fill="none" stroke="#174C3C" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(${x} ${y}) scale(${size / 64})"/>`;

async function save(file, width, height, content, scale = 1) {
  const input = Buffer.from(svg(width, height, content));
  await writeFile(file, await sharp(input).resize(width * scale, height * scale).png().toBuffer());
}

await save("brand/png/wordmark@2x.png", 650, 100, word, 2);
await save("brand/png/lockup@2x.png", 750, 100, mono(7, 18, 64) + `<g transform="translate(91 0)">${word}</g>`, 2);
for (const size of [16, 32, 64, 256]) {
  await save(`brand/png/monogram-${size}.png`, 64, 64, mono(0, 0, 64), size / 64);
}
const og = `
  <rect width="1200" height="630" fill="#F8F7F2"/>
  <rect width="1200" height="6" fill="#174C3C"/>
  ${outlinedText("Tommy De Leon", title, 120, 80, 252, "#1D2924", -4.2)}
  ${outlinedText("Useful software. Thoughtfully made.", body, 48, 80, 342, "#174C3C")}
  ${outlinedText("Software developer · tommydeleon.com", label, 28, 80, 542, "#1D2924")}
  ${mono(1032, 475, 88)}`;
await save("public/og.png", 1200, 630, og);
console.warn("Chromium was blocked; brand PNGs and og.png use Sharp and the fonts' default outline weights. Rerun npm run icons where Playwright can launch for the specified text weights.");
