"use client";

import { Desktop, Moon, Sun } from "@phosphor-icons/react";

/**
 * Three-state colour mode control: System, Light, Dark.
 *
 * There is deliberately no React state. Which icon and which accessible label
 * are shown is decided by CSS from the same data-theme attribute the palette
 * reads, so the control cannot disagree with the theme and there is nothing to
 * mismatch during hydration.
 *
 * System is represented by the ABSENCE of data-theme, which is what lets the
 * prefers-color-scheme media query stay live: changing the OS setting
 * repaints immediately with no listener and no reload.
 */
type Mode = "system" | "light" | "dark";

const NEXT: Record<Mode, Mode> = {
  system: "light",
  light: "dark",
  dark: "system",
};

export default function ThemeToggle() {
  function cycle() {
    const root = document.documentElement;
    const current = (root.dataset.theme as Mode) || "system";
    const next = NEXT[current];

    if (next === "system") {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = next;
    }

    try {
      if (next === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch {
      // Private mode can refuse storage. The control still works this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:text-accent"
    >
      {/* All three labels are in the markup; CSS reveals the one that matches
          the current setting. display:none removes the others from the
          accessibility tree, so only the true state is announced. */}
      <span className="sr-only theme-label-system">
        Colour mode: system. Activate to switch to light.
      </span>
      <span className="sr-only theme-label-light">
        Colour mode: light. Activate to switch to dark.
      </span>
      <span className="sr-only theme-label-dark">
        Colour mode: dark. Activate to switch to system.
      </span>

      <span className="theme-icon-system">
        <Desktop size={20} aria-hidden />
      </span>
      <span className="theme-icon-light">
        <Sun size={20} aria-hidden />
      </span>
      <span className="theme-icon-dark">
        <Moon size={20} aria-hidden />
      </span>
    </button>
  );
}