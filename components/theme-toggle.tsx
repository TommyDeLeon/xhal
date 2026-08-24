"use client";

import { Moon, Sun } from "@phosphor-icons/react";

/**
 * Explicit override on top of prefers-color-scheme. The stored choice is
 * applied by an inline script in the document head before first paint.
 *
 * There is deliberately no React state here. Which icon shows is decided by CSS
 * from the same signals the palette uses, so the button cannot disagree with
 * the theme and there is nothing to mismatch during hydration.
 */
export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const isDark =
      root.dataset.theme === "dark" ||
      (!root.dataset.theme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;

    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode can refuse storage. The toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:text-accent"
    >
      <span className="sr-only">Switch colour mode</span>
      <span className="icon-when-dark">
        <Sun size={20} aria-hidden />
      </span>
      <span className="icon-when-light">
        <Moon size={20} aria-hidden />
      </span>
    </button>
  );
}