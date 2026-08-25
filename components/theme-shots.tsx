"use client";

import { useEffect } from "react";
import { resolveShotTheme, watchShotTheme } from "@/lib/shot-theme";

/**
 * Points the server-rendered project screenshots at the variant that matches
 * the current theme, before they are lazily fetched.
 *
 * The theme rule itself lives in lib/shot-theme so the lightbox resolves it the
 * same way; this component only applies it to markup React does not own.
 *
 * The images sit below the fold and are lazy, so in practice the swap happens
 * long before they enter the viewport and only one variant is downloaded.
 */
export default function ThemeShots() {
  useEffect(() => {
    const apply = () => {
      const key = resolveShotTheme();

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
    return watchShotTheme(apply);
  }, []);

  return null;
}
