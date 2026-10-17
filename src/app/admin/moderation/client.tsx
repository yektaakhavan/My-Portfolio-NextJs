"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/toast";
import { Badge, Button, Card, ConfirmDialog, EmptyState } from "@/components/ui";
import { api } from "@/lib/api";
import type { ModerationItem } from "@/lib/types";
import { cn, timeAgo } from "@/lib/utils";

type Status = ModerationItem["status"];
const TABS: { key: Status; label: string }[] = [
  { key: "pending", label: "Waiting for approval" },
  { key: "approved", label: "Published" },
  { key: "rejected", label: "Rejected" },
];

export default function ModerationClient({ initial }: { initial: ModerationItem[] }) {
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<Status>("pending");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<ModerationItem | null>(null);

  const counts = useMemo(() => {
    const c: Record<Status, number> = { pending: 0, approved: 0, rejected: 0 };
    items.forEach((i) => (c[i.status] += 1));
    return c;
  }, [items]);
  const visible = items.filter((i) => i.status === tab);

  async function setStatus(item: ModerationItem, status: Status) {
    setBusyId(item.id);
    try {
      const d = await api<{ item: ModerationItem }>(`/api/admin/public-messages/${item.id}`, { method: "PATCH", json: { status } });
      setItems((list) => list.map((x) => (x.id === item.id ? { ...x, status: d.item.status, reviewedAt: d.item.reviewedAt } : x)));
      toast({
        tone: "success",
        title: status === "approved" ? "Message published" : status === "rejected" ? "Message rejected" : "Moved back to pending",
        detail: `From ${item.name}`,
      });
    } catch (e) {
      toast({ tone: "error", title: "Could not update the message", detail: e instanceof Error ? e.message : undefined });
    } finally {
      setBusyId(null);
    }
  }

  async function remove() {
    if (!toDelete) return;
    const target = toDelete;
    setBusyId(target.id);
    try {
      await api(`/api/admin/public-messages/${target.id}`, { method: "DELETE" });
      setItems((l) => l.filter((x) => x.id !== target.id));
      toast({ tone: "success", title: "Message deleted" });
    } catch (e) {
      toast({ tone: "error", title: "Delete failed", detail: e instanceof Error ? e.message : undefined });
    } finally {
      setBusyId(null);
      setToDelete(null);
    }
  }

  return (
    <div className="space-y-5">
      <p className="max-w-2xl text-sm text-muted">
        Visitors can post on the public Messages page. Nothing is visible to the public until you press <strong className="text-fg">Approve</strong>.
      </p>

      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "min-h-9 rounded-full px-4 py-1.5 text-xs font-semibold transition",
              tab === t.key ? "bg-accent-400 text-on-accent" : "border border-muted/75 bg-surface text-muted hover:text-fg",
            )}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="shield"
          title={tab === "pending" ? "Nothing to review" : "Nothing here"}
          description={tab === "pending" ? "New visitor messages will wait here until you approve them." : "Messages you move here will be listed."}
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((m) => (
            <li key={m.id}>
              <Card className="p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="text-sm font-bold text-fg">{m.name}</h2>
                  {m.email && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <Icon name="mail" className="h-3.5 w-3.5" /> {m.email} <span className="sr-only">(private)</span>
                    </span>
                  )}
                  <Badge tone={m.status === "approved" ? "ok" : m.status === "rejected" ? "danger" : "gold"}>
                    {m.status === "approved" ? "Published" : m.status === "rejected" ? "Rejected" : "Pending"}
                  </Badge>
                  <time dateTime={m.createdAt} className="ml-auto text-xs text-muted">{timeAgo(m.createdAt)}</time>
                </div>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-fg/90">{m.body}</p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                  {m.status !== "approved" && (
                    <Button size="sm" icon="check" loading={busyId === m.id} onClick={() => setStatus(m, "approved")}>
                      Approve<span className="sr-only"> message from {m.name}</span>
                    </Button>
                  )}
                  {m.status === "pending" && (
                    <Button size="sm" variant="soft" icon="x" disabled={busyId === m.id} onClick={() => setStatus(m, "rejected")}>
                      Reject<span className="sr-only"> message from {m.name}</span>
                    </Button>
                  )}
                  {m.status === "approved" && (
                    <Button size="sm" variant="soft" icon="refresh" disabled={busyId === m.id} onClick={() => setStatus(m, "pending")}>
                      Unpublish<span className="sr-only"> message from {m.name}</span>
                    </Button>
                  )}
                  <Button size="sm" variant="danger" icon="trash" disabled={busyId === m.id} onClick={() => setToDelete(m)} className="ml-auto">
                    Delete<span className="sr-only"> message from {m.name}</span>
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        busy={busyId !== null && !!toDelete}
        title="Delete this message permanently?"
        description={`The message from "${toDelete?.name}" will be removed from the database and the public page.`}
      />
    </div>
  );
}
