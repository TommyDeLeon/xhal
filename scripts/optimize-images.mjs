/**
 * Build the published portrait and film posters from originals in assets/.
 * Static export has no image optimizer at request time.
 * Run with: npm run images
 */
import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";
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

// Product captures: assets/work/<name>.{png,jpg} -> public/images/work/<name>-<w>.{avif,webp,jpg}
// at a large width and half of it. Landscape captures publish at up to 1440px,
// phone captures at up to 720px. Real sizes go to a manifest the pages read,
// so each image reserves exactly its own space.
const workSourceDir = "assets/work";
const workOutputDir = join(outputDir, "work");
let workFiles = [];
try {
  workFiles = (await readdir(workSourceDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.(png|jpe?g)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (workFiles.length > 0) {
  await mkdir(workOutputDir, { recursive: true });
  const manifest = {};
  for (const file of workFiles) {
    const stem = parse(file).name;
    const input = join(workSourceDir, file);
    const meta = await sharp(input).rotate().metadata();
    const phone = meta.height > meta.width;
    const large = Math.min(meta.width, phone ? 720 : 1440);
    let largeHeight = 0;
    for (const width of [large, Math.round(large / 2)]) {
      const image = sharp(input).rotate().resize({ width, kernel: "lanczos3" });
      await image.clone().avif({ quality: 58 }).toFile(join(workOutputDir, `${stem}-${width}.avif`));
      await image.clone().webp({ quality: 80 }).toFile(join(workOutputDir, `${stem}-${width}.webp`));
      const info = await image.clone().jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(join(workOutputDir, `${stem}-${width}.jpg`));
      if (width === large) largeHeight = info.height;
    }
    manifest[`/images/work/${stem}`] = { width: large, height: largeHeight };
    console.log(`${file} -> work/${stem}-{${large},${Math.round(large / 2)}}.{avif,webp,jpg}`);
  }
  await writeFile("content/work-images.json", `${JSON.stringify(manifest, null, 2)}\n`);
}
