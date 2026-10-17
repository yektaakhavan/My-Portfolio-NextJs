"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";

type Tone = "success" | "error" | "info";
type Toast = { id: number; title: string; detail?: string; tone: Tone };

const ToastContext = createContext<(t: Omit<Toast, "id">) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const arm = useCallback(
    (id: number) => {
      // 8s (not 4s): people using screen magnifiers / screen readers need time to read (WCAG 2.2.1)
      timers.current.set(id, window.setTimeout(() => dismiss(id), 8000));
    },
    [dismiss],
  );

  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev.slice(-3), { ...t, id }]);
      arm(id);
    },
    [arm],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className="pointer-events-none fixed right-5 bottom-5 z-[90] flex w-[min(92vw,22rem)] flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            onMouseEnter={() => window.clearTimeout(timers.current.get(t.id))}
            onMouseLeave={() => arm(t.id)}
            className={cn(
              "toast-in pointer-events-auto flex items-start gap-3 rounded-xl border bg-surface px-4 py-3 shadow-xl shadow-black/30",
              t.tone === "success" && "border-ok/60",
              t.tone === "error" && "border-danger/60",
              t.tone === "info" && "border-line",
            )}
          >
            <span
              className={cn(
                "mt-0.5 shrink-0",
                t.tone === "success" && "text-ok",
                t.tone === "error" && "text-danger",
                t.tone === "info" && "text-accent-300",
              )}
            >
              <Icon name={t.tone === "success" ? "check" : t.tone === "error" ? "alert" : "spark"} className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-fg">{t.title}</p>
              {t.detail ? <p className="mt-0.5 text-xs text-muted">{t.detail}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="ml-auto shrink-0 rounded p-1 text-muted transition hover:text-fg"
              aria-label="Dismiss notification"
            >
              <Icon name="x" className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
