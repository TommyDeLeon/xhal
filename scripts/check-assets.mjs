import { readFile, readdir, access } from "node:fs/promises";
import { join } from "node:path";

const roots = ["content", "components", "app"];
const missing = new Set();
async function sources(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await sources(path));
    else if (/\.(ts|tsx)$/.test(entry.name)) found.push(path);
  }
  return found;
}
async function requirePath(path) {
  try { await access(join("public", path.replace(/^\//, ""))); }
  catch { missing.add(path); }
}
for (const file of (await Promise.all(roots.map(sources))).flat()) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(/["'`](\/(?:images|films)\/[^"'`\s]+\.[a-z0-9]+)["'`]/g)) await requirePath(match[1]);
}
const projectText = await readFile("content/projects.ts", "utf8");
for (const match of projectText.matchAll(/\b(poster|landscape|portrait|descriptions):\s*["']([^"']+)["']/g)) {
  if (match[1] === "poster") for (const ext of ["avif", "webp", "jpg"]) await requirePath(`${match[2]}.${ext}`);
  else await requirePath(match[2]);
}
const siteText = await readFile("content/site.ts", "utf8");
const portrait = siteText.match(/portrait:\s*\{\s*src:\s*["']([^"']+)["']/);
if (portrait) for (const ext of ["avif", "webp", "jpg"]) await requirePath(`${portrait[1]}.${ext}`);
if (missing.size) {
  for (const path of [...missing].sort()) console.error(path);
  process.exit(1);
}
console.log("Assets OK");
