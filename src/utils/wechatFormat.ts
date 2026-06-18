/**
 * Platform-specific HTML formatting.
 *
 * Each Chinese publishing platform has different conventions for
 * pasted rich content:
 *   - 微信公众号: strips <style>, strips class, keeps inline style;
 *     typography reads on its own font stack.
 *   - 小红书 (RED): tighter, smaller, image-heavy; compact line-height.
 *   - 知乎 (Zhihu): long-form, generous spacing; code blocks prominent.
 *   - 头条 (Toutiao): news-flow; larger body font for mobile scanning;
 *     strong heading hierarchy.
 *
 * This module renders Markdown to HTML for any of those platforms.
 * The theme colors come from the live preview DOM (`readThemeFromElement`),
 * the platform spacing comes from `PLATFORM_CONFIGS`.
 */

import { createElement, type CSSProperties, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ============================================================
   Theme + DOM reader
   ============================================================ */

export interface PlatformTheme {
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
  /** Optional typography tokens — read from the live preview if present. */
  ruleLength?: string;
  ruleStyle?: string;
  ruleWeight?: string;
}

/** Fallback theme if the preview element isn't mounted yet. */
export const DEFAULT_PLATFORM_THEME: PlatformTheme = {
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
  ruleLength: '60%',
  ruleStyle: 'solid',
  ruleWeight: '1px',
};

/**
 * Read the active theme's CSS custom properties from a rendered
 * `.prose-ghost` element. Returns sensible defaults if any var is missing.
 */
export function readThemeFromElement(el: HTMLElement): PlatformTheme {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string): string => {
    const val = cs.getPropertyValue(name).trim();
    return val || fallback;
  };
  return {
    fontFamily: v('--gh-font', DEFAULT_PLATFORM_THEME.fontFamily),
    color: v('--gh-fg', DEFAULT_PLATFORM_THEME.color),
    h1: v('--gh-h1', DEFAULT_PLATFORM_THEME.h1),
    h2: v('--gh-h2', DEFAULT_PLATFORM_THEME.h2),
    h3: v('--gh-h3', DEFAULT_PLATFORM_THEME.h3),
    quoteBg: v('--gh-quote-bg', DEFAULT_PLATFORM_THEME.quoteBg),
    quoteBorder: v('--gh-quote-border', DEFAULT_PLATFORM_THEME.quoteBorder),
    quoteFg: v('--gh-quote-fg', DEFAULT_PLATFORM_THEME.quoteFg),
    codeBg: v('--gh-code-bg', DEFAULT_PLATFORM_THEME.codeBg),
    codeFg: v('--gh-code-fg', DEFAULT_PLATFORM_THEME.codeFg),
    hr: v('--gh-hr', DEFAULT_PLATFORM_THEME.hr),
    tableBorder: v('--gh-table-border', DEFAULT_PLATFORM_THEME.tableBorder),
    tableStripe: v('--gh-table-stripe', DEFAULT_PLATFORM_THEME.tableStripe),
    link: v('--gh-accent', DEFAULT_PLATFORM_THEME.link),
    ruleLength: v('--gh-rule-length', DEFAULT_PLATFORM_THEME.ruleLength!),
    ruleStyle: v('--gh-rule-style', DEFAULT_PLATFORM_THEME.ruleStyle!),
    ruleWeight: v('--gh-rule-weight', DEFAULT_PLATFORM_THEME.ruleWeight!),
  };
}

/* ============================================================
   Platform-specific spacing / typography
   ------------------------------------------------------------
   Each platform has its own conventions for size, line-height,
   margins, hr style, and code density. These are independent of
   the color theme so a WeChat article always reads like a WeChat
   article regardless of which theme is active.
   ============================================================ */

export type PlatformId = 'wechat' | 'xiaohongshu' | 'zhihu' | 'toutiao';

export interface PlatformConfig {
  /** Display name (Chinese). */
  label: string;
  /** Display name (English). */
  labelEn: string;
  /** Section body font size. */
  fontSize: string;
  /** Section body line-height. */
  lineHeight: string;
  /** Section top/bottom padding around the article. */
  sectionPadding: string;
  /** h1 size. */
  h1Size: string;
  /** h2 size. */
  h2Size: string;
  /** h3 size. */
  h3Size: string;
  /** Heading top/bottom margin. */
  headingMargin: string;
  /** Heading underline (sets bottom-border on h2) — matches active theme. */
  useThemeHrUnderline: boolean;
  /** Paragraph top/bottom margin. */
  paragraphMargin: string;
  /** HR style override (the visual style attribute). */
  hrStyle: string;
  /** Blockquote padding. */
  blockquotePadding: string;
  /** Inline code padding. */
  codePadding: string;
  /** List item spacing. */
  listMargin: string;
}

export const PLATFORM_CONFIGS: Record<PlatformId, PlatformConfig> = {
  wechat: {
    label: '微信公众号',
    labelEn: 'WeChat',
    fontSize: '16px',
    lineHeight: '1.75',
    sectionPadding: '0',
    h1Size: '22px',
    h2Size: '20px',
    h3Size: '18px',
    headingMargin: '1.4em 0 0.6em',
    useThemeHrUnderline: true,
    paragraphMargin: '1em 0',
    hrStyle: '1px solid',
    blockquotePadding: '0.6em 1em',
    codePadding: '0.1em 0.35em',
    listMargin: '0.3em 0',
  },
  xiaohongshu: {
    label: '小红书',
    labelEn: 'RED Note',
    fontSize: '15px',
    lineHeight: '1.7',
    sectionPadding: '0',
    h1Size: '19px',
    h2Size: '17px',
    h3Size: '15px',
    headingMargin: '1.1em 0 0.4em',
    useThemeHrUnderline: true,
    paragraphMargin: '0.7em 0',
    hrStyle: '1px dashed',
    blockquotePadding: '0.5em 0.8em',
    codePadding: '0.05em 0.3em',
    listMargin: '0.2em 0',
  },
  zhihu: {
    label: '知乎',
    labelEn: 'Zhihu',
    fontSize: '16px',
    lineHeight: '1.85',
    sectionPadding: '0',
    h1Size: '22px',
    h2Size: '19px',
    h3Size: '17px',
    headingMargin: '1.6em 0 0.6em',
    useThemeHrUnderline: true,
    paragraphMargin: '1.1em 0',
    hrStyle: '1px solid',
    blockquotePadding: '0.7em 1.1em',
    codePadding: '0.15em 0.4em',
    listMargin: '0.4em 0',
  },
  toutiao: {
    label: '头条',
    labelEn: 'Toutiao',
    fontSize: '17px',
    lineHeight: '1.8',
    sectionPadding: '0',
    h1Size: '24px',
    h2Size: '20px',
    h3Size: '17px',
    headingMargin: '1.3em 0 0.5em',
    useThemeHrUnderline: true,
    paragraphMargin: '1em 0',
    hrStyle: '2px solid',
    blockquotePadding: '0.6em 1em',
    codePadding: '0.1em 0.35em',
    listMargin: '0.3em 0',
  },
};

/* ============================================================
   Backward-compat alias: WechatTheme = PlatformTheme.
   ============================================================ */

export type WechatTheme = PlatformTheme;
export const DEFAULT_WECHAT_THEME = DEFAULT_PLATFORM_THEME;

/* ============================================================
   Component factory — returns a fresh components map for ReactMarkdown
   with the supplied theme AND platform config.
   ============================================================ */

type AnyProps = { children?: ReactNode; node?: unknown; className?: string; [k: string]: unknown };

const el = (
  tag: keyof React.JSX.IntrinsicElements,
  baseStyle: CSSProperties,
  extraStyle?: (props: AnyProps) => CSSProperties,
) =>
  // eslint-disable-next-line react/display-name
  ({ children, ...rest }: AnyProps) => {
    const merged: CSSProperties = extraStyle
      ? { ...baseStyle, ...extraStyle(rest) }
      : baseStyle;
    const finalStyle: CSSProperties = rest.style
      ? { ...merged, ...(rest.style as CSSProperties) }
      : merged;
    return createElement(tag, { ...rest, style: finalStyle }, children);
  };

export function makePlatformComponents(theme: PlatformTheme, platform: PlatformConfig) {
  // Compose the H2 underline from the active theme tokens (length,
  // style, weight, color) — exactly like the live preview's ::after rule.
  const h2Border =
    `${platform.useThemeHrUnderline ? theme.ruleWeight || '1px' : '1px'} ` +
    `${platform.useThemeHrUnderline ? theme.ruleStyle || 'solid' : platform.hrStyle} ` +
    `${theme.hr}`;

  // HR style: width comes from theme rule-length (e.g. 50%) so the divider
  // length visually matches the preview's <hr>; vertical style stays on
  // platform config.
  const hrStyleAttr =
    `${platform.hrStyle.split(' ')[0] || '1px'} ` +
    `${platform.hrStyle.split(' ')[1] || 'solid'} ` +
    `${theme.hr}`;

  return {
    h1: el('h1', {
      fontSize: platform.h1Size,
      fontWeight: 'bold',
      margin: platform.headingMargin,
      color: theme.h1,
      fontFamily: theme.fontFamily,
      lineHeight: '1.3',
    }),
    h2: el('h2', {
      fontSize: platform.h2Size,
      fontWeight: 'bold',
      margin: platform.headingMargin,
      color: theme.h2,
      fontFamily: theme.fontFamily,
      lineHeight: '1.3',
      paddingBottom: '0.3em',
      // Note: pasted HTML doesn't honor width: var(); render as full-width
      // border here so it always reads. The COLOR + WEIGHT + STYLE still
      // come from the theme.
      borderBottom: h2Border,
    }),
    h3: el('h3', {
      fontSize: platform.h3Size,
      fontWeight: 'bold',
      margin: platform.headingMargin,
      color: theme.h3,
      fontFamily: theme.fontFamily,
      lineHeight: '1.35',
    }),
    h4: el('h4', {
      fontSize: '15px',
      fontWeight: 'bold',
      margin: '1em 0 0.4em',
      color: theme.h3,
      fontFamily: theme.fontFamily,
    }),
    h5: el('h5', {
      fontSize: '14px',
      fontWeight: 'bold',
      margin: '1em 0 0.4em',
      color: theme.h3,
      fontFamily: theme.fontFamily,
    }),
    h6: el('h6', {
      fontSize: '13px',
      fontWeight: 'bold',
      margin: '1em 0 0.4em',
      color: theme.h3,
      fontFamily: theme.fontFamily,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }),

    p: el('p', {
      margin: platform.paragraphMargin,
      color: theme.color,
      fontFamily: theme.fontFamily,
      fontSize: platform.fontSize,
      lineHeight: platform.lineHeight,
    }),

    blockquote: el('blockquote', {
      margin: '1em 0',
      padding: platform.blockquotePadding,
      background: theme.quoteBg,
      borderLeft: `3px solid ${theme.quoteBorder}`,
      color: theme.quoteFg,
      fontFamily: theme.fontFamily,
      fontSize: platform.fontSize,
      lineHeight: platform.lineHeight,
      borderRadius: '0 4px 4px 0',
    }),

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
          padding: platform.codePadding,
          borderRadius: '3px',
          fontSize: '0.9em',
          margin: '0 0.1em',
          border: 'none',
        },
      }, children);
    },

    pre: el('pre', {
      margin: '1em 0',
      padding: '0.9em 1.1em',
      background: theme.codeBg,
      color: theme.codeFg,
      borderRadius: '6px',
      overflowX: 'auto',
      fontFamily: 'Menlo, Consolas, monospace',
      fontSize: '14px',
      lineHeight: '1.55',
      border: 'none',
    }),

    ul: el('ul', {
      margin: '1em 0',
      paddingLeft: '1.8em',
      listStyle: 'disc',
      color: theme.color,
      fontFamily: theme.fontFamily,
      fontSize: platform.fontSize,
      lineHeight: platform.lineHeight,
    }),
    ol: el('ol', {
      margin: '1em 0',
      paddingLeft: '1.8em',
      listStyle: 'decimal',
      color: theme.color,
      fontFamily: theme.fontFamily,
      fontSize: platform.fontSize,
      lineHeight: platform.lineHeight,
    }),
    li: el('li', {
      margin: platform.listMargin,
      color: theme.color,
      fontFamily: theme.fontFamily,
      fontSize: platform.fontSize,
      lineHeight: platform.lineHeight,
    }),

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

    hr: ({ children, ...rest }: AnyProps) =>
      createElement('hr', {
        ...rest,
        style: {
          border: 'none',
          borderTop: hrStyleAttr,
          margin: '2em 0',
        },
      }, children),

    img: el('img', {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      margin: '1em auto',
      borderRadius: '4px',
    }),

    table: el('table', {
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
    th: el('th', {
      border: `1px solid ${theme.tableBorder}`,
      padding: '0.5em 0.8em',
      textAlign: 'left',
      fontWeight: 'bold',
      color: theme.color,
      background: theme.tableStripe,
    }),
    td: el('td', {
      border: `1px solid ${theme.tableBorder}`,
      padding: '0.5em 0.8em',
      color: theme.color,
    }),

    strong: el('strong', { fontWeight: 'bold', color: theme.color, fontFamily: theme.fontFamily }),
    em: el('em', { fontStyle: 'italic', color: theme.color, fontFamily: theme.fontFamily }),
    del: el('del', { color: theme.quoteFg, textDecoration: 'line-through', fontFamily: theme.fontFamily }),
  };
}

/** Backward-compat: old name. */
export const makeWechatComponents = makePlatformComponents;

/* ============================================================
   Public API
   ============================================================ */

/**
 * Render Markdown to a platform-specific HTML string with inline styles.
 * The output is wrapped in a `<section>` with body typography.
 *
 * Note: we intentionally do NOT set a background on the `<section>` —
 * most platforms strip background-color on the root container.
 */
export function renderPlatformHtml(
  markdown: string,
  platform: PlatformConfig,
  theme: PlatformTheme = DEFAULT_PLATFORM_THEME,
): string {
  const inner = renderToStaticMarkup(
    createElement(ReactMarkdown, {
      remarkPlugins: [remarkGfm],
      components: makePlatformComponents(theme, platform) as never,
      children: markdown,
    }),
  );
  const sectionStyle: CSSProperties = {
    color: theme.color,
    fontFamily: theme.fontFamily,
    fontSize: platform.fontSize,
    lineHeight: platform.lineHeight,
    wordBreak: 'break-word',
    maxWidth: '100%',
  };
  return `<section style="${cssObjectToString(sectionStyle)}">${inner}</section>`;
}

/** Backward-compat alias for WeChat-only rendering. */
export function renderWechatHtml(markdown: string, theme: PlatformTheme = DEFAULT_PLATFORM_THEME): string {
  return renderPlatformHtml(markdown, PLATFORM_CONFIGS.wechat, theme);
}

/**
 * Copy Markdown content to the clipboard, formatted for a given platform.
 * Writes both `text/html` (the styled HTML) and `text/plain` (the raw
 * Markdown) so the user can paste into the target editor and get rich
 * formatting.
 */
export async function copyMarkdownAsPlatform(
  platformId: PlatformId,
  markdown: string,
  theme: PlatformTheme = DEFAULT_PLATFORM_THEME,
): Promise<void> {
  const platform = PLATFORM_CONFIGS[platformId];
  const html = renderPlatformHtml(markdown, platform, theme);
  const item = new ClipboardItem({
    'text/html': new Blob([html], { type: 'text/html' }),
    'text/plain': new Blob([markdown], { type: 'text/plain' }),
  });
  await navigator.clipboard.write([item]);
}

// Convenience wrappers, one per platform.
export const copyMarkdownAsWechat      = (md: string, theme?: PlatformTheme) => copyMarkdownAsPlatform('wechat',       md, theme);
export const copyMarkdownAsXiaohongshu = (md: string, theme?: PlatformTheme) => copyMarkdownAsPlatform('xiaohongshu',  md, theme);
export const copyMarkdownAsZhihu       = (md: string, theme?: PlatformTheme) => copyMarkdownAsPlatform('zhihu',        md, theme);
export const copyMarkdownAsToutiao     = (md: string, theme?: PlatformTheme) => copyMarkdownAsPlatform('toutiao',      md, theme);

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