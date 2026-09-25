import { existsSync } from "node:fs";
import { expect, test } from "@playwright/test";

const slugs = ["codelock", "tenant101", "mimir"] as const;
// Projects that will have a film. A film appears only once its files are
// published; until then its slot says "Film coming soon" and has no play control.
const plannedFilms = ["codelock", "tenant101"] as const;
const published = (slug: string) => existsSync(`out/films/${slug}/${slug}-landscape-720.mp4`);
const filmSlugs = plannedFilms.filter(published);
const pendingSlugs = plannedFilms.filter((slug) => !published(slug));
const needsFilms = (...needed: string[]) =>
  test.skip(!needed.every(published), `Needs published films: ${needed.join(", ")}`);

test("navigation and feature links point to rendered sections and stories", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  for (const section of ["work", "about", "contact"]) {
    await expect(nav.getByRole("link", { name: new RegExp(`^${section}$`, "i") })).toHaveAttribute("href", `/#${section}`);
    await expect(page.locator(`#${section}`)).toHaveCount(1);
  }

  const features = page.locator("#work article.feature");
  await expect(features).toHaveCount(3);
  for (const slug of slugs) {
    const feature = features.filter({ has: page.locator(`#${slug}-title`) });
    await expect(feature).toHaveCount(1);
    await expect(feature.locator(".film__play")).toHaveCount((filmSlugs as readonly string[]).includes(slug) ? 1 : 0);
    await expect(feature.locator(".media__frame, .film__frame")).toHaveCount(1);
    await expect(feature.locator(`a[href="/work/${slug}/"]`)).toHaveCount(1);
  }
});

test("a film not yet published keeps its slot, says so, and offers no play control", async ({ page }) => {
  await page.goto("/");
  for (const slug of pendingSlugs) {
    const slot = page.locator(`#${slug} .media__frame--slot`);
    await expect(slot).toHaveCount(1);
    await expect(slot).toContainText("Film coming soon");
    await expect(page.locator(`#${slug} .film__play`)).toHaveCount(0);
    const box = await slot.boundingBox();
    expect(box && box.width > 0 && box.height > 0).toBe(true);
  }
  // Every shown image has loaded: no empty frames.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  });
  await expect.poll(() => page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLImageElement>("main img")).filter((img) => !img.complete || img.naturalWidth === 0).length,
  )).toBe(0);
});

test("without JavaScript every section and project is visible", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  for (const slug of slugs) {
    await expect(page.locator(`#${slug} .feature__title`)).toBeVisible();
    await expect(page.locator(`#${slug} .feature__body > *`).first()).toHaveCSS("opacity", "1");
  }
  await expect(page.locator(".about__text p").first()).toHaveCSS("opacity", "1");
  await context.close();
});

test("projects reveal once as they scroll into view", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/\bmotion\b/);
  for (const id of [...slugs, "about", "contact"]) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveClass(/\bis-in\b/);
  }
});

test("films make no media request before click and choose the viewport source", async ({ page, isMobile }) => {
  needsFilms("codelock");
  const filmRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/films/")) filmRequests.push(request.url());
  });
  // Hold the synthetic media response so the player remains mounted for inspection.
  await page.route("**/films/**", () => new Promise<void>(() => {}));
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  expect(filmRequests).toEqual([]);

  await page.locator("#codelock .film__play").click();
  const video = page.locator("#codelock video");
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("src", `/films/codelock/codelock-${isMobile ? "portrait" : "landscape"}-720.mp4`);
  await expect.poll(() => filmRequests.some((url) => url.includes("/films/codelock/"))).toBe(true);
});

test("starting another film pauses the first player", async ({ page }) => {
  needsFilms("codelock", "tenant101");
  await page.route("**/films/**", () => new Promise<void>(() => {}));
  await page.goto("/");
  await page.locator("#codelock .film__play").click();
  const first = page.locator("#codelock video");
  await expect(first).toHaveCount(1);
  // A pending synthetic media response cannot actually play; spy on pause() to
  // verify the cross-player event reaches the first video element.
  await first.evaluate((video) => {
    const player = video as HTMLVideoElement & { pauseCalls: number };
    player.pauseCalls = 0;
    player.pause = () => { player.pauseCalls += 1; };
  });
  await page.locator("#tenant101 .film__play").click();
  await expect(page.locator("#tenant101 video")).toHaveCount(1);
  await expect.poll(() => first.evaluate((video) => (video as HTMLVideoElement & { pauseCalls: number }).pauseCalls)).toBeGreaterThan(0);
});

test("a failed film restores its poster and explains the failure", async ({ page }) => {
  needsFilms("codelock");
  await page.route("**/films/**", (route) => route.fulfill({ status: 404, body: "Not found" }));
  await page.goto("/");
  await page.locator("#codelock .film__play").click();
  await expect(page.locator("#codelock video")).toHaveCount(0);
  await expect(page.locator("#codelock .film__play")).toHaveCount(1);
  await expect(page.locator("#codelock .film__poster")).toBeVisible();
  await expect(page.locator("#codelock .film__error")).toContainText("The film couldn't load.");
});

test("the résumé, stories, 404 page and sitemap are exported", async ({ page, request }) => {
  await page.goto("/");
  const resume = page.locator('a[href$=".pdf"]');
  await expect(resume).toHaveCount(1);
  const pdf = await request.get(await resume.getAttribute("href") ?? "");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");

  for (const slug of slugs) {
    const path = `/work/${slug}/`;
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://tommydeleon.com${path}`);
  }

  const missing = await page.goto("/this-page-does-not-exist/");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "That page isn't here." })).toBeVisible();

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const path of ["/", ...slugs.map((slug) => `/work/${slug}/`)]) {
    expect(xml).toContain(`<loc>https://tommydeleon.com${path}</loc>`);
  }
});

test("saved dark preference does not change the light design", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(248, 247, 242)");
});

test("reduced motion shows everything at rest and adds no motion hooks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero__name")).toHaveCSS("opacity", "1");
  await expect(page.locator("html")).not.toHaveClass(/\bmotion\b/);
  await page.locator("#mimir").scrollIntoViewIfNeeded();
  await expect(page.locator("#mimir .feature__body > *").first()).toHaveCSS("opacity", "1");
});

test("home and stories have no horizontal overflow across supported widths", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", ...slugs.map((slug) => `/work/${slug}/`)]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow, `${path} at ${width}px`).toBe(false);
    }
  }
});

test("keyboard navigation starts at the skip link and reaches every published film button", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  for (const slug of filmSlugs) {
    const button = page.locator(`#${slug} .film__play`);
    await expect(button).toHaveCount(1);
    await expect(button).toHaveJSProperty("tabIndex", 0);
  }
});
