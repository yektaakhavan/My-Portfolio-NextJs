import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-xs font-bold tracking-widest text-accent-300 uppercase">Error 404</p>
        <h1 className="mt-2 font-display text-4xl text-fg">Page not found</h1>
        <p className="mt-3 text-sm text-muted">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/" icon="arrow-right">Back to home</Button>
          <Button href="/projects" variant="outline">View projects</Button>
        </div>
      </div>
    </PublicShell>
  );
}
