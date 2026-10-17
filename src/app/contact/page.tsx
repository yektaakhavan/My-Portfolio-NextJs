import type { Metadata } from "next";
import { PublicForm } from "@/components/forms";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { Card } from "@/components/ui";
import { getProfile } from "@/lib/data";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Contact", description: "Send a private message." };

export default async function ContactPage() {
  const profile = await getProfile();
  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6">
        <PageHeader eyebrow="Get in touch" title="Contact me">
          Have a project in mind or a question? Send a private message — only I can read it.
        </PageHeader>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <h2 className="font-display text-xl text-fg">Contact information</h2>
            {profile && (
              <>
                <Card className="space-y-4 p-5">
                  {profile.email && (
                    <div className="flex items-start gap-3">
                      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/15 text-accent-300 ring-1 ring-accent-400/40"><Icon name="mail" className="h-5 w-5" /></span>
                      <div>
                        <p className="text-xs font-semibold text-muted">Email</p>
                        <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-fg underline-offset-2 hover:text-accent-300 hover:underline">{profile.email}</a>
                      </div>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-start gap-3">
                      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-400/15 text-brand-300 ring-1 ring-brand-400/40"><Icon name="phone" className="h-5 w-5" /></span>
                      <div>
                        <p className="text-xs font-semibold text-muted">Phone / WhatsApp</p>
                        <p className="text-sm font-semibold text-fg">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-start gap-3">
                      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/15 text-accent-300 ring-1 ring-accent-400/40"><Icon name="map-pin" className="h-5 w-5" /></span>
                      <div>
                        <p className="text-xs font-semibold text-muted">Location</p>
                        <p className="text-sm font-semibold text-fg">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </Card>
                <Card className="space-y-2 p-5">
                  <p className="flex items-center gap-2 text-xs font-bold text-ok"><Icon name="shield" className="h-4 w-4" /> Private &amp; protected</p>
                  <p className="text-xs leading-relaxed text-muted">
                    Messages sent here go to my private inbox and are never published. I usually reply within a few days.
                  </p>
                </Card>
              </>
            )}
          </div>
          <Card className="p-6 shadow-2xl sm:p-8">
            <h2 className="mb-4 font-display text-xl text-fg">Send a message</h2>
            <PublicForm variant="contact" />
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}
