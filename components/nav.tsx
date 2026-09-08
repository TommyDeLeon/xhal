"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { MQ } from "@/lib/motion";
import ThemeToggle from "./theme-toggle";

/** Only sections that actually exist on the page. */
type NavLink = { href: string; label: string };

export default function Nav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes, and focus goes back to the control that opened the panel so
  // keyboard users are not dumped at the top of the document.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        toggleRef.current?.focus();
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      /*
        Focus is not necessarily inside the panel. Tapping any part of it that
        is not a control -- the "Menu" strip, the centring gap between the link
        list and the edges, the padding under the email button -- moves focus
        to <body>, which is neither first nor last, so both branches below miss
        and Tab falls through to the document. The next stop is then the skip
        link and the desktop nav: real controls, sitting behind an opaque
        full-screen panel, driven blind. aria-modal makes that worse rather
        than better, because assistive tech has been told that background is
        gone. Pull focus back to the correct end before deciding anything else.
      */
      if (!panelRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Body scroll lock. Padding compensates for the scrollbar so the layout
    // behind the panel does not shift sideways when it disappears.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open, close]);

  // An in-page anchor does not fire a route change, so close on hash change too.
  useEffect(() => {
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [close]);

  /*
    Growing past the breakpoint has to close it, because the panel is hidden by
    `md:hidden` rather than unmounted. Left open, `open` stays true while the
    panel is invisible: the body scroll lock stays on with no visible control
    to release it -- the hamburger is md:hidden too -- and the Tab trap keeps
    cycling focus through display:none elements, where .focus() does nothing.
    Rotating a phone to landscape is enough to reach that state.

    MQ.wide is the same 768px Tailwind's `md:` uses, imported rather than
    retyped so the class and this listener cannot drift apart.
  */
  useEffect(() => {
    if (!open) return;

    /*
      Subscribing only, with no synchronous check of `wide.matches` first. The
      panel can only be opened by a control that is itself `md:hidden`, so the
      viewport is always narrow at the moment `open` becomes true, and the
      effect attaches this listener in the same commit. There is no width to
      catch up on -- only a later crossing to react to.
    */
    const wide = window.matchMedia(MQ.wide);

    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) close();
    };

    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, [open, close]);

  return (
    /*
      Fixed rather than absolute so the bar survives the scroll. That is what
      makes the glass mean anything at all: a bar that scrolls away with the
      hero never has content behind it to frost. The trade is that it now
      overlaps content permanently, which the hero already accounts for with
      its top padding.
    */
    <header data-nav className="fixed inset-x-0 top-0 z-50">
      {/*
        The frosted pane. A separate element rather than a background on the
        header, so its opacity can be tweened without touching the header's own
        compositing or the contrast of the links sitting on top of it.
      */}
      <div aria-hidden data-nav-glass className="nav-glass" />

      <div className="shell flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="text-label-sm uppercase text-text transition-colors hover:text-accent"
        >
          {site.wordmark}
        </Link>

        {/*
          Micro-chrome. The reference's hierarchy is a near-invisible bar set
          against enormous display type, and the SIZE GAP between the two is
          what does the work: a 14px nav beside a 121px headline reads as two
          competing levels, an 11px letterspaced one reads as a frame around
          the headline.

          Held at 11px rather than going smaller. These are real navigation
          targets, and the row still has to clear 4.5:1 and stay hittable --
          the styling is quiet, not decorative.
        */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.6875rem] uppercase tracking-[0.16em] text-text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Three 34px options is roughly 110px. Alongside the wordmark and
              the hamburger that does not fit a 320px header, so on small
              screens the switch lives in the menu panel instead. */}
          <ThemeToggle className="hidden md:inline-flex" />

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-text md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? (
              <X size={22} aria-hidden />
            ) : (
              <List size={22} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open ? (
        /*
          It behaves as a modal already -- covers the viewport, traps Tab,
          locks body scroll, closes on Escape -- so it has to say so. Without
          role and aria-modal a screen reader still browses the page
          underneath: content the sighted user can neither see nor reach.
          aria-modal is what removes that background from the reading order.
        */
        <div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="menu-panel fixed inset-0 z-50 flex flex-col bg-bg md:hidden"
        >
          <div className="shell flex h-16 shrink-0 items-center justify-between">
            <span className="text-label-sm uppercase text-text-muted">Menu</span>
            <button
              type="button"
              onClick={() => {
                close();
                toggleRef.current?.focus();
              }}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-text"
            >
              <span className="sr-only">Close menu</span>
              <X size={20} aria-hidden />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="shell flex flex-1 flex-col justify-center"
          >
            <ul className="flex flex-col divide-y divide-hairline border-y border-hairline">
              {links.map((link, i) => (
                <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="menu-item flex min-h-[56px] items-center justify-between gap-4 py-4 text-h3 text-text transition-colors hover:text-accent"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={18}
                      aria-hidden
                      className="shrink-0 text-text-faint"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shell shrink-0 pb-10">
            <div
              style={{ "--i": links.length } as React.CSSProperties}
              className="menu-item mb-6 flex items-center justify-between"
            >
              <span className="text-label-sm uppercase text-text-muted">
                Appearance
              </span>
              <ThemeToggle />
            </div>

            <a
              href={`mailto:${site.email}`}
              onClick={close}
              style={{ "--i": links.length + 1 } as React.CSSProperties}
              className="menu-item flex min-h-[52px] items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent"
            >
              {site.email}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
