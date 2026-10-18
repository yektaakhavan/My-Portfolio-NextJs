import { Fragment, type ReactNode } from "react";

/**
 * Puts React elements into a translated sentence:
 *   rich("I have read the {privacy} and agree.", { privacy: <Link>Privacy Policy</Link> })
 * Each language decides where the link goes, so word order can differ.
 */
export function rich(template: string, parts: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{\w+\})/g).map((chunk, i) => {
    const m = chunk.match(/^\{(\w+)\}$/);
    return m && m[1]! in parts ? <Fragment key={i}>{parts[m[1]!]}</Fragment> : chunk;
  });
}
