"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassPlus, X } from "@phosphor-icons/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { resolveShotTheme, watchShotTheme } from "@/lib/shot-theme";
import type { Project } from "@/content/projects";

type Shot = Project["media"][number];

const light = (src: string, ext: string) =>
  src.replace(/\.jpg$/, `-light.${ext}`);
const dark = (src: string, ext: string) => src.replace(/\.jpg$/, `.${ext}`);

/**
 * The full-bleed view.
 *
 * Mounts only once the dialog is open, which is why it can read the theme
 * synchronously in a lazy initialiser without risking a hydration mismatch:
 * this subtree does not exist during SSR or on first client render.
 *
 * The capture is 1600x1000 of dense mono text. width/height are declared so the
 * browser reserves the box from the first layout pass -- the dialog is portaled
 * and opens on interaction, so it cannot shift the page, but an unsized image
 * would still shift the dialog's own contents around it.
 */
function ShotFull({ shot }: { shot: Shot }) {
  const [theme, setTheme] = useState(resolveShotTheme);

  // The theme can change while the lightbox is open -- the switch is reachable
  // from the mobile menu, and the OS can flip underneath it.
  useEffect(() => watchShotTheme(() => setTheme(resolveShotTheme())), []);

  const src = theme === "dark" ? shot.src : light(shot.src, "jpg");

  return (
    <picture>
      <source
        srcSet={
          theme === "dark" ? dark(shot.src, "avif") : light(shot.src, "avif")
        }
        type="image/avif"
      />
      <source
        srcSet={
          theme === "dark" ? dark(shot.src, "webp") : light(shot.src, "webp")
        }
        type="image/webp"
      />
      <img
        src={src}
        /* The same alt as the inline figure. The full-size view is the same
           picture, so describing it differently would be describing it wrong. */
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        decoding="async"
        className="block h-auto max-h-[calc(92vh-5rem)] w-full object-contain"
      />
    </picture>
  );
}

/**
 * A screenshot, and the lightbox that opens it.
 *
 * Why this exists at all: the captures are 1600x1000 of dense mono text and
 * render around 350px wide on a phone, where the numbers that carry their whole
 * meaning are unreadable. Tapping one should show it properly.
 *
 * The trigger is a real button wrapping only the <picture>. It deliberately
 * does not wrap the <figure>: a button may only contain phrasing content, and
 * a <figure> inside one is invalid markup that assistive tech reads badly.
 *
 * Focus trap, ESC, focus return and scroll lock all come from Radix here. The
 * hand-rolled equivalents in the mobile nav are left exactly as they are --
 * that code is verified and this dialog is not a reason to disturb it.
 */
export default function ShotFigure({ shot }: { shot: Shot }) {
  const [open, setOpen] = useState(false);

  /**
   * Warm the full-size capture before it is asked for.
   *
   * Measured: opening the lightbox costs about 200ms INP at 4x CPU throttle,
   * of which ~37ms is presentation -- the browser fetching and decoding a
   * 1600x1000 image inside the click. Starting that work on hover or focus
   * moves it out of the interaction, where it counts against INP, and into
   * idle time before it, where it does not.
   *
   * Deliberately cheap and fire-and-forget: no state, no re-render, and the
   * browser cache dedupes it against the real request. Touch devices get no
   * pointerenter, so they simply keep the current behaviour rather than
   * paying for a preload that may never be used.
   */
  const warm = () => {
    const theme = resolveShotTheme();
    const img = new Image();
    img.src =
      theme === "dark" ? dark(shot.src, "avif") : light(shot.src, "avif");
  };

  return (
    <figure
      data-shot
      className="overflow-hidden rounded-panel border border-hairline bg-bg-raised"
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            /* group/shot rather than group: these figures sit inside the
               project card, which already uses `group` for its own hover. */
            onPointerEnter={warm}
            onFocus={warm}
            className="group/shot relative block w-full cursor-zoom-in"
            /* The caption, not the alt. A name is announced in full every
               time focus lands on the control, with no way to skip it, and
               these alts are paragraph-length prose. The full description is
               still available: the image inside keeps its alt, and the dialog
               it opens is titled with the same caption. */
            aria-label={`View full size: ${shot.caption}`}
          >
            <picture>
              <source
                data-dark={dark(shot.src, "avif")}
                data-light={light(shot.src, "avif")}
                srcSet={dark(shot.src, "avif")}
                type="image/avif"
              />
              <source
                data-dark={dark(shot.src, "webp")}
                data-light={light(shot.src, "webp")}
                srcSet={dark(shot.src, "webp")}
                type="image/webp"
              />
              {/* Pre-compressed at build time: static export has no image
                  optimizer at request time. */}
              <img
                data-dark={shot.src}
                data-light={light(shot.src, "jpg")}
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                loading="lazy"
                decoding="async"
                className="block w-full"
              />
            </picture>

            {/* Affordance. Opacity only, and it appears on keyboard focus as
                well as hover so the control is not mouse-only. */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-bg text-text opacity-0 transition-opacity duration-200 group-hover/shot:opacity-100 group-focus-visible/shot:opacity-100"
            >
              <MagnifyingGlassPlus size={16} />
            </span>
          </button>
        </DialogTrigger>

        {/*
            showCloseButton={false} because the close control is laid out as a
            real flex item in the header row below rather than absolutely
            positioned over the panel. Absolute placement cannot stay centred
            in a strip whose height changes when a long caption wraps -- it sat
            proud of the header and crossed the border into the image.
        */}
        <DialogContent
          showCloseButton={false}
          className="max-w-[min(96rem,calc(100vw-1.5rem))] p-0"
        >
          <div className="flex items-center justify-between gap-3 border-b border-hairline py-2 pr-2 pl-5">
            <DialogTitle className="text-sm font-medium">
              {shot.caption}
            </DialogTitle>

            <DialogClose className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-bg text-text transition-colors hover:border-accent hover:text-accent">
              <X size={18} aria-hidden />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          <div className="overflow-auto p-3">
            {/* Guarded as well as portaled: ShotFull reads the DOM in a lazy
                initialiser, so it must never be evaluated while closed. */}
            {open ? <ShotFull shot={shot} /> : null}
          </div>
        </DialogContent>
      </Dialog>

      <figcaption className="border-t border-hairline px-5 py-4 text-sm leading-[1.6] text-text-muted">
        {shot.caption}
      </figcaption>
    </figure>
  );
}
