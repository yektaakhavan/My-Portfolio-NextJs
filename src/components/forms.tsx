"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { isValidEmail } from "@/lib/utils";
import { fmt, formatNumber } from "@/i18n";
import { useI18n } from "@/i18n/provider";
import { rich } from "@/i18n/rich";
import { Icon } from "./icons";
import { LocaleLink } from "./locale-link";
import { useToast } from "./toast";
import { Button, Field, Input, Textarea } from "./ui";

type Variant = "contact" | "public";

const MAX = { contact: 5000, public: 800 } as const;
const ENDPOINT = { contact: "/api/public/contact", public: "/api/public/messages" } as const;

/**
 * One accessible form used by both the private contact form and the public (moderated) message form.
 * - every field has a real <label>, errors are linked with aria-describedby and announced
 * - works fully with the keyboard; focus moves to the first invalid field on error
 * - hidden "website" honeypot + fill-time check stop simple bots
 * - the visitor's language is sent along so server messages come back translated
 */
export function PublicForm({ variant }: { variant: Variant }) {
  const { t, locale } = useI18n();
  const c = t.forms[variant];
  const max = MAX[variant];
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
    if (form.name.trim().length < 2) next.name = t.forms.errName;
    if (variant === "contact" && !isValidEmail(form.email.trim())) next.email = t.forms.errEmailContact;
    if (variant === "public" && form.email.trim() && !isValidEmail(form.email.trim())) next.email = t.forms.errEmailPublic;
    if (form.body.trim().length < 10) next.body = t.forms.errBody;
    if (!form.consent) next.consent = c.consentError;
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstInvalid();
      return;
    }

    setStatus("sending");
    try {
      await api(ENDPOINT[variant], {
        method: "POST",
        json: { ...form, name: form.name.trim(), email: form.email.trim(), body: form.body.trim(), startedAt: startedAt.current, locale },
      });
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", body: "", website: "", consent: false });
    } catch (err) {
      setStatus("idle");
      toast({
        tone: "error",
        title: t.forms.failTitle,
        detail: err instanceof Error ? err.message : t.forms.failText,
      });
    }
  }

  const privacyLink = (
    <LocaleLink href="/privacy" className="font-semibold text-accent-300 underline underline-offset-2">
      {t.forms.privacyLink}
    </LocaleLink>
  );
  const consentText =
    variant === "public"
      ? rich(t.forms.public.consent, { bold: <strong>{t.forms.public.consentBold}</strong>, privacy: privacyLink })
      : rich(t.forms.contact.consent, { privacy: privacyLink });

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
        {t.forms.requiredNote}
      </p>

      <Field label={t.forms.name} required error={errors.name}>
        <Input dir="auto" value={form.name} onChange={set("name")} invalid={!!errors.name} autoComplete="name" maxLength={80} required />
      </Field>

      <Field
        label={t.forms.email}
        required={variant === "contact"}
        hint={variant === "public" ? t.forms.emailHintPublic : undefined}
        error={errors.email}
      >
        <Input
          type="email"
          inputMode="email"
          dir="ltr"
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
        <Field label={t.forms.phone} hint="optional">
          <Input type="tel" inputMode="tel" dir="ltr" value={form.phone} onChange={set("phone")} autoComplete="tel" maxLength={40} />
        </Field>
      )}

      <Field
        label={c.bodyLabel}
        required
        error={errors.body}
        hint={fmt(t.forms.counter, { n: formatNumber(locale, form.body.length), max: formatNumber(locale, max) })}
      >
        <Textarea dir="auto" value={form.body} onChange={set("body")} invalid={!!errors.body} maxLength={max} placeholder={c.bodyPlaceholder} required />
      </Field>

      {/* Honeypot: invisible to people and screen readers, bots fill it in */}
      <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {t.forms.honeypot}
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
            {consentText}
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
