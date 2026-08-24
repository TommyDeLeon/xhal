/**
 * Converts every source image in public/images/ to AVIF and WebP alongside a
 * compressed original, and prints the intrinsic dimensions to paste into
 * content/site.ts.
 *
 * Static export means there is no Next image optimizer at request time, so this
 * is where compression happens.
 *
 * Run with: npm run images
 */
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { extname, join, basename } from "node:path";

const DIR = "public/images";
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png"]);

/** Widest the portrait is ever displayed, times two for high-density screens. */
const MAX_WIDTH = 1200;

let files;
try {
  files = await readdir(DIR);
} catch {
  console.log(`No ${DIR} directory yet. Nothing to do.`);
  process.exit(0);
}

const sources = files.filter((f) => SOURCE_EXT.has(extname(f).toLowerCase()));

if (!sources.length) {
  console.log(`No source images in ${DIR}. Drop a .jpg or .png in and re-run.`);
  process.exit(0);
}

for (const file of sources) {
  const input = join(DIR, file);
  const stem = basename(file, extname(file));

  const meta = await sharp(input).metadata();
  const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);

  const base = sharp(input).rotate().resize({ width, withoutEnlargement: true });

  await base.clone().avif({ quality: 62 }).toFile(join(DIR, `${stem}.avif`));
  await base.clone().webp({ quality: 78 }).toFile(join(DIR, `${stem}.webp`));
  await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(join(DIR, `${stem}.opt.jpg`));

  const out = await sharp(join(DIR, `${stem}.avif`)).metadata();

  console.log(`\n${file}`);
  console.log(`  source     ${meta.width}x${meta.height}`);
  console.log(`  written    ${stem}.avif, ${stem}.webp, ${stem}.opt.jpg`);
  console.log(`  paste into content/site.ts:`);
  console.log(`    portrait: {`);
  console.log(`      src: "/images/${stem}.opt.jpg",`);
  console.log(`      alt: "Tommy De Leon",`);
  console.log(`      width: ${out.width},`);
  console.log(`      height: ${out.height},`);
  console.log(`    },`);
}