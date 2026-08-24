"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { site } from "@/content/site";
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

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="text-mono-sm uppercase text-text transition-colors hover:text-accent"
        >
          {site.wordmark}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

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
        <div
          id="mobile-nav"
          ref={panelRef}
          className="menu-panel fixed inset-0 z-50 flex flex-col bg-bg md:hidden"
        >
          <div className="shell flex h-16 shrink-0 items-center justify-between">
            <span className="text-mono-sm uppercase text-text-muted">Menu</span>
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
            <a
              href={`mailto:${site.email}`}
              onClick={close}
              style={{ "--i": links.length } as React.CSSProperties}
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
