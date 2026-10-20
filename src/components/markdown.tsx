import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders the project write-up (Markdown) safely:
 *  - raw HTML is NOT allowed, javascript: links are stripped (react-markdown defaults)
 *  - images are not rendered (no third-party requests; screenshots are managed separately)
 *  - headings are shifted down so the page outline stays valid (page h1 → section h2 → write-up h3…)
 *  - dir="auto": paragraphs written in Persian/Arabic are laid out right-to-left automatically
 */
const makeComponents = (newTab: string, article: boolean): Components => ({
  // project write-up sits under an <h2>, so "#"/"##" become <h3>; an article sits under its <h1>, so they become <h2>
  h1: ({ children }) => {
    const H = article ? "h2" : "h3";
    return <H dir="auto" className="mt-8 mb-2 font-display text-2xl text-fg first:mt-0">{children}</H>;
  },
  h2: ({ children }) => {
    const H = article ? "h2" : "h3";
    return <H dir="auto" className="mt-8 mb-2 font-display text-2xl text-fg first:mt-0">{children}</H>;
  },
  h3: ({ children }) => {
    const H = article ? "h3" : "h4";
    return <H dir="auto" className="mt-6 mb-1.5 font-display text-xl text-fg first:mt-0">{children}</H>;
  },
  h4: ({ children }) => {
    const H = article ? "h4" : "h5";
    return <H dir="auto" className="mt-5 mb-1 text-base font-bold text-fg first:mt-0">{children}</H>;
  },
  h5: ({ children }) => <h5 dir="auto" className="mt-4 mb-1 text-base font-bold text-fg first:mt-0">{children}</h5>,
  h6: ({ children }) => <h5 dir="auto" className="mt-4 mb-1 text-base font-bold text-fg first:mt-0">{children}</h5>,
  p: ({ children }) => <p dir="auto" className={article ? "my-4 text-[1.05rem] leading-8 text-fg/90 first:mt-0 last:mb-0" : "my-3 leading-relaxed text-fg/90 first:mt-0 last:mb-0"}>{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 ps-6 text-fg/90 marker:text-accent-300">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 ps-6 text-fg/90 marker:font-semibold marker:text-accent-300">{children}</ol>,
  li: ({ children }) => <li dir="auto" className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote dir="auto" className="my-4 border-s-4 border-accent-400 bg-surface-2/60 py-1 pe-3 ps-4 text-muted italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => {
    const external = !!href && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="font-semibold text-accent-300 underline underline-offset-2 hover:text-fg"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {external ? <span className="sr-only"> {newTab}</span> : null}
      </a>
    );
  },
  strong: ({ children }) => <strong className="font-bold text-fg">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  hr: () => <hr className="my-6 border-line" />,
  code: ({ children, className }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[0.9em] text-fg">{children}</code>
    ),
  pre: ({ children }) => (
    <pre dir="ltr" className="my-4 overflow-x-auto rounded-xl border border-line bg-canvas-deep p-4 font-mono text-sm leading-relaxed text-fg">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full min-w-[20rem] border-collapse text-start text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th scope="col" className="border border-line bg-surface-2 px-3 py-2 font-semibold text-fg">{children}</th>,
  td: ({ children }) => <td className="border border-line px-3 py-2 text-fg/90">{children}</td>,
  img: () => null,
});

export function MarkdownContent({
  source,
  newTabLabel = "(opens in a new tab)",
  variant = "section",
}: {
  source: string;
  newTabLabel?: string;
  /** "article": headings start at <h2> (page title is the <h1>) */
  variant?: "section" | "article";
}) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={makeComponents(newTabLabel, variant === "article")}>
      {source}
    </ReactMarkdown>
  );
}
