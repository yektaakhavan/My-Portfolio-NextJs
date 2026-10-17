"use client";

import { useCallback, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/toast";
import { Badge, Button, ConfirmDialog, EmptyState } from "@/components/ui";

type Message = {
  id: number;
  name: string;
  email: string;
  phone: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesClient({ initial }: { initial: Message[] }) {
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await api<{ messages: Message[] }>("/api/admin/messages");
      setMessages(d.messages);
    } catch (e) {
      toast({ tone: "error", title: "Could not refresh messages", detail: e instanceof Error ? e.message : undefined });
    }
  }, [toast]);

  const unread = useMemo(() => messages.filter((m) => !m.read).length, [messages]);
  const visible = useMemo(
    () => messages.filter((m) => filter === "all" || !m.read),
    [messages, filter],
  );

  async function toggleRead(m: Message) {
    const next = !m.read;
    // optimistic
    setMessages((s) => (s ?? []).map((x) => (x.id === m.id ? { ...x, read: next } : x)));
    try {
      await api(`/api/admin/messages/${m.id}`, { method: "PUT", json: { read: next } });
    } catch (err) {
      setMessages((s) => (s ?? []).map((x) => (x.id === m.id ? { ...x, read: !next } : x)));
      toast({ tone: "error", title: "Update failed", detail: err instanceof Error ? err.message : undefined });
    }
  }

  async function markAllRead() {
    if (!messages) return;
    const targets = messages.filter((m) => !m.read);
    if (!targets.length) return;
    setMessages((s) => (s ?? []).map((x) => ({ ...x, read: true })));
    try {
      await Promise.all(
        targets.map((m) => api(`/api/admin/messages/${m.id}`, { method: "PUT", json: { read: true } })),
      );
      toast({ tone: "success", title: "All messages marked as read" });
    } catch {
      load();
      toast({ tone: "error", title: "Could not update some messages" });
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setDeleting(true);
    setMessages((s) => (s ?? []).filter((x) => x.id !== target.id));
    setPendingDelete(null);
    try {
      await api(`/api/admin/messages/${target.id}`, { method: "DELETE" });
      toast({ tone: "success", title: "Message deleted" });
    } catch (err) {
      load();
      toast({ tone: "error", title: "Delete failed", detail: err instanceof Error ? err.message : undefined });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition",
                filter === f
                  ? "bg-accent-400 text-on-accent"
                  : "border border-line bg-surface text-muted hover:text-fg",
              )}
            >
              {f === "all" ? "All" : `Unread${unread ? ` (${unread})` : ""}`}
            </button>
          ))}
        </div>
        <Button variant="soft" size="sm" icon="check" onClick={markAllRead} disabled={!unread}>
          Mark all read
        </Button>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="mail"
          title={filter === "unread" ? "Inbox zero" : "No messages yet"}
          description={
            filter === "unread"
              ? "You've read everything. New visitor messages will land here."
              : "When someone submits the contact form on your portfolio, it shows up here."
          }
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((m) => {
            const open = expanded === m.id;
            return (
              <li
                key={m.id}
                className={cn(
                  "overflow-hidden rounded-2xl border transition",
                  m.read ? "border-line bg-surface/50" : "border-accent-400/30 bg-surface",
                )}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : m.id)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left sm:px-5"
                  aria-expanded={open}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1",
                      m.read ? "bg-surface-2 text-muted ring-line" : "bg-accent-400/15 text-accent-300 ring-accent-400/30",
                    )}
                  >
                    {m.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn("text-sm", m.read ? "font-medium text-fg" : "font-bold text-fg")}>
                        {m.name}
                      </p>
                      {!m.read && <Badge tone="gold">New</Badge>}
                      <span className="ml-auto text-xs text-muted" title={formatDate(m.createdAt)}>
                        {timeAgo(m.createdAt)}
                      </span>
                    </div>
                    <p className={cn("mt-0.5 text-xs", open ? "text-muted" : "line-clamp-1 text-muted")}>
                      {m.body}
                    </p>
                  </div>
                  <Icon
                    name="chevron-down"
                    className={cn("mt-1 h-4 w-4 shrink-0 text-muted transition", open && "rotate-180")}
                  />
                </button>
                {open && (
                  <div className="fade-up border-t border-line bg-canvas/40 px-4 py-4 sm:px-5">
                    <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="mail" className="h-3.5 w-3.5 text-accent-300" /> {m.email}
                      </span>
                      {m.phone && (
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="phone" className="h-3.5 w-3.5 text-accent-300" /> {m.phone}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="clock" className="h-3.5 w-3.5 text-accent-300" /> {formatDate(m.createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{m.body}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} size="sm" icon="send">
                        Reply<span className="sr-only"> to {m.name}</span>
                      </Button>
                      <Button size="sm" variant="soft" icon={m.read ? "mail" : "check"} onClick={() => toggleRead(m)}>
                        {m.read ? "Mark unread" : "Mark read"}<span className="sr-only"> message from {m.name}</span>
                      </Button>
                      <Button size="sm" variant="danger" icon="trash" onClick={() => setPendingDelete(m)}>
                        Delete<span className="sr-only"> message from {m.name}</span>
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Delete message?"
        description={`The message from "${pendingDelete?.name}" will be permanently removed.`}
      />
    </div>
  );
}
