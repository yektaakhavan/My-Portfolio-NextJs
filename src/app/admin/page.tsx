import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { Badge, Button, Card } from "@/components/ui";
import { getAdminOverview } from "@/lib/data";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const data = await getAdminOverview();
  const cards: { label: string; value: number; icon: IconName; href: string; note?: string }[] = [
    { label: "Waiting for approval", value: data.stats.pendingPublic, icon: "shield", href: "/admin/moderation", note: data.stats.pendingPublic ? "needs review" : undefined },
    { label: "Inbox messages", value: data.stats.messages, icon: "mail", href: "/admin/messages", note: data.stats.unread ? `${data.stats.unread} new` : undefined },
    { label: "Projects", value: data.stats.projects, icon: "folder", href: "/admin/projects" },
    { label: "Skills", value: data.stats.skills, icon: "code", href: "/admin/skills" },
  ];

  return (
    <div className="space-y-6">
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="group block h-full rounded-2xl">
              <Card className="h-full p-5 transition group-hover:border-accent-400/60">
                <div className="flex items-start justify-between">
                  <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400/12 text-accent-300 ring-1 ring-accent-400/30">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  {c.note && <Badge tone="gold">{c.note}</Badge>}
                </div>
                <p className="mt-4 font-display text-3xl text-fg">{c.value}</p>
                <p className="mt-0.5 text-xs font-semibold text-muted">{c.label}</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-fg">Recent private messages</h2>
            <Link href="/admin/messages" className="text-xs font-semibold text-accent-300 hover:underline">View inbox</Link>
          </div>
          {data.recentMessages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No messages yet. They will appear here when visitors contact you.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.recentMessages.map((m) => (
                <li key={m.id} className="flex items-start gap-3 py-3">
                  <span aria-hidden className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-accent-300 ring-1 ring-line">
                    {m.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-fg">{m.name}</p>
                      {!m.read && <Badge tone="gold">New</Badge>}
                      <span className="ml-auto shrink-0 text-xs text-muted">{timeAgo(m.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted">{m.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 font-display text-lg text-fg">Live projects</h2>
            {data.recentProjects.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">No projects yet.</p>
            ) : (
              <ul className="space-y-2">
                {data.recentProjects.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 rounded-lg border border-line bg-canvas/50 px-3 py-2.5">
                    <Icon name="folder" className="h-4 w-4 text-brand-300" />
                    <span className="truncate text-sm font-medium text-fg">{p.title}</span>
                    {p.featured && (
                      <span className="ml-auto text-accent-300">
                        <Icon name="star" className="h-3.5 w-3.5" />
                        <span className="sr-only">Featured</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Button href="/admin/projects" variant="soft" size="sm" icon="plus" className="mt-4 w-full">Manage projects</Button>
          </Card>
          <Card className="p-5">
            <h2 className="mb-2 font-display text-lg text-fg">Quick actions</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button href="/admin/profile" variant="outline" size="sm" icon="user" className="w-full">Edit profile</Button>
              <Button href="/admin/projects" variant="outline" size="sm" icon="upload" className="w-full">Upload images</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
