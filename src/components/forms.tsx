"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { isValidEmail } from "@/lib/utils";
import { Icon } from "./icons";
import { useToast } from "./toast";
import { Button, Field, Input, Textarea } from "./ui";

type Variant = "contact" | "public";

const COPY = {
  contact: {
    endpoint: "/api/public/contact",
    bodyLabel: "Message",
    bodyPlaceholder: "Tell me about your project or question…",
    max: 5000,
    submit: "Send message",
    sending: "Sending message…",
    doneTitle: "Message sent",
    doneText: "Thank you for reaching out. Your message went straight to my private inbox and I will reply by email.",
    another: "Write another message",
    consent: (
      <>
        I have read the{" "}
        <Link href="/privacy" className="font-semibold text-accent-300 underline underline-offset-2">
          Privacy Policy
        </Link>{" "}
        and agree that my details are used to answer my message.
      </>
    ),
    consentError: "Please confirm that you agree to the Privacy Policy.",
  },
  public: {
    endpoint: "/api/public/messages",
    bodyLabel: "Your message",
    bodyPlaceholder: "Say hello, share feedback, or leave a kind word…",
    max: 800,
    submit: "Submit message for review",
    sending: "Submitting…",
    doneTitle: "Thank you — message received",
    doneText:
      "Your message is waiting for my review. It will appear on this page once I approve it. I never publish your email address.",
    another: "Write another message",
    consent: (
      <>
        I agree that my name and message will be shown publicly on this page <strong>after the owner approves them</strong>
        , and I have read the{" "}
        <Link href="/privacy" className="font-semibold text-accent-300 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </>
    ),
    consentError: "Please agree to the public display of your message after review.",
  },
} as const;

/**
 * One accessible form used by both the private contact form and the public (moderated) message form.
 * - every field has a real <label>, errors are linked with aria-describedby and announced
 * - works fully with the keyboard; focus moves to the first invalid field on error
 * - hidden "website" honeypot + fill-time check stop simple bots
 */
export function PublicForm({ variant }: { variant: Variant }) {
  const c = COPY[variant];
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", body: "", website: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  const set = (k: "name" | "email" | "phone" | "body") => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  function focusFirstInvalid() {
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name (at least 2 characters).";
    if (variant === "contact" && !isValidEmail(form.email.trim())) next.email = "Please enter a valid email address, like name@example.com.";
    if (variant === "public" && form.email.trim() && !isValidEmail(form.email.trim())) next.email = "That email address doesn't look right.";
    if (form.body.trim().length < 10) next.body = "Your message should be at least 10 characters.";
    if (!form.consent) next.consent = c.consentError;
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstInvalid();
      return;
    }

    setStatus("sending");
    try {
      await api(c.endpoint, {
        method: "POST",
        json: { ...form, name: form.name.trim(), email: form.email.trim(), body: form.body.trim(), startedAt: startedAt.current },
      });
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", body: "", website: "", consent: false });
    } catch (err) {
      setStatus("idle");
      toast({
        tone: "error",
        title: "Could not send your message",
        detail: err instanceof Error ? err.message : "Please try again later.",
      });
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="space-y-4 py-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok/15 text-ok ring-1 ring-ok/50">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h3 ref={doneRef} tabIndex={-1} className="font-display text-xl text-fg outline-none">
          {c.doneTitle}
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted">{c.doneText}</p>
        <Button variant="soft" size="sm" onClick={() => setStatus("idle")}>
          {c.another}
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-4" aria-describedby="form-note">
      <p id="form-note" className="text-xs text-muted">
        Fields marked <span aria-hidden className="text-danger">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <Field label="Your name" required error={errors.name}>
        <Input value={form.name} onChange={set("name")} invalid={!!errors.name} autoComplete="name" maxLength={80} required />
      </Field>

      <Field
        label="Email address"
        required={variant === "contact"}
        hint={variant === "public" ? "Optional. Kept private — never shown on the site." : undefined}
        error={errors.email}
      >
        <Input
          type="email"
          inputMode="email"
          value={form.email}
          onChange={set("email")}
          invalid={!!errors.email}
          autoComplete="email"
          placeholder="name@example.com"
          maxLength={160}
          required={variant === "contact"}
        />
      </Field>

      {variant === "contact" && (
        <Field label="Phone number" hint="optional">
          <Input type="tel" inputMode="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" maxLength={40} />
        </Field>
      )}

      <Field label={c.bodyLabel} required error={errors.body} hint={`${form.body.length} / ${c.max} characters`}>
        <Textarea
          value={form.body}
          onChange={set("body")}
          invalid={!!errors.body}
          maxLength={c.max}
          placeholder={c.bodyPlaceholder}
          required
        />
      </Field>

      {/* Honeypot: invisible to people and screen readers, bots fill it in */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
          />
        </label>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            checked={form.consent}
            onChange={(e) => {
              setForm((f) => ({ ...f, consent: e.target.checked }));
              setErrors((er) => ({ ...er, consent: "" }));
            }}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby="consent-error"
            required
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--c-accent-400)]"
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-muted">
            {c.consent}
          </label>
        </div>
        <div id="consent-error" aria-live="polite">
          {errors.consent && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
              <Icon name="alert" className="h-3.5 w-3.5" />
              {errors.consent}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" loading={status === "sending"} size="lg" icon="send" className="w-full">
        {status === "sending" ? c.sending : c.submit}
      </Button>
    </form>
  );
}
