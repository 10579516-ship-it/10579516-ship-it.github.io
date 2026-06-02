/**
 * WeChat (微信公众号) HTML formatting.
 *
 * WeChat's official-account editor:
 *   - Strips `<style>` tags completely.
 *   - Strips `class` attributes.
 *   - Keeps inline `style="..."` attributes verbatim.
 *   - Renders a curated subset of HTML (p, h1–h6, blockquote, ul, ol, li,
 *     code, pre, a, img, table, thead, tbody, tr, th, td, hr, strong, em, etc.).
 *
 * So to paste nicely into WeChat, we need to render Markdown to HTML
 * with **inline styles only** — no classNames, no stylesheets.
 *
 * This module renders Markdown to that format using React-Markdown
 * with a `components` map that injects `style={{...}}` props. React's
 * server-side renderer (`renderToStaticMarkup`) converts those
 * camelCase style objects to kebab-case CSS strings in the output.
 */

import { createElement, type CSSProperties, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ============================================================
   WeChat-friendly style tokens
   ============================================================ */

const W = {
  section: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    color: '#333333',
    fontSize: '16px',
    lineHeight: '1.75',
    wordBreak: 'break-word',
    maxWidth: '100%',
  } satisfies CSSProperties,

  h1: { fontSize: '22px', fontWeight: 'bold', margin: '1.5em 0 0.6em', color: '#000000' } satisfies CSSProperties,
  h2: { fontSize: '20px', fontWeight: 'bold', margin: '1.4em 0 0.5em', color: '#000000' } satisfies CSSProperties,
  h3: { fontSize: '18px', fontWeight: 'bold', margin: '1.2em 0 0.4em', color: '#1a1a1a' } satisfies CSSProperties,
  h4: { fontSize: '16px', fontWeight: 'bold', margin: '1em 0 0.4em', color: '#1a1a1a' } satisfies CSSProperties,
  h5: { fontSize: '15px', fontWeight: 'bold', margin: '1em 0 0.4em', color: '#1a1a1a' } satisfies CSSProperties,
  h6: { fontSize: '14px', fontWeight: 'bold', margin: '1em 0 0.4em', color: '#666666' } satisfies CSSProperties,

  p: { margin: '1em 0', color: '#333333' } satisfies CSSProperties,

  blockquote: {
    margin: '1em 0',
    padding: '0.6em 1em',
    background: '#f7f7f7',
    borderLeft: '3px solid #d0d0d0',
    color: '#666666',
  } satisfies CSSProperties,

  code: {
    fontFamily: 'Menlo, Consolas, monospace',
    background: '#f5f5f5',
    color: '#c7254e',
    padding: '0.1em 0.35em',
    borderRadius: '3px',
    fontSize: '0.9em',
    margin: '0 0.1em',
  } satisfies CSSProperties,

  pre: {
    margin: '1em 0',
    padding: '0.9em 1.1em',
    background: '#f5f5f5',
    color: '#333333',
    borderRadius: '6px',
    overflowX: 'auto',
    fontFamily: 'Menlo, Consolas, monospace',
    fontSize: '14px',
    lineHeight: '1.5',
  } satisfies CSSProperties,

  ul: { margin: '1em 0', paddingLeft: '1.8em', listStyle: 'disc' } satisfies CSSProperties,
  ol: { margin: '1em 0', paddingLeft: '1.8em', listStyle: 'decimal' } satisfies CSSProperties,
  li: { margin: '0.3em 0', color: '#333333' } satisfies CSSProperties,

  a: { color: '#576b95', textDecoration: 'none', borderBottom: '1px solid #576b95' } satisfies CSSProperties,

  hr: { border: 'none', borderTop: '1px solid #e5e5e5', margin: '2em 0' } satisfies CSSProperties,

  img: { maxWidth: '100%', height: 'auto', display: 'block', margin: '1em auto', borderRadius: '4px' } satisfies CSSProperties,

  table: {
    borderCollapse: 'collapse',
    width: '100%',
    margin: '1em 0',
    fontSize: '14px',
  } satisfies CSSProperties,
  th: {
    border: '1px solid #dddddd',
    padding: '0.5em 0.8em',
    textAlign: 'left',
    fontWeight: 'bold',
    background: '#f5f5f5',
    color: '#1a1a1a',
  } satisfies CSSProperties,
  td: {
    border: '1px solid #dddddd',
    padding: '0.5em 0.8em',
    color: '#333333',
  } satisfies CSSProperties,

  strong: { fontWeight: 'bold', color: '#1a1a1a' } satisfies CSSProperties,
  em: { fontStyle: 'italic' } satisfies CSSProperties,
  del: { color: '#999999', textDecoration: 'line-through' } satisfies CSSProperties,
} as const;

/* ============================================================
   Component map — every Markdown element gets a WeChat style.
   We do NOT support nested style overrides per-element, because
   WeChat's editor doesn't honor complex selectors anyway. A flat
   set of rules is what actually works.
   ============================================================ */

type AnyProps = { children?: ReactNode; node?: unknown; [k: string]: unknown };

const Wc = (tag: keyof React.JSX.IntrinsicElements, baseStyle: CSSProperties) =>
  // eslint-disable-next-line react/display-name
  ({ children, ...rest }: AnyProps) =>
    createElement(tag, { ...rest, style: { ...baseStyle, ...(rest.style as CSSProperties | undefined) } }, children);

const wechatComponents = {
  h1: Wc('h1', W.h1),
  h2: Wc('h2', W.h2),
  h3: Wc('h3', W.h3),
  h4: Wc('h4', W.h4),
  h5: Wc('h5', W.h5),
  h6: Wc('h6', W.h6),
  p: Wc('p', W.p),
  blockquote: Wc('blockquote', W.blockquote),
  // Inline code: no `pre` parent.
  code: ({ children, className, ...rest }: AnyProps) => {
    // If the parent is <pre>, this is a fenced code block — style the pre
    // and let code be plain. Otherwise it's inline code.
    const isBlock = className && /language-/.test(String(className));
    if (isBlock) {
      return createElement('code', { ...rest, className, style: { fontFamily: 'inherit', background: 'transparent', color: 'inherit', padding: 0 } }, children);
    }
    return createElement('code', { ...rest, style: W.code }, children);
  },
  pre: Wc('pre', W.pre),
  ul: Wc('ul', W.ul),
  ol: Wc('ol', W.ol),
  li: Wc('li', W.li),
  a: ({ children, ...rest }: AnyProps) => createElement('a', { ...rest, target: '_blank', rel: 'noreferrer', style: W.a }, children),
  hr: Wc('hr', W.hr),
  img: Wc('img', W.img),
  table: Wc('table', W.table),
  thead: ({ children }: AnyProps) => createElement('thead', { style: { background: '#f5f5f5' } }, children),
  tbody: ({ children }: AnyProps) => createElement('tbody', { style: {} }, children),
  tr: ({ children }: AnyProps) => createElement('tr', { style: {} }, children),
  th: Wc('th', W.th),
  td: Wc('td', W.td),
  strong: Wc('strong', W.strong),
  em: Wc('em', W.em),
  del: Wc('del', W.del),
};

/* ============================================================
   Public API
   ============================================================ */

/**
 * Render Markdown to a WeChat-compatible HTML string with inline styles.
 * The output is wrapped in a `<section>` with body typography.
 */
export function renderWechatHtml(markdown: string): string {
  const inner = renderToStaticMarkup(
    createElement(ReactMarkdown, {
      remarkPlugins: [remarkGfm],
      components: wechatComponents as never,
      children: markdown,
    }),
  );
  // Wrap in a section with body styles. `<section>` is safe in WeChat.
  return `<section style="${cssObjectToString(W.section)}">${inner}</section>`;
}

/**
 * Copy Markdown content to the clipboard, formatted for WeChat pasting.
 * Writes both `text/html` (the styled HTML) and `text/plain` (the raw
 * Markdown) to the clipboard, so the user can paste into WeChat's
 * editor and get rich formatting.
 */
export async function copyMarkdownAsWechat(markdown: string): Promise<void> {
  const html = renderWechatHtml(markdown);
  const item = new ClipboardItem({
    'text/html': new Blob([html], { type: 'text/html' }),
    'text/plain': new Blob([markdown], { type: 'text/plain' }),
  });
  await navigator.clipboard.write([item]);
}

/* ============================================================
   Helper: convert a CSSProperties object to an inline style string.
   ============================================================ */

function cssObjectToString(style: CSSProperties): string {
  return Object.entries(style)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${camelToKebab(k)}: ${v}`)
    .join('; ');
}

function camelToKebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}
