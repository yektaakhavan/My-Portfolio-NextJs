"use client";

import { useState, type FormEvent } from "react";
import { ImageDropzone } from "@/components/image-dropzone";
import { MarkdownEditor } from "@/components/markdown-editor";
import { useToast } from "@/components/toast";
import { Badge, Button, Card, ConfirmDialog, EmptyState, Field, Input, Modal, Textarea, Toggle } from "@/components/ui";
import { api } from "@/lib/api";
import { hasThumb, thumbUrl } from "@/lib/images";
import type { Article } from "@/lib/types";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  date: string; // yyyy-mm-dd
  published: boolean;
  coverUrl: string;
  coverAlt: string;
  content: string;
  faTitle: string;
  faExcerpt: string;
  faTags: string;
  faCoverAlt: string;
  faContent: string;
};

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY: FormState = {
  title: "", slug: "", excerpt: "", tags: "", date: today(), published: true, coverUrl: "", coverAlt: "", content: "",
  faTitle: "", faExcerpt: "", faTags: "", faCoverAlt: "", faContent: "",
};
const split = (v: string) => v.split(/[,،]/).map((x) => x.trim()).filter(Boolean);

function toForm(a: Article): FormState {
  const fa = a.translations?.fa;
  return {
    title: a.title, slug: a.slug, excerpt: a.excerpt, tags: a.tags.join(", "), date: a.publishedAt.slice(0, 10), published: a.published,
    coverUrl: a.coverUrl, coverAlt: a.coverAlt, content: a.content,
    faTitle: fa?.title ?? "", faExcerpt: fa?.excerpt ?? "", faTags: (fa?.tags ?? []).join("، "), faCoverAlt: fa?.coverAlt ?? "", faContent: fa?.content ?? "",
  };
}

export default function ArticlesClient({ initial }: { initial: Article[] }) {
  const toast = useToast();
  const [articles, setArticles] = useState<Article[]>(initial);
  const [modal, setModal] = useState<{ mode: "new" } | { mode: "edit"; article: Article } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [lang, setLang] = useState<"en" | "fa">("en");
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const openNew = () => {
    setForm({ ...EMPTY, date: today() });
    setLang("en");
    setModal({ mode: "new" });
  };
  const openEdit = (a: Article) => {
    setForm(toForm(a));
    setLang("en");
    setModal({ mode: "edit", article: a });
  };

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      tags: split(form.tags),
      publishedAt: `${form.date || today()}T12:00:00`,
      published: form.published,
      coverUrl: form.coverUrl,
      coverAlt: form.coverAlt.trim(),
      content: form.content,
      translations: {
        fa: { title: form.faTitle.trim(), excerpt: form.faExcerpt.trim(), tags: split(form.faTags), coverAlt: form.faCoverAlt.trim(), content: form.faContent },
      },
    };
    try {
      if (modal?.mode === "edit") {
        const d = await api<{ article: Article }>(`/api/admin/articles/${modal.article.id}`, { method: "PUT", json: payload });
        setArticles((l) => l.map((x) => (x.id === d.article.id ? d.article : x)).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)));
        toast({ tone: "success", title: "Article updated" });
      } else {
        const d = await api<{ article: Article }>("/api/admin/articles", { method: "POST", json: payload });
        setArticles((l) => [d.article, ...l].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)));
        toast({ tone: "success", title: "Article created" });
      }
      setModal(null);
    } catch (err) {
      toast({ tone: "error", title: "Could not save the article", detail: err instanceof Error ? err.message : undefined });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api(`/api/admin/articles/${toDelete.id}`, { method: "DELETE" });
      setArticles((l) => l.filter((x) => x.id !== toDelete.id));
      toast({ tone: "success", title: "Article deleted" });
      setToDelete(null);
    } catch (err) {
      toast({ tone: "error", title: "Delete failed", detail: err instanceof Error ? err.message : undefined });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted">
          Blog articles in English and Persian. The date you set here is the date shown on the article. Drafts are visible only to you.
        </p>
        <Button icon="plus" onClick={openNew}>
          New article
        </Button>
      </div>

      {articles.length === 0 ? (
        <EmptyState icon="file-text" title="No articles yet" description="Write your first article — it appears on the blog and on the home page." />
      ) : (
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.id}>
              <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
                  {a.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={hasThumb(a.coverUrl) ? thumbUrl(a.coverUrl) : a.coverUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-display text-base text-fg">{a.title}</h2>
                    <Badge tone={a.published ? "ok" : "warn"}>{a.published ? "Published" : "Draft"}</Badge>
                    {a.translations?.fa?.content ? <Badge tone="violet">فارسی</Badge> : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    <time dateTime={a.publishedAt}>{new Date(a.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
                    {" · "}
                    {a.readingMinutes} min read · /blog/{a.slug}
                    {a.tags.length ? ` · ${a.tags.join(", ")}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {a.published && (
                    <Button href={`/blog/${a.slug}`} external size="sm" variant="ghost" icon="eye">
                      View<span className="sr-only"> article {a.title}</span>
                    </Button>
                  )}
                  <Button size="sm" variant="soft" icon="pencil" onClick={() => openEdit(a)}>
                    Edit<span className="sr-only"> article {a.title}</span>
                  </Button>
                  <Button size="sm" variant="danger" icon="trash" onClick={() => setToDelete(a)}>
                    Delete<span className="sr-only"> article {a.title}</span>
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit article" : "New article"}
        description="Changes go live on the blog immediately after saving."
        wide
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModal(null)} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" icon="check" loading={saving} type="submit" form="article-form">
              {modal?.mode === "edit" ? "Save changes" : "Create article"}
            </Button>
          </>
        }
      >
        <form id="article-form" onSubmit={save} className="space-y-4">
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date written" hint="Shown on the article.">
              <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field label="Address (slug)" hint="Optional. Letters, numbers and dashes; made from the title if empty.">
              <Input dir="ltr" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="my-article" />
            </Field>
          </div>
          <Field label="Short summary" hint="One or two sentences, shown on cards and under the title.">
            <Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="min-h-[4.5rem]" maxLength={500} />
          </Field>
          <Field label="Tags" hint="Comma separated, e.g. Next.js, Accessibility. Visitors filter articles with these.">
            <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} />
          </Field>
          <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-fg">Published</p>
              <p className="text-xs text-muted">Turn off to keep it as a draft that only you can see.</p>
            </div>
            <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published" />
          </div>

          <ImageDropzone
            single
            label="Cover image"
            images={form.coverUrl ? [{ url: form.coverUrl, alt: form.coverAlt }] : []}
            onChange={(imgs) => {
              set("coverUrl", imgs[0]?.url ?? "");
              set("coverAlt", imgs[0]?.alt ?? "");
            }}
          />

          <fieldset className="space-y-3 rounded-xl border border-line p-4">
            <legend className="px-2 text-sm font-semibold text-fg">
              Persian version <span lang="fa">(فارسی)</span> — optional
            </legend>
            <p className="text-xs text-muted">Empty fields fall back to the English text on the Persian pages. The Persian article body is in the editor below.</p>
            <Field label="Title (Persian)">
              <Input dir="rtl" lang="fa" value={form.faTitle} onChange={(e) => set("faTitle", e.target.value)} />
            </Field>
            <Field label="Short summary (Persian)">
              <Textarea dir="rtl" lang="fa" value={form.faExcerpt} onChange={(e) => set("faExcerpt", e.target.value)} className="min-h-[4.5rem]" maxLength={500} />
            </Field>
            <Field label="Tags (Persian)" hint="Comma separated.">
              <Input dir="rtl" lang="fa" value={form.faTags} onChange={(e) => set("faTags", e.target.value)} />
            </Field>
            <Field label="Cover image alt text (Persian)">
              <Input dir="rtl" lang="fa" value={form.faCoverAlt} onChange={(e) => set("faCoverAlt", e.target.value)} />
            </Field>
          </fieldset>

          <fieldset className="space-y-3 rounded-xl border border-line p-4">
            <legend className="px-2 text-sm font-semibold text-fg">Article text</legend>
            <div role="group" aria-label="Language of the article text" className="flex gap-2">
              {(["en", "fa"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={
                    "min-h-9 rounded-full px-4 py-1.5 text-xs font-semibold transition " +
                    (lang === l ? "bg-accent-400 text-on-accent" : "border border-muted/75 text-muted hover:text-fg")
                  }
                >
                  {l === "en" ? "English" : "فارسی (Persian)"}
                  {(l === "en" ? form.content : form.faContent).trim() ? <span className="sr-only"> — has text</span> : null}
                </button>
              ))}
            </div>
            <MarkdownEditor
              key={lang}
              kind="article"
              lang={lang}
              label={lang === "fa" ? "Article text in Persian" : "Article text in English"}
              value={lang === "fa" ? form.faContent : form.content}
              onChange={(v) => (lang === "fa" ? set("faContent", v) : set("content", v))}
              maxLength={60000}
              rows={16}
            />
          </fieldset>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete this article?"
        description={`"${toDelete?.title}" will be removed from the blog permanently.`}
      />
    </div>
  );
}
