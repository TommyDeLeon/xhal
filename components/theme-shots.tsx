"use client";

import { useEffect } from "react";

/**
 * Points the project screenshots at the variant that matches the current
 * theme, before they are lazily fetched.
 *
 * <picture media="(prefers-color-scheme: dark)"> would follow only the OS and
 * would ignore a choice made with the site's own control, so the effective
 * theme is resolved the same way the palette resolves it: an explicit
 * data-theme wins, otherwise the media query decides.
 *
 * The images sit below the fold and are lazy, so in practice the swap happens
 * long before they enter the viewport and only one variant is downloaded.
 */
export default function ThemeShots() {
  useEffect(() => {
    const root = document.documentElement;
    const dark = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const explicit = root.dataset.theme;
      const isDark = explicit ? explicit === "dark" : dark.matches;
      const key = isDark ? "dark" : "light";

      document
        .querySelectorAll<HTMLElement>("[data-shot] source, [data-shot] img")
        .forEach((el) => {
          const next = el.dataset[key];
          if (!next) return;

          if (el instanceof HTMLSourceElement) {
            if (el.srcset !== next) el.srcset = next;
          } else if (el instanceof HTMLImageElement) {
            if (!el.src.endsWith(next)) el.src = next;
          }
        });
    };

    apply();
    dark.addEventListener("change", apply);

    // The toggle writes data-theme on <html>; watch for it rather than
    // coupling this component to the toggle's implementation.
    const observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      dark.removeEventListener("change", apply);
      observer.disconnect();
    };
  }, []);

  return null;
}