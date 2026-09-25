# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site.spec.ts >> films make no media request before click and choose the viewport source
- Location: tests\e2e\site.spec.ts:23:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2]:
    - /url: "#main"
  - banner [ref=e3]:
    - link "Tommy De Leon, home" [ref=e4]:
      - /url: /
      - generic [ref=e7]: Tommy De Leon
    - navigation "Main" [ref=e8]:
      - list [ref=e9]:
        - listitem [ref=e10]:
          - link "Work" [ref=e11]:
            - /url: /#work
        - listitem [ref=e12]:
          - link "About" [ref=e13]:
            - /url: /#about
        - listitem [ref=e14]:
          - link "Contact" [ref=e15]:
            - /url: /#contact
  - main [ref=e16]:
    - region [ref=e17]:
      - heading "Tommy De Leon" [level=1] [ref=e18]
      - separator [ref=e19]
      - generic [ref=e20]:
        - paragraph [ref=e21]: Useful software. Thoughtfully made.
        - generic [ref=e22]:
          - paragraph [ref=e23]: I'm Tommy, a software developer building practical tools for everyday problems, and showing what I've actually checked.
          - link "Explore my work" [ref=e24]:
            - /url: "#work"
    - region [ref=e27]:
      - heading "Selected work" [level=2] [ref=e28]
      - article [ref=e29]:
        - heading "CodeLock" [level=3] [ref=e30]
        - paragraph [ref=e31]: "A focus timer for Windows that you have to earn your way out of: when time runs out, a coding problem stands between you and your screen."
        - generic [ref=e32]:
          - generic [ref=e33]:
            - term [ref=e34]: My part
            - definition [ref=e35]: Solo project. I designed, built and tested it.
          - generic [ref=e36]:
            - term [ref=e37]: Status
            - definition [ref=e38]: A personal tool, not released. Only the Windows desktop app enforces the lock.
        - figure "Recorded in a browser against a local test server. The desktop app is what locks Windows." [ref=e39]:
          - button "Play the CodeLock film, 24 seconds" [ref=e41] [cursor=pointer]:
            - text: Play film
            - generic [ref=e44]: 0:24
          - status [ref=e46]: The film couldn't load. The project story describes what it shows.
        - link "Read the CodeLock story" [ref=e47]:
          - /url: /work/codelock/
      - article [ref=e50]:
        - heading "Tenant101" [level=3] [ref=e51]
        - paragraph [ref=e52]: Rent records for landlords and tenants in the Philippines that show, on a phone, who has paid and what's still owed.
        - generic [ref=e53]:
          - generic [ref=e54]:
            - term [ref=e55]: My part
            - definition [ref=e56]: Team project. I built most of the application, guided by my mentor, who owns the product.
          - generic [ref=e57]:
            - term [ref=e58]: Status
            - definition [ref=e59]: In development. Not yet launched; shown here with demo data only.
        - figure "Demo data. Real screens from a local test copy; waits between steps are shortened." [ref=e60]:
          - button "Play the Tenant101 film, 24 seconds" [ref=e62] [cursor=pointer]:
            - text: Play film
            - generic [ref=e65]: 0:24
        - link "Read the Tenant101 story" [ref=e67]:
          - /url: /work/tenant101/
      - article [ref=e70]:
        - heading "Mimir" [level=3] [ref=e71]
        - paragraph [ref=e72]: A personal desktop assistant for Windows that explains what you're working on, right beside it.
        - generic [ref=e73]:
          - generic [ref=e74]:
            - term [ref=e75]: My part
            - definition [ref=e76]: Solo project. I designed, built and tested it.
          - generic [ref=e77]:
            - term [ref=e78]: Status
            - definition [ref=e79]: In development for my own use. Several parts are not yet tested on real hardware.
        - figure "Real app on my laptop with a synthetic example. The wait for the answer is shortened." [ref=e80]:
          - button "Play the Mimir film, 24 seconds" [ref=e82] [cursor=pointer]:
            - text: Play film
            - generic [ref=e85]: 0:24
        - link "Read the Mimir story" [ref=e87]:
          - /url: /work/mimir/
    - region [ref=e90]:
      - heading "About" [level=2] [ref=e91]
      - generic [ref=e92]:
        - figure [ref=e93]:
          - img "Tommy De Leon at a harbour railing, with a city skyline and water behind him." [ref=e95]
        - generic [ref=e96]:
          - paragraph [ref=e97]: "I'm a software developer and an Electronics Engineering student. I like the small frustrations that interrupt everyday work: I turn them into software, test the parts that matter, and keep improving what people actually use."
          - paragraph [ref=e98]: Alongside building, I'm learning networks and security, where my engineering studies and my software meet.
          - paragraph [ref=e99]: "I'm open to junior software and web roles, and to freelance work: web apps and dashboards, internal tools, websites and desktop utilities."
          - link "View my résumé (PDF)" [ref=e100]:
            - /url: /DeLeon_Tommy_Resume.pdf
            - text: View my résumé
            - generic [ref=e101]: (PDF)
    - region [ref=e102]:
      - heading "Contact" [level=2] [ref=e103]
      - paragraph [ref=e104]: Have a role, a project or a problem worth solving? Email me and I'll reply personally.
      - link "tommydeleon104@gmail.com" [ref=e105]:
        - /url: mailto:tommydeleon104@gmail.com
      - list [ref=e106]:
        - listitem [ref=e107]:
          - link "LinkedIn (opens in a new tab)" [ref=e108]:
            - /url: https://www.linkedin.com/in/tommydeleon/
            - text: LinkedIn
            - generic [ref=e109]: (opens in a new tab)
        - listitem [ref=e110]:
          - link "GitHub (opens in a new tab)" [ref=e111]:
            - /url: https://github.com/TommyDeLeon
            - text: GitHub
            - generic [ref=e112]: (opens in a new tab)
  - contentinfo [ref=e115]:
    - paragraph [ref=e116]: © 2026 Tommy De Leon
    - link "Back to top" [ref=e117]:
      - /url: "#main"
  - alert [ref=e118]
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | const slugs = ["codelock", "tenant101", "mimir"] as const;
  4   | 
  5   | test("navigation and feature links point to rendered sections and stories", async ({ page }) => {
  6   |   await page.goto("/");
  7   |   const nav = page.getByRole("navigation", { name: "Main" });
  8   |   for (const section of ["work", "about", "contact"]) {
  9   |     await expect(nav.getByRole("link", { name: new RegExp(`^${section}$`, "i") })).toHaveAttribute("href", `/#${section}`);
  10  |     await expect(page.locator(`#${section}`)).toHaveCount(1);
  11  |   }
  12  | 
  13  |   const features = page.locator("#work article.feature");
  14  |   await expect(features).toHaveCount(3);
  15  |   for (const slug of slugs) {
  16  |     const feature = features.filter({ has: page.locator(`#${slug}-title`) });
  17  |     await expect(feature).toHaveCount(1);
  18  |     await expect(feature.locator(".film__play")).toHaveCount(1);
  19  |     await expect(feature.locator(`a[href="/work/${slug}/"]`)).toHaveCount(1);
  20  |   }
  21  | });
  22  | 
  23  | test("films make no media request before click and choose the viewport source", async ({ page, isMobile }) => {
  24  |   const filmRequests: string[] = [];
  25  |   page.on("request", (request) => {
  26  |     if (new URL(request.url()).pathname.startsWith("/films/")) filmRequests.push(request.url());
  27  |   });
  28  |   // Hold the synthetic media response so the player remains mounted for inspection.
  29  |   await page.route("**/films/**", () => new Promise<void>(() => {}));
  30  |   await page.goto("/");
  31  |   await expect(page.locator("video")).toHaveCount(0);
  32  |   expect(filmRequests).toEqual([]);
  33  | 
  34  |   await page.locator("#codelock .film__play").click();
  35  |   const video = page.locator("#codelock video");
  36  |   await expect(video).toHaveCount(1);
  37  |   await expect(video).toHaveAttribute("controls", "");
  38  |   await expect(video).toHaveAttribute("src", `/films/codelock/codelock-${isMobile ? "portrait" : "landscape"}-720.mp4`);
> 39  |   await expect.poll(() => filmRequests.some((url) => url.includes("/films/codelock/"))).toBe(true);
      |                                                                                         ^ Error: expect(received).toBe(expected) // Object.is equality
  40  | });
  41  | 
  42  | test("starting another film pauses the first player", async ({ page }) => {
  43  |   await page.route("**/films/**", () => new Promise<void>(() => {}));
  44  |   await page.goto("/");
  45  |   await page.locator("#codelock .film__play").click();
  46  |   const first = page.locator("#codelock video");
  47  |   await expect(first).toHaveCount(1);
  48  |   // A pending synthetic media response cannot actually play; spy on pause() to
  49  |   // verify the cross-player event reaches the first video element.
  50  |   await first.evaluate((video) => {
  51  |     const player = video as HTMLVideoElement & { pauseCalls: number };
  52  |     player.pauseCalls = 0;
  53  |     player.pause = () => { player.pauseCalls += 1; };
  54  |   });
  55  |   await page.locator("#tenant101 .film__play").click();
  56  |   await expect(page.locator("#tenant101 video")).toHaveCount(1);
  57  |   await expect.poll(() => first.evaluate((video) => (video as HTMLVideoElement & { pauseCalls: number }).pauseCalls)).toBeGreaterThan(0);
  58  | });
  59  | 
  60  | test("a failed film restores its poster and explains the failure", async ({ page }) => {
  61  |   await page.route("**/films/**", (route) => route.fulfill({ status: 404, body: "Not found" }));
  62  |   await page.goto("/");
  63  |   await page.locator("#codelock .film__play").click();
  64  |   await expect(page.locator("#codelock video")).toHaveCount(0);
  65  |   await expect(page.locator("#codelock .film__play")).toHaveCount(1);
  66  |   await expect(page.locator("#codelock .film__poster")).toBeVisible();
  67  |   await expect(page.locator("#codelock .film__error")).toContainText("The film couldn't load.");
  68  | });
  69  | 
  70  | test("the résumé, stories, 404 page and sitemap are exported", async ({ page, request }) => {
  71  |   await page.goto("/");
  72  |   const resume = page.locator('a[href$=".pdf"]');
  73  |   await expect(resume).toHaveCount(1);
  74  |   const pdf = await request.get(await resume.getAttribute("href") ?? "");
  75  |   expect(pdf.status()).toBe(200);
  76  |   expect(pdf.headers()["content-type"]).toContain("application/pdf");
  77  | 
  78  |   for (const slug of slugs) {
  79  |     const path = `/work/${slug}/`;
  80  |     const response = await page.goto(path);
  81  |     expect(response?.status()).toBe(200);
  82  |     await expect(page.locator("h1")).toHaveCount(1);
  83  |     await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://tommydeleon.com${path}`);
  84  |   }
  85  | 
  86  |   const missing = await page.goto("/this-page-does-not-exist/");
  87  |   expect(missing?.status()).toBe(404);
  88  |   await expect(page.getByRole("heading", { name: "That page isn't here." })).toBeVisible();
  89  | 
  90  |   const sitemap = await request.get("/sitemap.xml");
  91  |   expect(sitemap.status()).toBe(200);
  92  |   const xml = await sitemap.text();
  93  |   for (const path of ["/", ...slugs.map((slug) => `/work/${slug}/`)]) {
  94  |     expect(xml).toContain(`<loc>https://tommydeleon.com${path}</loc>`);
  95  |   }
  96  | });
  97  | 
  98  | test("saved dark preference does not change the light design", async ({ page }) => {
  99  |   await page.emulateMedia({ colorScheme: "dark" });
  100 |   await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  101 |   await page.goto("/");
  102 |   await expect(page.locator("body")).toHaveCSS("background-color", "rgb(248, 247, 242)");
  103 | });
  104 | 
  105 | test("reduced motion keeps the masthead visible", async ({ page }) => {
  106 |   await page.emulateMedia({ reducedMotion: "reduce" });
  107 |   await page.goto("/");
  108 |   await expect(page.locator(".masthead__name")).toHaveCSS("opacity", "1");
  109 | });
  110 | 
  111 | test("home and stories have no horizontal overflow across supported widths", async ({ page }) => {
  112 |   for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  113 |     await page.setViewportSize({ width, height: 900 });
  114 |     for (const path of ["/", ...slugs.map((slug) => `/work/${slug}/`)]) {
  115 |       await page.goto(path);
  116 |       const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  117 |       expect(overflow, `${path} at ${width}px`).toBe(false);
  118 |     }
  119 |   }
  120 | });
  121 | 
  122 | test("keyboard navigation starts at the skip link and reaches every film button", async ({ page }) => {
  123 |   await page.goto("/");
  124 |   await page.keyboard.press("Tab");
  125 |   await expect(page.locator(".skip-link")).toBeFocused();
  126 |   for (const slug of slugs) {
  127 |     const button = page.locator(`#${slug} .film__play`);
  128 |     await expect(button).toHaveCount(1);
  129 |     await expect(button).toHaveJSProperty("tabIndex", 0);
  130 |   }
  131 | });
  132 | 
```