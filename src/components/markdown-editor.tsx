"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon, type IconName } from "./icons";
import { MarkdownContent } from "./markdown";
import { Textarea } from "./ui";

type Kind = "project" | "article";
type Lang = "en" | "fa";
type Edit = { value: string; s: number; e: number };
type ToolId = "bold" | "italic" | "heading" | "bullets" | "numbers" | "quote" | "code" | "link";

const TOOLS: { id: ToolId; label: string; icon?: IconName; text?: string }[] = [
  { id: "bold", label: "Bold (Ctrl+B)", text: "B" },
  { id: "italic", label: "Italic (Ctrl+I)", text: "I" },
  { id: "heading", label: "Heading", text: "H" },
  { id: "bullets", label: "Bulleted list", text: "•" },
  { id: "numbers", label: "Numbered list", text: "1." },
  { id: "quote", label: "Quote", text: "”" },
  { id: "code", label: "Inline code", text: "</>" },
  { id: "link", label: "Link (Ctrl+K)", icon: "external" },
];

const TEMPLATES: Record<Kind, Record<Lang, string>> = {
  project: {
    en: `## What I built
A short summary of the goal and what the project does.

## Challenges
- The hardest problem I ran into, and how I solved it
- Something that did not go as planned

## What I learned
- A new tool or technique
- Something I would do differently next time

## Result
What the final outcome was.
`,
    fa: `## چه چیزی ساختم
خلاصه‌ی کوتاهی از هدف و کاری که پروژه انجام می‌دهد.

## چالش‌ها
- سخت‌ترین مشکلی که با آن روبه‌رو شدم و چطور حلش کردم
- چیزی که طبق برنامه پیش نرفت

## چه چیزی یاد گرفتم
- یک ابزار یا تکنیک جدید
- کاری که دفعه‌ی بعد متفاوت انجام می‌دهم

## نتیجه
نتیجه‌ی نهایی چه بود.
`,
  },
  article: {
    en: `Open with the problem in two or three sentences.

## The idea
Explain the core idea in plain words.

## How it works
- Step one
- Step two

\`\`\`
// a short code sample
\`\`\`

## Takeaways
What the reader should remember.
`,
    fa: `با دو سه جمله مسئله را مطرح کنید.

## ایده‌ی اصلی
ایده‌ی اصلی را ساده توضیح دهید.

## چطور کار می‌کند
- گام اول
- گام دوم

\`\`\`
// یک نمونه‌ی کوتاه کد
\`\`\`

## نکته‌های پایانی
خواننده چه چیزی باید به خاطر بسپارد.
`,
  },
};

/**
 * Markdown editor that lives INSIDE a form/dialog (no separate page):
 * formatting toolbar + a "Write" / "Preview" switch, so it fits in a modal.
 * What the preview shows is exactly what visitors get (no raw HTML is ever rendered).
 */
export function MarkdownEditor({
  value,
  onChange,
  lang,
  kind,
  label,
  maxLength = 20000,
  rows = 14,
}: {
  value: string;
  onChange: (v: string) => void;
  lang: Lang;
  kind: Kind;
  label: string;
  maxLength?: number;
  rows?: number;
}) {
  const uid = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");

  function edit(fn: (v: string, s: number, e: number) => Edit) {
    const ta = ref.current;
    if (!ta) return;
    const r = fn(value, ta.selectionStart, ta.selectionEnd);
    onChange(r.value);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(r.s, r.e);
    });
  }
  const wrap = (before: string, after: string, placeholder: string) =>
    edit((v, s, e) => {
      const sel = v.slice(s, e) || placeholder;
      return { value: v.slice(0, s) + before + sel + after + v.slice(e), s: s + before.length, e: s + before.length + sel.length };
    });
  const prefixLines = (prefix: string, numbered = false) =>
    edit((v, s, e) => {
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      const end = v.indexOf("\n", e);
      const le = end === -1 ? v.length : end;
      const out = v
        .slice(ls, le)
        .split("\n")
        .map((l, i) => (numbered ? `${i + 1}. ` : prefix) + l)
        .join("\n");
      return { value: v.slice(0, ls) + out + v.slice(le), s: ls, e: ls + out.length };
    });
  function runTool(id: ToolId) {
    if (id === "bold") wrap("**", "**", "bold text");
    else if (id === "italic") wrap("*", "*", "italic text");
    else if (id === "heading") prefixLines("## ");
    else if (id === "bullets") prefixLines("- ");
    else if (id === "numbers") prefixLines("", true);
    else if (id === "quote") prefixLines("> ");
    else if (id === "code") wrap("`", "`", "code");
    else wrap("[", "](https://)", "link text");
  }
  const insertTemplate = () =>
    edit((v) => {
      const tpl = TEMPLATES[kind][lang];
      const next = v.trim() ? `${v.replace(/\s+$/, "")}\n\n${tpl}` : tpl;
      return { value: next, s: next.length, e: next.length };
    });

  const onTabKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setTab((t) => (t === "write" ? "preview" : "write"));
    }
  };

  const tabClass = (active: boolean) =>
    "min-h-9 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition " +
    (active ? "bg-accent-400 text-on-accent" : "border border-muted/75 text-muted hover:text-fg");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span id={`${uid}-label`} className="text-xs font-semibold tracking-wide text-muted">
          {label}
        </span>
        <div role="tablist" aria-label="Editor view" className="flex gap-1.5" onKeyDown={onTabKey}>
          <button type="button" role="tab" id={`${uid}-tab-write`} aria-selected={tab === "write"} aria-controls={`${uid}-panel`} tabIndex={tab === "write" ? 0 : -1} onClick={() => setTab("write")} className={tabClass(tab === "write")}>
            Write
          </button>
          <button type="button" role="tab" id={`${uid}-tab-preview`} aria-selected={tab === "preview"} aria-controls={`${uid}-panel`} tabIndex={tab === "preview" ? 0 : -1} onClick={() => setTab("preview")} className={tabClass(tab === "preview")}>
            Preview
          </button>
        </div>
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`}>
        {tab === "write" ? (
          <>
            <div role="toolbar" aria-label="Formatting" className="mb-2 flex flex-wrap items-center gap-1.5">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => runTool(t.id)}
                  aria-label={t.label}
                  title={t.label}
                  className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-muted/75 px-2 font-mono text-sm font-bold text-fg transition hover:border-accent-400 hover:text-accent-300"
                >
                  {t.icon ? <Icon name={t.icon} className="h-4 w-4" /> : t.text}
                </button>
              ))}
              <button
                type="button"
                onClick={insertTemplate}
                className="ms-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-xs font-semibold text-fg ring-1 ring-muted/40 transition hover:ring-accent-400/60"
              >
                <Icon name="file-text" className="h-4 w-4" />
                Insert template
              </button>
            </div>
            <Textarea
              ref={ref}
              aria-labelledby={`${uid}-label`}
              dir={lang === "fa" ? "rtl" : "ltr"}
              lang={lang}
              value={value}
              maxLength={maxLength}
              rows={rows}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (!(e.ctrlKey || e.metaKey)) return;
                const k = e.key.toLowerCase();
                if (k === "b") {
                  e.preventDefault();
                  wrap("**", "**", "bold text");
                } else if (k === "i") {
                  e.preventDefault();
                  wrap("*", "*", "italic text");
                } else if (k === "k") {
                  e.preventDefault();
                  wrap("[", "](https://)", "link text");
                }
              }}
              className="font-mono text-[13px] leading-relaxed"
              placeholder={lang === "fa" ? "## چالش‌ها\n- …" : "## Challenges\n- What was hard…"}
            />
            <p className="mt-1.5 text-xs text-muted">
              {value.length.toLocaleString()} / {maxLength.toLocaleString()} characters · Markdown: <code className="rounded bg-surface-3 px-1">## Heading</code>,{" "}
              <code className="rounded bg-surface-3 px-1">**bold**</code>, <code className="rounded bg-surface-3 px-1">- list</code>
            </p>
          </>
        ) : (
          <div className="min-h-[12rem] rounded-xl border border-line bg-canvas/50 p-4" dir={lang === "fa" ? "rtl" : "ltr"} lang={lang}>
            {value.trim() ? <MarkdownContent source={value} /> : <p className="text-sm text-muted">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
