"use client";

import { useState, type FormEvent } from "react";
import { SortableList } from "@/components/sortable";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Skill } from "@/lib/types";
import { CATEGORY_LABELS, levelTone } from "@/lib/types";
import { Icon } from "@/components/icons";
import { SkillMark } from "@/components/icons";
import { useToast } from "@/components/toast";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  Modal,
  Select,
} from "@/components/ui";

const ICON_OPTIONS = [
  "html5", "css3", "sass", "bootstrap", "javascript", "react",
  "git", "github", "figma", "responsive", "comm", "team", "problem", "spark",
];

type FormState = { name: string; category: string; level: string; icon: string; faName: string };
function toPayload(f: FormState) {
  const { faName, ...rest } = f;
  return { ...rest, translations: { fa: { name: faName.trim() } } };
}

const EMPTY: FormState = { name: "", category: "frontend", level: "Advanced", icon: "spark", faName: "" };

export default function SkillsClient({ initial }: { initial: Skill[] }) {
  const toast = useToast();
  const [skills, setSkills] = useState<Skill[]>(initial);
  const [modal, setModal] = useState<{ mode: "create" } | { mode: "edit"; skill: Skill } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function reorder(next: Skill[]) {
    const previous = skills;
    setSkills(next.map((x, i) => ({ ...x, sort: i + 1 })));
    try {
      await api("/api/admin/skills/reorder", { method: "PUT", json: { ids: next.map((x) => x.id) } });
      toast({ tone: "success", title: "Order saved" });
    } catch (e) {
      setSkills(previous);
      toast({ tone: "error", title: "Could not save the new order", detail: e instanceof Error ? e.message : undefined });
    }
  }

  function openCreate() {
    setForm(EMPTY);
    setModal({ mode: "create" });
  }
  function openEdit(skill: Skill) {
    setForm({ name: skill.name, category: skill.category, level: skill.level, icon: skill.icon, faName: skill.translations?.fa?.name ?? "" });
    setModal({ mode: "edit", skill });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal?.mode === "edit") {
        const d = await api<{ skill: Skill }>(`/api/admin/skills/${modal.skill.id}`, {
          method: "PUT",
          json: toPayload(form),
        });
        setSkills((s) => (s ?? []).map((x) => (x.id === d.skill.id ? d.skill : x)));
        toast({ tone: "success", title: "Skill updated" });
      } else {
        const d = await api<{ skill: Skill }>("/api/admin/skills", { method: "POST", json: toPayload(form) });
        setSkills((s) => [...(s ?? []), d.skill]);
        toast({ tone: "success", title: "Skill added", detail: d.skill.name });
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
    // optimistic removal
    setSkills((s) => (s ?? []).filter((x) => x.id !== target.id));
    setPendingDelete(null);
    try {
      await api(`/api/admin/skills/${target.id}`, { method: "DELETE" });
      toast({ tone: "success", title: "Skill deleted", detail: target.name });
    } catch (err) {
      setSkills((s) => [...(s ?? []), target].sort((a, b) => a.sort - b.sort));
      toast({ tone: "error", title: "Delete failed", detail: err instanceof Error ? err.message : undefined });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {skills ? `${skills.length} skills published on your portfolio.` : "Loading skills..."}
        </p>
        <Button icon="plus" onClick={openCreate}>
          Add skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <EmptyState
          icon="code"
          title="No skills yet"
          description="Add the technologies and strengths you want to highlight on your portfolio."
          action={
            <Button icon="plus" onClick={openCreate}>
              Add your first skill
            </Button>
          }
        />
      ) : (
        <>
          <p className="text-xs text-muted">
            Drag the grip handle to change the order (or focus it, press Space, use the arrow keys, then Space again). The order is saved automatically and used on the public site.
          </p>
          <SortableList
            items={skills}
            onReorder={reorder}
            getLabel={(s) => s.name}
            layout="grid"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            renderItem={(s, handle) => (
            <Card className="flex items-center gap-2 p-3 transition hover:border-accent-400/40">
              {handle}
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-accent-300 ring-1 ring-line">
                <SkillMark icon={s.icon} className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-fg">{s.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge tone="neutral">{CATEGORY_LABELS[s.category] ?? s.category}</Badge>
                  <Badge tone={levelTone(s.level)}>{s.level}</Badge>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(s)}
                  aria-label={`Edit ${s.name}`}
                  className="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-accent-300"
                >
                  <Icon name="pencil" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPendingDelete(s)}
                  aria-label={`Delete ${s.name}`}
                  className="rounded-lg p-2 text-muted transition hover:bg-danger/10 hover:text-danger"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </Card>
            )}
          />
        </>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit skill" : "Add skill"}
        description="This appears in the Skills section of your public portfolio."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModal(null)} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" icon="check" loading={saving} type="submit" form="skill-form">
              {modal?.mode === "edit" ? "Save changes" : "Add skill"}
            </Button>
          </>
        }
      >
        <form id="skill-form" onSubmit={save} className="space-y-4">
          <Field label="Name">
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. TypeScript" required />
          </Field>
          <Field label="Name in Persian (فارسی)" hint="Optional. Useful for soft skills like “Teamwork”; leave empty for tool names such as Git.">
            <Input dir="rtl" lang="fa" value={form.faName} onChange={(e) => setForm((f) => ({ ...f, faName: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                <option value="frontend">Frontend</option>
                <option value="tools">Tools</option>
                <option value="soft">Soft Skills</option>
              </Select>
            </Field>
            <Field label="Level">
              <Select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}>
                <option>Advanced</option>
                <option>Intermediate</option>
                <option>Beginner</option>
              </Select>
            </Field>
          </div>
          <Field label="Icon">
            <div className="grid grid-cols-7 gap-2">
              {ICON_OPTIONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  title={ic}
                  onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg border transition",
                    form.icon === ic
                      ? "border-accent-400 bg-accent-400/15 text-accent-300"
                      : "border-line bg-canvas text-muted hover:text-fg",
                  )}
                >
                  <SkillMark icon={ic} className="h-5 w-5" />
                </button>
              ))}
            </div>
          </Field>
                  </form>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Delete skill?"
        description={`"${pendingDelete?.name}" will be removed from your portfolio immediately.`}
      />
    </div>
  );
}
