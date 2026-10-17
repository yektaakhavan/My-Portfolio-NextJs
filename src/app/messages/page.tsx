import type { Metadata } from "next";
import { PublicForm } from "@/components/forms";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { Card, EmptyState } from "@/components/ui";
import { getApprovedMessages } from "@/lib/data";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Messages", description: "Public messages from visitors, shown after review." };

export default async function MessagesPage() {
  const items = await getApprovedMessages(50);
  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6">
        <PageHeader eyebrow="Visitor messages" title="Leave a message">
          Say hello or share feedback. Every message is read by me first and appears here only after I approve it.
        </PageHeader>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section aria-labelledby="wall" className="space-y-4">
            <h2 id="wall" className="font-display text-xl text-fg">Approved messages ({items.length})</h2>
            {items.length === 0 ? (
              <EmptyState as="h3" icon="message" title="No messages yet" description="Be the first to leave one — it will show up after review." />
            ) : (
              <ul className="space-y-4">
                {items.map((m) => (
                  <li key={m.id}>
                    <Card className="p-5">
                      <figure>
                        <blockquote className="whitespace-pre-line text-sm leading-relaxed text-fg/90">{m.body}</blockquote>
                        <figcaption className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
                          <span className="inline-flex items-center gap-2 font-semibold text-accent-300">
                            <Icon name="user" className="h-3.5 w-3.5" />{m.name}
                          </span>
                          <time dateTime={m.createdAt}>{new Date(m.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
                        </figcaption>
                      </figure>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <Card className="h-fit p-6 shadow-2xl sm:p-8">
            <h2 className="mb-4 font-display text-xl text-fg">Write your message</h2>
            <PublicForm variant="public" />
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}
