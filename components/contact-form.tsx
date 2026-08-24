"use client";

import { useState } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { site } from "@/content/site";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const FIELD =
  "w-full rounded-input border border-hairline bg-bg px-4 py-3 text-text placeholder:text-text-faint focus:border-accent focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // No endpoint configured means no form. Showing inputs that cannot deliver a
  // message is worse than not showing them, so the direct path is offered
  // instead. Set site.web3formsKey to turn the form on.
  if (!site.web3formsKey) {
    return (
      <div className="mt-8">
        <a
          href={`mailto:${site.email}?subject=Project%20enquiry`}
          className="inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-px"
        >
          Email me about a project
        </a>
        <p className="mt-4 text-sm text-text-muted">
          Opens your mail app, addressed to {site.email}.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot. Bots fill hidden fields; humans cannot see this one.
    if ((data.get("company") as string)?.length) return;

    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();

    if (!name || !email || !message) {
      setStatus({ kind: "error", message: "Fill in all three fields." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ kind: "error", message: "That email address looks wrong." });
      return;
    }

    setStatus({ kind: "sending" });

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: site.web3formsKey,
          subject: `Project enquiry from ${name}`,
          name,
          email,
          message,
        }),
      });

      const json = (await res.json()) as { success?: boolean; message?: string };

      // Only a real success response clears the form.
      if (!res.ok || !json.success) {
        setStatus({
          kind: "error",
          message: json.message || "That did not send. Try the email link.",
        });
        return;
      }

      form.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Try again, or use the email link.",
      });
    }
  }

  const sending = status.kind === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm text-text">
          Your name
        </label>
        <input id="name" name="name" type="text" required className={FIELD} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-text">
          Email
        </label>
        <input id="email" name="email" type="email" required className={FIELD} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm text-text">
          What do you need built or secured?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${FIELD} resize-y`}
        />
      </div>

      {/* Honeypot, hidden from people and from screen readers. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-px disabled:opacity-70"
      >
        {sending ? (
          <>
            <CircleNotch size={16} aria-hidden className="animate-spin" />
            Sending
          </>
        ) : (
          "Send it"
        )}
      </button>

      {/* One live region so a screen reader hears the outcome either way. */}
      <p role="status" aria-live="polite" className="min-h-6 text-sm">
        {status.kind === "sent" ? (
          <span className="text-accent">
            Sent. I will get back to you within two business days.
          </span>
        ) : null}
        {status.kind === "error" ? (
          <span className="text-text">{status.message}</span>
        ) : null}
      </p>
    </form>
  );
}
