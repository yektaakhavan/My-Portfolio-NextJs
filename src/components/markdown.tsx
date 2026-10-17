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
const components: Components = {
  h1: ({ children }) => <h3 dir="auto" className="mt-6 mb-2 font-display text-xl text-fg first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 dir="auto" className="mt-6 mb-2 font-display text-xl text-fg first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 dir="auto" className="mt-5 mb-1.5 font-display text-lg text-fg first:mt-0">{children}</h4>,
  h4: ({ children }) => <h5 dir="auto" className="mt-4 mb-1 text-base font-bold text-fg first:mt-0">{children}</h5>,
  h5: ({ children }) => <h5 dir="auto" className="mt-4 mb-1 text-base font-bold text-fg first:mt-0">{children}</h5>,
  h6: ({ children }) => <h5 dir="auto" className="mt-4 mb-1 text-base font-bold text-fg first:mt-0">{children}</h5>,
  p: ({ children }) => <p dir="auto" className="my-3 leading-relaxed text-fg/90 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 pl-6 text-fg/90 marker:text-accent-300">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-6 text-fg/90 marker:font-semibold marker:text-accent-300">{children}</ol>,
  li: ({ children }) => <li dir="auto" className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote dir="auto" className="my-4 border-l-4 border-accent-400 bg-surface-2/60 py-1 pr-3 pl-4 text-muted italic">
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
        {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
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
      <table className="w-full min-w-[20rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th scope="col" className="border border-line bg-surface-2 px-3 py-2 font-semibold text-fg">{children}</th>,
  td: ({ children }) => <td className="border border-line px-3 py-2 text-fg/90">{children}</td>,
  img: () => null,
};

export function MarkdownContent({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {source}
    </ReactMarkdown>
  );
}
