"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui Dialog, restyled for this site.
 *
 * Four deliberate departures from the generated source, all of them to avoid
 * dragging in things this project does not otherwise need:
 *
 *  1. The close icon is Phosphor, not Lucide. Every other icon on the site is
 *     Phosphor, and the generated version would have added a second icon
 *     package for one glyph.
 *  2. Only the parts this site renders are kept. DialogFooter went first: it
 *     was the only export that imported the shadcn Button, and no Button is
 *     installed here -- the existing CTAs are already a consistent full-pill
 *     set, so routing them through a Button component would have been churn,
 *     not consolidation. DialogHeader and DialogDescription followed for the
 *     same reason, having never been rendered. An unused export is a claim
 *     nothing verifies.
 *  3. The enter/exit animation is plain CSS in globals.css keyed off
 *     data-state, not the animate-in/animate-out utilities. Those come from
 *     tailwindcss-animate, which is not installed and would be a whole plugin
 *     for two keyframes. It also lets the animation sit behind the same
 *     prefers-reduced-motion guard as the rest of the site rather than
 *     inventing a second convention.
 *  4. Radii follow this site's scale -- panels 12px (rounded-panel), controls
 *     full-pill -- instead of shadcn's rounded-lg/rounded-xs defaults.
 */

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        // Sits above the nav's z-50 so the frosted bar does not float over the
        // dialog. Opaque enough to read a dense screenshot against.
        "dialog-anim fixed inset-0 z-[60] bg-black/70",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "dialog-anim fixed top-1/2 left-1/2 z-[60] w-full max-w-[calc(100%-2rem)]",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-panel border border-hairline bg-bg-raised outline-none",
          className,
        )}
        {...props}
      >
        {children}

        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            /* Full-pill, like every other control on the site, and a 44px
               target rather than shadcn's bare 16px icon. */
            className="absolute top-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-bg text-text transition-colors hover:border-accent hover:text-accent"
          >
            <X size={18} aria-hidden />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-h3 font-medium text-text", className)}
      {...props}
    />
  );
}

/*
  DialogOverlay and DialogPortal are deliberately not exported. DialogContent
  is the only thing that composes them, and the single consumer of this file
  renders DialogContent. Exporting them would advertise an assembly-it-yourself
  API that nothing uses and that nothing checks stays coherent.
*/
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
};
