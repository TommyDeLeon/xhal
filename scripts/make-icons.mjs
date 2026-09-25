/** Build the brand masters, transparent exports, site icons, and social card. */
import sharp from "sharp";
import { chromium } from "@playwright/test";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const green = "#174C3C";
const ivory = "#F8F7F2";
const ink = "#1D2924";
const serifFile = path.resolve("brand/fonts/source-serif-4-latin.woff2");
const geistFile = path.resolve("brand/fonts/geist-latin.woff2");
const source = await readFile("components/monogram.tsx", "utf8");
const markPath = source.match(/d="([^"]+)"/)?.[1];
if (!markPath) throw new Error("Monogram path missing from components/monogram.tsx");
let browser;
try {
  // CHROMIUM_PATH lets a machine with a different browser build run this.
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
} catch (error) {
  throw new Error("Playwright Chromium could not launch; icons were not generated. Run `npx playwright install chromium` in an authorized environment if the browser is missing.", { cause: error });
}

function mark(color, background = "", viewBox = "0 0 64 64") {
  const [x, y, width, height] = viewBox.split(" ");
  const ground = background
    ? `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${background}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="64" height="64">
  ${ground}
  <path fill-rule="evenodd" d="${markPath}" fill="${color}"/>
</svg>`;
}

const serifData = (await readFile(serifFile)).toString("base64");
const embeddedFont = `@font-face{font-family:'Source Serif 4';src:url(data:font/woff2;base64,${serifData}) format('woff2');font-weight:200 900;font-style:normal}`;
const word = `<text x="0" y="78" fill="${ink}" font-family="Source Serif 4" font-size="76" font-weight="600" letter-spacing="-0.035em">Tommy De Leon</text>`;
const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" width="650" height="100" viewBox="0 0 650 100">
  <style>${embeddedFont}</style>
  ${word}
</svg>`;
const lockup = `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="100" viewBox="0 0 750 100">
  <style>${embeddedFont}</style>
  <g transform="translate(7 18)">
    <path fill-rule="evenodd" d="${markPath}" fill="${green}"/>
  </g>
  <g transform="translate(91 0)">${word}</g>
</svg>`;

await mkdir("brand/png", { recursive: true });
await mkdir("public", { recursive: true });
for (const [name, svg] of [
  ["monogram.svg", mark(green)],
  ["monogram-ink.svg", mark(ink)],
  ["monogram-reverse.svg", mark(ivory, green)],
  ["wordmark.svg", wordmark],
  ["lockup.svg", lockup],
]) await writeFile(path.join("brand", name), svg);
// Site icons use the reverse lion: ivory on a green square, matching
// brand/monogram-reverse.svg, so the tab icon stands out on any browser theme.
const appMark = mark(ivory, green, "-8 -8 80 80");
await writeFile("public/icon.svg", appMark);

for (const [file, size] of [
  ["icon-32.png", 32],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-touch-icon.png", 180],
]) {
  await writeFile(path.join("public", file), await sharp(Buffer.from(appMark)).resize(size, size).png().toBuffer());
}
// Legacy favicon consumers accept a 32px PNG payload under the .ico name.
await writeFile("public/favicon.ico", await sharp(Buffer.from(appMark)).resize(32, 32).png().toBuffer());

const fontCss = `
@font-face{font-family:Serif;src:url('${pathToFileURL(serifFile).href}') format('woff2');font-weight:200 900}
@font-face{font-family:Geist;src:url('${pathToFileURL(geistFile).href}') format('woff2');font-weight:100 900}
*{box-sizing:border-box}html,body{margin:0}body{background:transparent}`;
const tempHtml = path.resolve("brand/.render.html");
try {
    // A file page lets Chromium load the actual self-hosted font files.
    await writeFile(tempHtml, `<html><style>${fontCss}</style><body></body></html>`);
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(tempHtml).href);

    async function capture(html, width, height, file, scale = 1) {
      await page.setViewportSize({ width: width * scale, height: height * scale });
      await page.evaluate(({ html, width, height, scale }) => {
        document.body.innerHTML = `<div id="capture" style="width:${width}px;height:${height}px;transform:scale(${scale});transform-origin:top left">${html}</div>`;
      }, { html, width, height, scale });
      await page.evaluate(() => document.fonts.ready);
      await page.locator("#capture").screenshot({ path: file, omitBackground: true, scale: "css" });
    }

    const textStyle = `font:600 76px/100px Serif;letter-spacing:-0.035em;color:${ink};white-space:nowrap`;
    await capture(`<div style="${textStyle}">Tommy De Leon</div>`, 650, 100, "brand/png/wordmark@2x.png", 2);
    const lockupHtml = `<div style="display:flex;align-items:center;gap:27px;width:750px;height:100px;padding-left:7px">
      <div style="width:64px;height:64px">${mark(green)}</div>
      <div style="${textStyle}">Tommy De Leon</div>
    </div>`;
    await capture(lockupHtml, 750, 100, "brand/png/lockup@2x.png", 2);
    for (const size of [16, 32, 64, 256]) {
      const markHtml = `<div style="width:${size}px;height:${size}px"><style>svg{width:100%;height:100%}</style>${mark(green)}</div>`;
      await capture(markHtml, size, size, `brand/png/monogram-${size}.png`);
    }

    const ogMark = mark(green).replace('width="64" height="64"', 'width="88" height="88"');
    const og = `<div style="width:1200px;height:630px;background:${ivory};position:relative;padding:112px 80px 68px">
      <div style="font:600 120px/1.08 Serif;letter-spacing:-0.035em;color:${ink}">Tommy De Leon</div>
      <div style="font:400 48px/1.2 Serif;color:${green};margin-top:27px">Useful software. Thoughtfully made.</div>
      <div style="font:500 28px/1.3 Geist;color:${ink};position:absolute;left:80px;bottom:75px">Software developer · tommydeleon.com</div>
      <div style="position:absolute;right:80px;bottom:67px">${ogMark}</div>
    </div>`;
    await capture(og, 1200, 630, "public/og.png");
    await page.close();
} finally {
  await browser.close();
  await rm(tempHtml, { force: true });
}

console.log("brand exports and public icons written");
