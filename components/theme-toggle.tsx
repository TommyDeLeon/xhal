"use client";

import { useRef, useSyncExternalStore } from "react";
import { Desktop, Moon, Sun } from "@phosphor-icons/react";

type Mode = "system" | "light" | "dark";

const MODES: { value: Mode; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Desktop },
];

/** The palette lives on <html data-theme>, so that attribute is the store. */
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Mode {
  const value = document.documentElement.dataset.theme;
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "light";
}

/**
 * The server has no DOM and no stored preference, so it renders the default.
 * useSyncExternalStore uses this during hydration and then re-renders with the
 * real value, which is why this does not produce a hydration mismatch the way
 * reading matchMedia during render would.
 */
function getServerSnapshot(): Mode {
  return "light";
}

function apply(next: Mode) {
  const root = document.documentElement;

  // All three modes are explicit attribute values, because the absence of the
  // attribute now means Light -- the default. System still tracks the OS with
  // no listener and no reload: its palette lives inside the
  // prefers-color-scheme block, keyed on [data-theme="system"].
  root.dataset.theme = next;

  try {
    localStorage.setItem("theme", next);
  } catch {
    // Private mode can refuse storage. The choice still holds for this visit.
  }
}

/**
 * Segmented three-option colour mode control: Light, Dark, System.
 *
 * Two sources of truth on purpose, each solving a different timing problem:
 *
 * - The VISUAL selected state comes from CSS keyed on :root[data-theme], so it
 *   is already correct at first paint. The inline script in layout.tsx sets
 *   that attribute before paint, long before React hydrates, so a React-driven
 *   highlight would show the wrong option until hydration finished.
 * - The ARIA state (aria-checked, roving tabIndex) comes from React, because
 *   CSS cannot set attributes. It is one render late at worst, which no
 *   sighted user can perceive and no screen reader reaches sooner.
 *
 * `className` must supply the display value; .theme-switch deliberately does
 * not set one, so a caller can pass `hidden md:inline-flex` without fighting
 * stylesheet order.
 */
export default function ThemeToggle({
  className = "inline-flex",
}: {
  className?: string;
}) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  // Arrow keys move between options, which is what a radiogroup is expected to
  // do. Combined with the roving tabIndex it keeps the group a single tab stop.
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    if (!back && !forward) return;

    event.preventDefault();
    const next = (index + (forward ? 1 : -1) + MODES.length) % MODES.length;
    apply(MODES[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label="Colour mode"
      className={`theme-switch ${className}`}
    >
      {MODES.map(({ value, label, Icon }, index) => (
        <button
          key={value}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="button"
          role="radio"
          aria-checked={mode === value}
          tabIndex={mode === value ? 0 : -1}
          onClick={() => apply(value)}
          onKeyDown={(event) => onKeyDown(event, index)}
          className={`theme-opt theme-opt-${value}`}
        >
          <span className="sr-only">{label}</span>
          <Icon size={17} aria-hidden />
        </button>
      ))}
    </div>
  );
}
