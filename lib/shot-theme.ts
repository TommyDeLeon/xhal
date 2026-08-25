/**
 * How a screenshot decides which theme variant it is.
 *
 * The rule lives here rather than in either consumer because there are two of
 * them and they must never disagree:
 *
 *   - ThemeShots mutates the server-rendered <picture> elements in place. It
 *     has to, because React does not own that markup and re-rendering it would
 *     risk a second fetch of a 1600px capture.
 *   - The lightbox is client-only and mounts on open, so it just reads the
 *     value and renders the right srcSet directly.
 *
 * Two applications, one rule. <picture media="(prefers-color-scheme: dark)">
 * cannot be the rule, because it follows only the OS and would ignore a choice
 * made with the site's own three-state control.
 */

export type ShotTheme = "dark" | "light";

/**
 * An explicit data-theme wins; otherwise the OS decides. Exactly the order the
 * palette in globals.css resolves in, so the images can never disagree with the
 * colours around them.
 */
export function resolveShotTheme(): ShotTheme {
  if (typeof document === "undefined") return "dark";

  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark" || explicit === "light") return explicit;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Calls `onChange` whenever the effective theme could have changed: the OS
 * preference flipping, or the site's own control writing data-theme on <html>.
 * Watching the attribute rather than importing from the toggle keeps this
 * decoupled from how the toggle happens to be built.
 *
 * Returns its own teardown.
 */
export function watchShotTheme(onChange: () => void): () => void {
  const root = document.documentElement;
  const dark = window.matchMedia("(prefers-color-scheme: dark)");

  dark.addEventListener("change", onChange);

  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  return () => {
    dark.removeEventListener("change", onChange);
    observer.disconnect();
  };
}
