/**
 * Fails the build if the source references an image that is not in
 * public/images.
 *
 * Most image paths come from data, so a typo or a forgotten `npm run images`
 * would otherwise ship a broken image to the live site and only be noticed by
 * a visitor.
 *
 * It scans components and routes as well as content, because not every path is
 * data: components/story.tsx names the portrait's AVIF and WebP variants
 * inline, and those were invisible to this check while it read content/ alone.
 *
 * It also expands each screenshot into the six files it really needs -- see
 * SHOTS below. Between them those two changes take the check from 9 of the 34
 * published images to all 34, which matters because a guard that silently
 * covers a quarter of the paths is worse than no guard: it is trusted for the
 * rest.
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const ROOTS = ["content", "components", "app"];
const IMAGES = "public/images";
const SOURCE_EXT = /\.(ts|tsx)$/;

/**
 * Where the themed screenshots are declared.
 *
 * A shot is written down once, as a .jpg, and five more filenames are derived
 * from it at runtime -- components/shot-lightbox.tsx builds the AVIF and WebP
 * sources and the -light triple by string substitution, so those names appear
 * in no source file and a literal scan cannot see them. Nine of the thirty-four
 * published images were literals; the other twenty-five were invisible here,
 * which meant a forgotten `npm run images` after adding a screenshot passed
 * this check on the strength of the one .jpg and 404ed every other variant.
 *
 * Scoped to this file rather than applied to every .jpg, because the portrait
 * is not a themed shot: it has no -light sibling, and demanding one would fail
 * the build for a file that is correct.
 */
const SHOTS = join("content", "projects.ts");
const FORMATS = ["jpg", "avif", "webp"];

/** The six files one `/images/<name>.jpg` shot reference actually requires. */
function shotVariants(name) {
  const base = name.replace(/\.jpg$/, "");
  return FORMATS.flatMap((ext) => [`${base}.${ext}`, `${base}-light.${ext}`]);
}

/** Every source file under a root, at any depth. */
async function sources(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await sources(path)));
    else if (SOURCE_EXT.test(entry.name)) found.push(path);
  }
  return found;
}

const files = (await Promise.all(ROOTS.map(sources))).flat();

let present;
try {
  present = new Set(await readdir(IMAGES));
} catch {
  present = new Set();
}

/* A Set, because one shot is referenced more than once -- as the lead plate and
   again in the section that discusses it -- and reporting the same absent file
   twice reads like two problems. */
const missing = new Set();

for (const file of files) {
  const source = await readFile(file, "utf8");
  for (const [, path] of source.matchAll(/["'](\/images\/[^"']+)["']/g)) {
    const name = path.replace("/images/", "");
    const required =
      file === SHOTS && name.endsWith(".jpg") ? shotVariants(name) : [name];

    for (const variant of required) {
      if (!present.has(variant)) missing.add(`${file}: /images/${variant}`);
    }
  }
}

if (missing.size) {
  console.error("\nMissing images referenced by the source:\n");
  for (const m of missing) console.error(`  ${m}`);
  console.error(
    "\nPut the originals in assets/ and run: npm run images\n",
  );
  process.exit(1);
}

console.log(`Assets OK (${present.size} files in ${IMAGES}).`);