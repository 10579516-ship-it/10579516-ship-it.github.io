/**
 * WeChat (微信公众号) HTML formatting.
 *
 * WeChat's official-account editor:
 *   - Strips `<style>` tags completely.
 *   - Strips `class` attributes.
 *   - Keeps inline `style="..."` attributes verbatim.
 *   - Renders a curated subset of HTML (p, h1–h6, blockquote, ul, ol, li,
 *     code, pre, a, img, table, thead, tbody, tr, th, td, hr, strong, em, etc.).
 *   - **Does NOT preserve** `background-color` on body / section / generic
 *     containers. **DOES preserve** it on code, pre, blockquote, th, td, hr.
 *   - **Preserves** `color` and `font-family` on every element.
 *
 * So the strategy:
 *   1. Read the active theme's CSS variables from the live preview DOM
 *      (via `getComputedStyle`).
 *   2. Render Markdown to HTML with **inline styles** that use those
 *      theme colors.
 *   3. Skip section background-color (it'd be stripped anyway).
 *
 * This way, pasting into 微信公众平台 produces typography that matches
 * what the user sees in Ghost Editor.
 */

import { createElement, type CSSProperties, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ============================================================
   Theme type + DOM reader
   ============================================================ */

export interface WechatTheme {
  fontFamily: string;
  color: string;
  h1: string;
  h2: string;
  h3: string;
  quoteBg: string;
  quoteBorder: string;
  quoteFg: string;
  codeBg: string;
  codeFg: string;
  hr: string;
  tableBorder: string;
  tableStripe: string;
  link: string;
}

/** Fallback theme if the preview element isn't mounted yet. */
export const DEFAULT_WECHAT_THEME: WechatTheme = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  color: '#1f2328',
  h1: '#1f2328',
  h2: '#1f2328',
  h3: '#374151',
  quoteBg: '#f6f8fa',
  quoteBorder: '#d0d7de',
  quoteFg: '#57606a',
  codeBg: '#f6f8fa',
  codeFg: '#1f2328',
  hr: '#d0d7de',
  tableBorder: '#d0d7de',
  tableStripe: '#f6f8fa',
  link: '#0969da',
};

/**
 * Read the active theme's CSS custom properties from a rendered
 * `.prose-ghost` element. Returns sensible defaults if any var is missing.
 */
export function readThemeFromElement(el: HTMLElement): WechatTheme {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string): string => {
    const val = cs.getPropertyValue(name).trim();
    return val || fallback;
  };
  return {
    fontFamily: v('--gh-font', DEFAULT_WECHAT_THEME.fontFamily),
    color: v('--gh-fg', DEFAULT_WECHAT_THEME.color),
    h1: v('--gh-h1', DEFAULT_WECHAT_THEME.h1),
    h2: v('--gh-h2', DEFAULT_WECHAT_THEME.h2),
    h3: v('--gh-h3', DEFAULT_WECHAT_THEME.h3),
    quoteBg: v('--gh-quote-bg', DEFAULT_WECHAT_THEME.quoteBg),
    quoteBorder: v('--gh-quote-border', DEFAULT_WECHAT_THEME.quoteBorder),
    quoteFg: v('--gh-quote-fg', DEFAULT_WECHAT_THEME.quoteFg),
    codeBg: v('--gh-code-bg', DEFAULT_WECHAT_THEME.codeBg),
    codeFg: v('--gh-code-fg', DEFAULT_WECHAT_THEME.codeFg),
    hr: v('--gh-hr', DEFAULT_WECHAT_THEME.hr),
    tableBorder: v('--gh-table-border', DEFAULT_WECHAT_THEME.tableBorder),
    tableStripe: v('--gh-table-stripe', DEFAULT_WECHAT_THEME.tableStripe),
    link: v('--gh-accent', DEFAULT_WECHAT_THEME.link),
  };
}

/* ============================================================
   Component factory — returns a fresh components map for ReactMarkdown
   with the supplied theme. Every element gets a `style="..."` attribute
   using theme colors.
   ============================================================ */

type AnyProps = { children?: ReactNode; node?: unknown; className?: string; [k: string]: unknown };

const Wc = (
  tag: keyof React.JSX.IntrinsicElements,
  baseStyle: CSSProperties,
  extraStyle?: (props: AnyProps) => CSSProperties,
) =>
  // eslint-disable-next-line react/display-name
  ({ children, ...rest }: AnyProps) => {
    const merged: CSSProperties = extraStyle
      ? { ...baseStyle, ...extraStyle(rest) }
      : baseStyle;
    // Allow per-call overrides (e.g. style on a code-block) to take precedence.
    const finalStyle: CSSProperties = rest.style
      ? { ...merged, ...(rest.style as CSSProperties) }
      : merged;
    return createElement(tag, { ...rest, style: finalStyle }, children);
  };

export function makeWechatComponents(theme: WechatTheme) {
  return {
    h1: Wc('h1', {
      fontSize: '22px',
      fontWeight: 'bold',
      margin: '1.5em 0 0.6em',
      color: theme.h1,
      fontFamily: theme.fontFamily,
    }),
    h2: Wc('h2', {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '1.4em 0 0.5em',
      color: theme.h2,
      fontFamily: theme.fontFamily,
      paddingBottom: '0.3em',
      borderBottom: `1px solid ${theme.hr}`,
    }),
    h3: Wc('h3', {
      fontSize: '18px',
      fontWeight: 'bold',
      margin: '1.2em 0 0.4em',
      color: theme.h3,
      fontFamily: theme.fontFamily,
    }),
    h4: Wc('h4', {
      fontSize: '16px',
      fontWeight: 'bold',
      margin: '1em 0 0.4em',
      color: theme.h3,
      fontFamily: theme.fontFamily,
    }),
    h5: Wc('h5', {
      fontSize: '15px',
      fontWeight: 'bold',
      margin: '1em 0 0.4em',
      color: theme.h3,
      fontFamily: theme.fontFamily,
    }),
    h6: Wc('h6', {
      fontSize: '14px',
      fontWeight: 'bold',
      margin: '1em 0 0.4em',
      color: theme.h3,
      fontFamily: theme.fontFamily,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }),

    p: Wc('p', {
      margin: '1em 0',
      color: theme.color,
      fontFamily: theme.fontFamily,
      fontSize: '16px',
      lineHeight: '1.75',
    }),

    blockquote: Wc('blockquote', {
      margin: '1em 0',
      padding: '0.6em 1em',
      background: theme.quoteBg,
      borderLeft: `3px solid ${theme.quoteBorder}`,
      color: theme.quoteFg,
      fontFamily: theme.fontFamily,
      borderRadius: '0 4px 4px 0',
    }),

    // Inline code: no `pre` parent.
    code: ({ children, className, ...rest }: AnyProps) => {
      const isBlock = className && /language-/.test(String(className));
      if (isBlock) {
        return createElement('code', {
          ...rest,
          className,
          style: {
            fontFamily: 'Menlo, Consolas, monospace',
            background: 'transparent',
            color: 'inherit',
            padding: 0,
            fontSize: 'inherit',
            border: 'none',
            borderRadius: 0,
          },
        }, children);
      }
      return createElement('code', {
        ...rest,
        style: {
          fontFamily: 'Menlo, Consolas, monospace',
          background: theme.codeBg,
          color: theme.codeFg,
          padding: '0.1em 0.35em',
          borderRadius: '3px',
          fontSize: '0.9em',
          margin: '0 0.1em',
          border: 'none',
        },
      }, children);
    },

    pre: Wc('pre', {
      margin: '1em 0',
      padding: '0.9em 1.1em',
      background: theme.codeBg,
      color: theme.codeFg,
      borderRadius: '6px',
      overflowX: 'auto',
      fontFamily: 'Menlo, Consolas, monospace',
      fontSize: '14px',
      lineHeight: '1.5',
      border: 'none',
    }),

    ul: Wc('ul', { margin: '1em 0', paddingLeft: '1.8em', listStyle: 'disc', color: theme.color, fontFamily: theme.fontFamily }),
    ol: Wc('ol', { margin: '1em 0', paddingLeft: '1.8em', listStyle: 'decimal', color: theme.color, fontFamily: theme.fontFamily }),
    li: Wc('li', { margin: '0.3em 0', color: theme.color, fontFamily: theme.fontFamily, fontSize: '16px', lineHeight: '1.75' }),

    a: ({ children, ...rest }: AnyProps) =>
      createElement('a', {
        ...rest,
        target: '_blank',
        rel: 'noreferrer',
        style: {
          color: theme.link,
          textDecoration: 'none',
          borderBottom: `1px solid ${theme.link}`,
          fontFamily: theme.fontFamily,
        },
      }, children),

    hr: Wc('hr', {
      border: 'none',
      borderTop: `1px solid ${theme.hr}`,
      margin: '2em 0',
    }),

    img: Wc('img', {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      margin: '1em auto',
      borderRadius: '4px',
    }),

    table: Wc('table', {
      borderCollapse: 'collapse',
      width: '100%',
      margin: '1em 0',
      fontSize: '14px',
      fontFamily: theme.fontFamily,
    }),
    thead: ({ children }: AnyProps) =>
      createElement('thead', { style: { background: theme.tableStripe } }, children),
    tbody: ({ children }: AnyProps) => createElement('tbody', { style: {} }, children),
    tr: ({ children }: AnyProps) => createElement('tr', { style: {} }, children),
    th: Wc('th', {
      border: `1px solid ${theme.tableBorder}`,
      padding: '0.5em 0.8em',
      textAlign: 'left',
      fontWeight: 'bold',
      color: theme.color,
      background: theme.tableStripe,
    }),
    td: Wc('td', {
      border: `1px solid ${theme.tableBorder}`,
      padding: '0.5em 0.8em',
      color: theme.color,
    }),

    strong: Wc('strong', { fontWeight: 'bold', color: theme.color, fontFamily: theme.fontFamily }),
    em: Wc('em', { fontStyle: 'italic', color: theme.color, fontFamily: theme.fontFamily }),
    del: Wc('del', { color: theme.quoteFg, textDecoration: 'line-through', fontFamily: theme.fontFamily }),
  };
}

/* ============================================================
   Public API
   ============================================================ */

/**
 * Render Markdown to a WeChat-compatible HTML string with inline styles.
 * The output is wrapped in a `<section>` with body typography.
 *
 * Note: we intentionally do NOT set a background on the `<section>` —
 * WeChat strips background-color on body-level containers, and a stray
 * background on a top-level wrapper sometimes also blocks the editor's
 * own theme from showing through.
 */
export function renderWechatHtml(markdown: string, theme: WechatTheme = DEFAULT_WECHAT_THEME): string {
  const inner = renderToStaticMarkup(
    createElement(ReactMarkdown, {
      remarkPlugins: [remarkGfm],
      components: makeWechatComponents(theme) as never,
      children: markdown,
    }),
  );
  // Section-level: only typography (color, font, size, line-height, maxWidth).
  // No background-color — WeChat strips it on the root container anyway.
  const sectionStyle: CSSProperties = {
    color: theme.color,
    fontFamily: theme.fontFamily,
    fontSize: '16px',
    lineHeight: '1.75',
    wordBreak: 'break-word',
    maxWidth: '100%',
  };
  return `<section style="${cssObjectToString(sectionStyle)}">${inner}</section>`;
}

/**
 * Copy Markdown content to the clipboard, formatted for WeChat pasting.
 * Writes both `text/html` (the styled HTML) and `text/plain` (the raw
 * Markdown) to the clipboard, so the user can paste into WeChat's
 * editor and get rich formatting.
 */
export async function copyMarkdownAsWechat(
  markdown: string,
  theme: WechatTheme = DEFAULT_WECHAT_THEME,
): Promise<void> {
  const html = renderWechatHtml(markdown, theme);
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
