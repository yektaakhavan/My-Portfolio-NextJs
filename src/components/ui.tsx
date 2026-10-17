"use client";

import Link from "next/link";
import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type Ref,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icons";
import { useFocusTrap } from "./use-focus-trap";

/* ---------------- Buttons ---------------- */

type Variant = "primary" | "outline" | "ghost" | "danger" | "soft";
type Size = "sm" | "md" | "lg";

function buttonClasses(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60",
    size === "sm" && "min-h-8 px-3 py-1.5 text-xs",
    size === "md" && "min-h-10 px-4 py-2 text-sm",
    size === "lg" && "min-h-11 px-5 py-2.5 text-sm",
    variant === "primary" &&
      "bg-accent-400 text-on-accent shadow-[0_4px_20px_-6px] shadow-accent-500/50 hover:bg-accent-300 hover:text-on-accent active:translate-y-px",
    variant === "outline" &&
      "border border-muted/75 bg-transparent text-fg hover:border-accent-400 hover:text-accent-300",
    variant === "ghost" && "text-muted hover:bg-surface-2 hover:text-fg",
    variant === "soft" && "bg-surface-2 text-fg ring-1 ring-muted/40 hover:bg-surface-3 hover:ring-accent-400/60",
    variant === "danger" && "bg-danger/15 text-danger ring-1 ring-danger/50 hover:bg-danger/25",
    className,
  );
}

type CommonButtonProps = {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  className?: string;
  children?: ReactNode;
};

type ButtonProps = CommonButtonProps & { loading?: boolean } & ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };
type LinkButtonProps = CommonButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children"> & {
    href: string;
    /** Opens in a new tab and announces it to screen-reader users. */
    external?: boolean;
    loading?: undefined;
  };

/**
 * One component for BOTH buttons and link-buttons.
 * Passing `href` renders a real <a> (via next/link for internal pages) — never <a><button/></a>,
 * which is invalid HTML and creates two tab stops per control.
 */
export function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = "primary", size = "md", icon, className, children } = props;
  const classes = buttonClasses(variant, size, className);
  const iconEl = icon ? <Icon name={icon} className="h-4 w-4" /> : null;

  if (props.href !== undefined) {
    const { href, external, variant: _v, size: _s, icon: _i, className: _c, children: _ch, loading: _l, ...rest } = props;
    void _v; void _s; void _i; void _c; void _ch; void _l;
    if (external || /^https?:\/\//.test(href) || href.startsWith("mailto:")) {
      const newTab = external ?? /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className={classes}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...rest}
        >
          {iconEl}
          {children}
          {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {iconEl}
        {children}
      </Link>
    );
  }

  const { loading, disabled, variant: _v, size: _s, icon: _i, className: _c, children: _ch, href: _h, ...rest } = props;
  void _v; void _s; void _i; void _c; void _ch; void _h;
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      type={rest.type ?? "button"}
      {...rest}
    >
      {loading ? <Spinner className="h-4 w-4" /> : iconEl}
      {children}
    </button>
  );
}

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("animate-spin", className)} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Form fields ---------------- */

type FieldChild = ReactElement<{
  id?: string;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
}>;

/**
 * Wires label ⇄ control ⇄ hint ⇄ error together with real ids, so screen readers announce
 * "Email, edit text, invalid entry, Please enter a valid email address".
 */
export function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const uid = useId();
  const inputId = `f-${uid}`;
  const hintId = `h-${uid}`;
  const errId = `e-${uid}`;
  const only = Children.only(children);
  const describedBy = [hint ? hintId : "", errId].filter(Boolean).join(" ");

  const control = isValidElement(only)
    ? cloneElement(only as FieldChild, {
        id: inputId,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required ? true : undefined,
      })
    : only;

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold tracking-wide text-muted">
        {label}
        {required ? (
          <>
            <span aria-hidden className="ml-0.5 text-danger">*</span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
        {!required && hint === "optional" ? <span className="ml-1 font-normal">(optional)</span> : null}
      </label>
      {control}
      {hint && hint !== "optional" ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      <div id={errId} aria-live="polite">
        {error ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
            <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const fieldBase =
  "w-full rounded-lg border border-muted/70 bg-canvas/70 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/80 transition focus:border-accent-400";

export function Input({ className, invalid, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; ref?: Ref<HTMLInputElement> }) {
  return <input className={cn(fieldBase, invalid && "border-danger", className)} {...props} />;
}

export function Textarea({ className, invalid, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea className={cn(fieldBase, "min-h-[7rem] resize-y", invalid && "border-danger", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(fieldBase, "appearance-none bg-canvas pr-9", className)} {...props}>
        {children}
      </select>
      <Icon name="chevron-down" className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  /** Required: a switch without a name is announced as just "switch". */
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-accent-400" : "bg-surface-3 ring-1 ring-muted/60",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block rounded-full shadow transition-transform",
          checked ? "translate-x-[1.4rem] bg-on-accent" : "translate-x-1 bg-fg",
        )}
        style={{ height: "1.1rem", width: "1.1rem" }}
      />
    </button>
  );
}

/* ---------------- Badge / chips ---------------- */

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "violet" | "ok" | "warn" | "danger";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tone === "neutral" && "bg-surface-2 text-muted ring-1 ring-line",
        tone === "gold" && "bg-accent-400/15 text-accent-300 ring-1 ring-accent-400/40",
        tone === "violet" && "bg-brand-400/15 text-brand-300 ring-1 ring-brand-400/40",
        tone === "ok" && "bg-ok/10 text-ok ring-1 ring-ok/40",
        tone === "warn" && "bg-warn/10 text-warn ring-1 ring-warn/40",
        tone === "danger" && "bg-danger/10 text-danger ring-1 ring-danger/40",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Skeleton / empty / error ---------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} aria-hidden />;
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted/50 bg-surface/40 px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-accent-300 ring-1 ring-line">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg text-fg">{title}</h3>
      {description ? <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-2xl border border-danger/40 bg-danger/5 px-6 py-12 text-center"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-danger/15 text-danger">
        <Icon name="alert" className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-fg">Something went wrong</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      {onRetry ? (
        <Button variant="soft" size="sm" icon="refresh" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

/* ---------------- Modal ---------------- */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const uid = useId();
  useFocusTrap(open, panel, onClose);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      <div className="modal-backdrop absolute inset-0 bg-canvas-deep/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`t-${uid}`}
        aria-describedby={description ? `d-${uid}` : undefined}
        tabIndex={-1}
        className={cn(
          "modal-panel relative w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/40",
          wide ? "max-w-2xl" : "max-w-md",
        )}
      >
        <div className="flex items-start justify-between border-b border-line px-5 py-4">
          <div>
            <h2 id={`t-${uid}`} className="font-display text-lg text-fg">
              {title}
            </h2>
            {description ? (
              <p id={`d-${uid}`} className="mt-0.5 text-xs text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-fg"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
        {children ? <div className="max-h-[65vh] overflow-y-auto px-5 py-4">{children}</div> : null}
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-line bg-canvas/50 px-5 py-3.5">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={busy} data-autofocus>
            Cancel
          </Button>
          <Button variant="danger" size="sm" icon="trash" onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted">{description}</p>
    </Modal>
  );
}

/* ---------------- Card ---------------- */

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-line bg-surface/80", className)}>{children}</div>;
}
