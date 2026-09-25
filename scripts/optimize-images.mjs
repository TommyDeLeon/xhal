/**
 * Build the published portrait and film posters from originals in assets/.
 * Static export has no image optimizer at request time.
 * Run with: npm run images
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import { join, parse } from "node:path";

const outputDir = "public/images";
const posterSourceDir = "assets/posters";
const posterOutputDir = join(outputDir, "posters");

// The portrait can render around 600px wide. Avoid enlarging an already
// adequate source; only small sources benefit from a single resampling pass.
const portraitInput = "assets/tommy.jpg";
const portraitMeta = await sharp(portraitInput).metadata();
const portraitSourceWidth = portraitMeta.width;
if (!portraitSourceWidth) {
  throw new Error(`${portraitInput} has no readable width`);
}
const portraitWidth = portraitSourceWidth < 800
  ? Math.min(Math.round(portraitSourceWidth * 2.5), 1200)
  : Math.min(portraitSourceWidth, 1200);

await mkdir(outputDir, { recursive: true });
let portrait = sharp(portraitInput)
  .rotate()
  .resize({ width: portraitWidth, kernel: "lanczos3" });
if (portraitWidth > portraitSourceWidth) {
  portrait = portrait.sharpen({ sigma: 0.8, m1: 0.5, m2: 2 });
}
await portrait.clone().avif({ quality: 64 }).toFile(join(outputDir, "tommy.avif"));
await portrait.clone().webp({ quality: 80 }).toFile(join(outputDir, "tommy.webp"));
await portrait.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(join(outputDir, "tommy.jpg"));
console.log(`tommy.jpg -> tommy.{avif,webp,jpg} (${portraitWidth}px wide)`);

let posterFiles;
try {
  posterFiles = (await readdir(posterSourceDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
    .map((entry) => entry.name)
    .sort();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  posterFiles = [];
}

if (posterFiles.length === 0) {
  console.log(`No poster PNGs in ${posterSourceDir}/; skipping posters.`);
} else {
  await mkdir(posterOutputDir, { recursive: true });
  for (const file of posterFiles) {
    const stem = parse(file).name;
    const input = join(posterSourceDir, file);
    // Film frames are 16:9. Cover keeps the output exact if a source differs.
    const poster = sharp(input).rotate().resize(1280, 720, { fit: "cover" });
    await poster.clone().avif({ quality: 55 }).toFile(join(posterOutputDir, `${stem}.avif`));
    await poster.clone().webp({ quality: 80 }).toFile(join(posterOutputDir, `${stem}.webp`));
    await poster.clone().jpeg({ quality: 82, progressive: true }).toFile(join(posterOutputDir, `${stem}.jpg`));
    console.log(`${file} -> posters/${stem}.{avif,webp,jpg} (1280x720)`);
  }
}
