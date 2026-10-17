"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { cn, splitList } from "@/lib/utils";
import { monogram, type Project, type ProjectImage } from "@/lib/types";
import { ImageDropzone } from "@/components/image-dropzone";
import { SortableList } from "@/components/sortable";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/toast";
import {
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  Modal,
  Textarea,
  Toggle,
} from "@/components/ui";

type FormState = {
  title: string;
  description: string;
  tags: string;
  tech: string;
  liveUrl: string;
  githubUrl: string;
  images: ProjectImage[];
  accent: number;
  featured: boolean;
};

const EMPTY: FormState = {
  title: "",
  description: "",
  tags: "",
  tech: "",
  liveUrl: "",
  githubUrl: "",
  images: [],
  accent: 0,
  featured: false,
};

function toForm(p: Project): FormState {
  return {
    title: p.title,
    description: p.description,
    tags: p.tags.join(", "),
    tech: p.tech.join(", "),
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    images: p.images,
    accent: p.accent,
    featured: p.featured,
  };
}

export default function ProjectsClient({ initial }: { initial: Project[] }) {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>(initial);
  const [modal, setModal] = useState<{ mode: "create" } | { mode: "edit"; project: Project } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function reorder(next: Project[]) {
    const previous = projects;
    setProjects(next.map((x, i) => ({ ...x, sort: i + 1 })));
    try {
      await api("/api/admin/projects/reorder", { method: "PUT", json: { ids: next.map((x) => x.id) } });
      toast({ tone: "success", title: "Order saved" });
    } catch (e) {
      setProjects(previous);
      toast({ tone: "error", title: "Could not save the new order", detail: e instanceof Error ? e.message : undefined });
    }
  }

  function openCreate() {
    setForm(EMPTY);
    setModal({ mode: "create" });
  }
  function openEdit(p: Project) {
    setForm(toForm(p));
    setModal({ mode: "edit", project: p });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      tags: splitList(form.tags),
      tech: splitList(form.tech),
      liveUrl: form.liveUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      images: form.images,
      accent: form.accent,
      featured: form.featured,
    };
    try {
      if (modal?.mode === "edit") {
        const d = await api<{ project: Project }>(`/api/admin/projects/${modal.project.id}`, {
          method: "PUT",
          json: payload,
        });
        setProjects((s) => (s ?? []).map((x) => (x.id === d.project.id ? d.project : x)));
        toast({ tone: "success", title: "Project updated", detail: d.project.title });
      } else {
        const d = await api<{ project: Project }>("/api/admin/projects", {
          method: "POST",
          json: payload,
        });
        setProjects((s) => [...(s ?? []), d.project]);
        toast({ tone: "success", title: "Project created", detail: d.project.title });
      }
      setModal(null);
    } catch (err) {
      toast({ tone: "error", title: "Save failed", detail: err instanceof Error ? err.message : undefined });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setDeleting(true);
    setProjects((s) => (s ?? []).filter((x) => x.id !== target.id));
    setPendingDelete(null);
    try {
      await api(`/api/admin/projects/${target.id}`, { method: "DELETE" });
      toast({ tone: "success", title: "Project deleted", detail: target.title });
    } catch (err) {
      setProjects((s) => [...(s ?? []), target].sort((a, b) => a.sort - b.sort));
      toast({ tone: "error", title: "Delete failed", detail: err instanceof Error ? err.message : undefined });
    } finally {
      setDeleting(false);
    }
  }


  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {projects.length} project{projects.length === 1 ? "" : "s"} on your portfolio.
        </p>
        <Button icon="plus" onClick={openCreate}>
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon="folder"
          title="No projects yet"
          description="Create your first project to start building the portfolio projects section."
          action={
            <Button icon="plus" onClick={openCreate}>
              Create a project
            </Button>
          }
        />
      ) : (
        <>
          <p id="reorder-hint" className="text-xs text-muted">
            Drag the grip handle to change the order (or focus it, press Space, use the arrow keys, then Space again). The order is saved automatically and used on the public site.
          </p>
          <SortableList
            items={projects}
            onReorder={reorder}
            getLabel={(p) => p.title}
            layout="list"
            className="space-y-4"
            renderItem={(p, handle) => (
            <div
              className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-surface/70 sm:flex-row sm:items-center"
            >
              <div className="flex items-center pt-3 pl-2 sm:py-0">{handle}</div>
              <div className={cn("flex h-24 w-full shrink-0 items-center justify-center sm:h-auto sm:w-36 sm:self-stretch", `project-accent-${p.accent % 5}`)}>
                <span className="font-display text-2xl text-fg/30">{monogram(p.title)}</span>
              </div>
              <div className="min-w-0 flex-1 py-3 sm:py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg text-accent-300">{p.title}</h2>
                  {p.featured && (
                    <Badge tone="gold">
                      <Icon name="star" className="h-3 w-3" /> Featured
                    </Badge>
                  )}
                  {p.details && <Badge tone="ok">Has write-up</Badge>}
                  <span className="font-mono text-[11px] text-muted">/{p.slug}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Badge key={t} tone="violet">
                      {t}
                    </Badge>
                  ))}
                  {p.tech.slice(0, 4).map((t) => (
                    <Badge key={t} tone="neutral">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-1 px-4 pb-4 sm:pb-0">
                <Button href={`/admin/projects/${p.id}/details`} variant="soft" size="sm" icon="file-text">
                  Write-up<span className="sr-only"> for project {p.title}</span>
                </Button>
                <Button variant="soft" size="sm" icon="pencil" onClick={() => openEdit(p)}>
                  Edit<span className="sr-only"> project {p.title}</span>
                </Button>
                <Button variant="danger" size="sm" icon="trash" onClick={() => setPendingDelete(p)}>
                  <span className="sr-only">Delete project {p.title}</span>
                </Button>
              </div>
            </div>
            )}
          />
        </>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit project" : "New project"}
        description="Changes go live on the public portfolio immediately after saving."
        wide
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModal(null)} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" icon="check" loading={saving} type="submit" form="project-form">
              {modal?.mode === "edit" ? "Save changes" : "Create project"}
            </Button>
          </>
        }
      >
        <form id="project-form" onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Music Player" required />
            </Field>
            <Field label="Filter tags" hint="Comma separated, e.g. React, Tailwind">
              <Input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="React, Tailwind" />
            </Field>
          </div>
          <Field label="Description" required>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What does this project do?" required />
          </Field>
          <Field label="Tech stack" hint="Comma separated, e.g. React, TypeScript">
            <Input value={form.tech} onChange={(e) => setForm((f) => ({ ...f, tech: e.target.value }))} placeholder="React, TypeScript, Tailwind CSS" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Live demo URL">
              <Input type="url" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." />
            </Field>
            <Field label="GitHub URL">
              <Input type="url" value={form.githubUrl} onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
            </Field>
          </div>
          <ImageDropzone images={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} label="Screenshots" />
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-canvas/50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-fg">Card accent</p>
              <div className="mt-2 flex gap-2">
                {[0, 1, 2, 3, 4].map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setForm((f) => ({ ...f, accent: a }))}
                    aria-label={`Card colour ${a + 1}`}
                    aria-pressed={form.accent === a}
                    className={cn(
                      "h-8 w-8 rounded-lg transition",
                      `project-accent-${a}`,
                      form.accent === a ? "ring-2 ring-accent-400 ring-offset-2 ring-offset-canvas" : "opacity-70 hover:opacity-100",
                    )}
                  />
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3">
              <span className="text-sm font-semibold text-fg">Featured</span>
              <Toggle checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} label="Featured project" />
            </label>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Delete project?"
        description={`"${pendingDelete?.title}" will be removed from the portfolio. This cannot be undone.`}
      />
    </div>
  );
}
