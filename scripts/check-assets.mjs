/**
 * Fails the build when a page would point at a file that is not published.
 *
 * - Every image path in the source, the portrait and each required capture
 *   must exist.
 * - Captures marked `optional: true` and films are used only once their files
 *   exist (lib/media.ts). A film must be complete or absent: a half-copied film
 *   fails here instead of shipping a broken player.
 */
import { readFile, readdir, access } from "node:fs/promises";
import { join } from "node:path";

const roots = ["content", "components", "app"];
const missing = new Set();
const notes = [];

async function sources(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...await sources(path));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      found.push(path);
    }
  }
  return found;
}
async function exists(path) {
  try {
    await access(join("public", path.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}
async function requirePath(path) {
  if (!(await exists(path))) missing.add(path);
}

for (const file of (await Promise.all(roots.map(sources))).flat()) {
  const source = await readFile(file, "utf8");
  // Films and captures are checked below, where their optional rules apply.
  for (const match of source.matchAll(/["'`](\/images\/(?!work\/|posters\/)[^"'`\s]+\.[a-z0-9]+)["'`]/g)) {
    await requirePath(match[1]);
  }
}

const projectText = await readFile("content/projects.ts", "utf8");
let sizes = {};
try {
  sizes = JSON.parse(await readFile("content/work-images.json", "utf8"));
} catch {
  // No captures processed yet; every required capture is reported below.
}

// Captures: `src: "..."` blocks, optional when the same block says `optional: true`.
for (const block of projectText.matchAll(/\{\s*src:\s*"([^"]+)"[\s\S]*?\}/g)) {
  const src = block[1];
  const optional = /optional:\s*true/.test(block[0]);
  const size = sizes[src];
  const files = size
    ? ["avif", "webp", "jpg"].flatMap((ext) => [`${src}-${size.width}.${ext}`, `${src}-${Math.round(size.width / 2)}.${ext}`])
    : [`${src}-<width>.jpg (run npm run images)`];
  const present = size ? await Promise.all(files.map(exists)) : [false];
  if (present.every(Boolean)) continue;
  if (optional && present.every((ok) => !ok)) {
    notes.push(`optional capture not added yet: ${src}`);
    continue;
  }
  files.forEach((file, i) => { if (!present[i]) missing.add(file); });
}

// Films: all or nothing.
for (const film of projectText.matchAll(/film:\s*\{([\s\S]*?)\n    \}/g)) {
  const fields = Object.fromEntries([...film[1].matchAll(/\b(landscape|portrait|poster|descriptions):\s*["']([^"']+)["']/g)].map((m) => [m[1], m[2]]));
  const files = [fields.landscape, fields.portrait, fields.descriptions, ...["avif", "webp", "jpg"].map((ext) => `${fields.poster}.${ext}`)];
  const present = await Promise.all(files.map(exists));
  if (present.every(Boolean)) continue;
  if (present.every((ok) => !ok)) {
    notes.push(`film not published yet, showing its reserved slot: ${fields.landscape}`);
    continue;
  }
  files.forEach((file, i) => { if (!present[i]) missing.add(file); });
}

const siteText = await readFile("content/site.ts", "utf8");
const portrait = siteText.match(/portrait:\s*\{\s*src:\s*["']([^"']+)["']/);
if (portrait) {
  for (const ext of ["avif", "webp", "jpg"]) {
    await requirePath(`${portrait[1]}.${ext}`);
  }
}

for (const note of notes) console.log(`note: ${note}`);
if (missing.size) {
  console.error("Missing published files:");
  for (const path of [...missing].sort()) {
    console.error(path);
  }
  process.exit(1);
}
console.log("Assets OK");
