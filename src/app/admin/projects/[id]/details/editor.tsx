"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { MarkdownContent } from "@/components/markdown";
import { useToast } from "@/components/toast";
import { Button, Card, Field, Textarea } from "@/components/ui";
import { api } from "@/lib/api";

const MAX = 20000;

const TEMPLATE = `## What I built
A short summary of the goal and what the project does.

## Challenges
- The hardest problem I ran into, and how I solved it
- Something that did not go as planned

## What I learned
- A new tool or technique
- Something I would do differently next time

## Result
What the final outcome was.
`;

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

/**
 * Write-up editor for one project. Plain Markdown with a formatting toolbar and a live preview:
 * no hidden HTML, so what you see in the preview is exactly what visitors get.
 */
export function DetailsEditor({ project }: { project: { id: number; title: string; slug: string; details: string } }) {
  const toast = useToast();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(project.details);
  const [saved, setSaved] = useState(project.details);
  const [saving, setSaving] = useState(false);
  const dirty = text !== saved;

  // warn before closing the tab with unsaved work
  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  function edit(fn: (v: string, s: number, e: number) => Edit) {
    const ta = ref.current;
    if (!ta) return;
    const r = fn(text, ta.selectionStart, ta.selectionEnd);
    setText(r.value);
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
  const insertTemplate = () =>
    edit((v) => {
      const value = v.trim() ? `${v.replace(/\s+$/, "")}\n\n${TEMPLATE}` : TEMPLATE;
      return { value, s: value.length, e: value.length };
    });

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      await api(`/api/admin/projects/${project.id}`, { method: "PUT", json: { details: text } });
      setSaved(text);
      toast({ tone: "success", title: "Write-up saved", detail: "It is live on the project page." });
    } catch (e) {
      toast({ tone: "error", title: "Could not save", detail: e instanceof Error ? e.message : undefined });
    } finally {
      setSaving(false);
    }
  }

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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button href="/admin/projects" variant="ghost" size="sm" icon="arrow-right" className="-ml-2 [&>svg]:rotate-180">
            Back to projects
          </Button>
          <h2 className="mt-1 font-display text-2xl text-fg">Write-up: {project.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Add anything you want visitors to know: what you learned, the challenges, decisions, results. It appears on the project&apos;s own page under
            &ldquo;Behind the project&rdquo;. Leave it empty to hide that section.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button href={`/projects/${project.slug}`} external variant="outline" size="sm" icon="eye">
            View public page
          </Button>
          <Button size="sm" icon="check" loading={saving} onClick={save}>
            Save write-up
          </Button>
        </div>
      </div>

      <p role="status" className="text-xs font-semibold text-muted">
        {dirty ? "● Unsaved changes" : "✓ All changes saved"}
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="space-y-3 p-4 sm:p-5">
          <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-1.5">
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
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-xs font-semibold text-fg ring-1 ring-muted/40 transition hover:ring-accent-400/60"
            >
              <Icon name="file-text" className="h-4 w-4" />
              Insert template
            </button>
          </div>

          <Field label="Write-up (Markdown)" hint={`${text.length.toLocaleString()} / ${MAX.toLocaleString()} characters`}>
            <Textarea
              ref={ref}
              dir="auto"
              value={text}
              maxLength={MAX}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (!(e.ctrlKey || e.metaKey)) return;
                const k = e.key.toLowerCase();
                if (k === "s") {
                  e.preventDefault();
                  void save();
                } else if (k === "b") {
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
              className="min-h-[26rem] font-mono text-[13px] leading-relaxed"
              placeholder={"## Challenges\n- What was hard…\n\n## What I learned\n- …"}
            />
          </Field>
          <p className="text-xs text-muted">
            Tip: <code className="rounded bg-surface-3 px-1">## Title</code> makes a heading, <code className="rounded bg-surface-3 px-1">**bold**</code>,{" "}
            <code className="rounded bg-surface-3 px-1">- item</code> makes a list. Persian text is laid out right-to-left automatically.
          </p>
        </Card>

        <Card className="p-4 sm:p-5">
          <section aria-labelledby="preview-title">
            <h3 id="preview-title" className="mb-3 text-xs font-bold tracking-widest text-accent-300 uppercase">
              Live preview
            </h3>
            <div className="min-h-[26rem] rounded-xl border border-line bg-canvas/50 p-5">
              {text.trim() ? (
                <MarkdownContent source={text} />
              ) : (
                <p className="text-sm text-muted">Nothing to preview yet. Start writing, or press &ldquo;Insert template&rdquo;.</p>
              )}
            </div>
          </section>
        </Card>
      </div>
    </div>
  );
}
