/**
 * Builds the published image set from the originals in assets/.
 *
 * Sources live outside public/ so this can never re-process its own output,
 * and so the uncompressed originals are not shipped to visitors.
 *
 * Static export means there is no image optimizer at request time, so this is
 * where compression happens.
 *
 * Run with: npm run images
 */
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { extname, join, basename } from "node:path";

const SRC = "assets";
const OUT = "public/images";
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png"]);

/** Widest anything is displayed, times two for high-density screens. */
const MAX_WIDTH = 1200;

/** How far a small source may be enlarged before it stops being worth it. */
const UPSCALE_LIMIT = 2.5;

/** Square marks that only ever render small. Kept lossless and left alone. */
const MARKS = new Set(["codelock-icon"]);

let files;
try {
  files = await readdir(SRC);
} catch {
  console.log(`No ${SRC} directory. Nothing to do.`);
  process.exit(0);
}

await mkdir(OUT, { recursive: true });

const sources = files.filter((f) => SOURCE_EXT.has(extname(f).toLowerCase()));

if (!sources.length) {
  console.log(`No source images in ${SRC}/. Drop a .jpg or .png in and re-run.`);
  process.exit(0);
}

for (const file of sources) {
  const input = join(SRC, file);
  const stem = basename(file, extname(file));
  const meta = await sharp(input).metadata();

  if (MARKS.has(stem)) {
    const name = stem.replace(/-icon$/, "-mark");
    await sharp(input)
      .resize(128, 128, { kernel: "lanczos3" })
      .png({ compressionLevel: 9 })
      .toFile(join(OUT, `${name}.png`));
    console.log(`${file} -> ${name}.png (128x128)`);
    continue;
  }

  const source = meta.width ?? MAX_WIDTH;

  /*
   * Small sources are enlarged up to UPSCALE_LIMIT. This adds no real detail,
   * but resampling once with lanczos3 and sharpening the result beats letting
   * the browser scale the bitmap at paint time, which is what produces the
   * mushy look. Anything already large is only ever shrunk.
   */
  const width =
    source < MAX_WIDTH
      ? Math.min(Math.round(source * UPSCALE_LIMIT), MAX_WIDTH)
      : MAX_WIDTH;

  let base = sharp(input)
    .rotate()
    .resize({ width, kernel: "lanczos3", withoutEnlargement: false });

  if (width > source) {
    base = base.sharpen({ sigma: 0.8, m1: 0.5, m2: 2 });
  }

  await base.clone().avif({ quality: 64 }).toFile(join(OUT, `${stem}.avif`));
  await base.clone().webp({ quality: 80 }).toFile(join(OUT, `${stem}.webp`));
  await base
    .clone()
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(join(OUT, `${stem}.jpg`));

  const out = await sharp(join(OUT, `${stem}.avif`)).metadata();

  console.log(`\n${file}`);
  console.log(`  source     ${meta.width}x${meta.height}`);
  console.log(`  published  ${out.width}x${out.height}${width > source ? " (upscaled)" : ""}`);
  console.log(`  paste into content/site.ts:`);
  console.log(`    portrait: {`);
  console.log(`      src: "/images/${stem}.jpg",`);
  console.log(`      alt: "Tommy De Leon",`);
  console.log(`      width: ${out.width},`);
  console.log(`      height: ${out.height},`);
  console.log(`    },`);
}