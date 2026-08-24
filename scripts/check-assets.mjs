/**
 * Fails the build if content references an image that is not in public/images.
 *
 * The card markup takes image paths from data, so a typo or a forgotten
 * `npm run images` would otherwise ship a broken image to the live site and
 * only be noticed by a visitor.
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const CONTENT = "content";
const IMAGES = "public/images";

const files = (await readdir(CONTENT)).filter((f) => f.endsWith(".ts"));

let present;
try {
  present = new Set(await readdir(IMAGES));
} catch {
  present = new Set();
}

const missing = [];

for (const file of files) {
  const source = await readFile(join(CONTENT, file), "utf8");
  for (const [, path] of source.matchAll(/["'](\/images\/[^"']+)["']/g)) {
    const name = path.replace("/images/", "");
    if (!present.has(name)) missing.push(`${file}: ${path}`);
  }
}

if (missing.length) {
  console.error("\nMissing images referenced by content:\n");
  for (const m of missing) console.error(`  ${m}`);
  console.error(
    "\nPut the originals in assets/ and run: npm run images\n",
  );
  process.exit(1);
}

console.log(`Assets OK (${present.size} files in ${IMAGES}).`);