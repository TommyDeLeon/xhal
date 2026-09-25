import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Film, Project, Shot } from "@/content/projects";

/*
  Build-time media checks for the static export. A film appears only when every
  file it needs is published, so a missing film never leaves a play button that
  cannot play. Shots take their real size from the manifest `npm run images`
  writes, so each one reserves exactly its own space.
*/

const published = (path: string) => existsSync(join(process.cwd(), "public", path.replace(/^\//, "")));

type Sizes = Record<string, { width: number; height: number }>;
let sizes: Sizes | null = null;
function manifest(): Sizes {
  if (!sizes) {
    try {
      sizes = JSON.parse(readFileSync(join(process.cwd(), "content", "work-images.json"), "utf8")) as Sizes;
    } catch {
      sizes = {};
    }
  }
  return sizes;
}

export function filmReady(film: Film | undefined): film is Film {
  if (!film) return false;
  const files = [film.landscape, film.portrait, film.descriptions, ...["avif", "webp", "jpg"].map((ext) => `${film.poster}.${ext}`)];
  return files.every(published);
}

export function readyShots(shots: Shot[]): Shot[] {
  return shots.flatMap((shot) => {
    const size = manifest()[shot.src];
    if (!size || !published(`${shot.src}-${size.width}.jpg`)) return [];
    return [{ ...shot, ...size }];
  });
}

export type ProjectMedia = { film: Film | null; shots: Shot[] };

export function mediaFor(project: Project): ProjectMedia {
  return { film: filmReady(project.film) ? project.film : null, shots: readyShots(project.shots) };
}
