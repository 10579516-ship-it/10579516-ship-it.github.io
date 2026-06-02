import { toPng } from 'html-to-image';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ============================================================
   Markdown / HTML / PNG export utilities
   ============================================================ */

/** Copy raw Markdown to the system clipboard. */
export async function copyMarkdown(content: string): Promise<void> {
  await navigator.clipboard.writeText(content);
}

/**
 * Render the Markdown to an HTML string and copy it to the clipboard.
 * The HTML includes the same GFM remark plugin used in the preview,
 * but does not include the theme wrapper (the recipient app can
 * style it however it likes).
 */
export async function copyHtml(content: string): Promise<void> {
  const html = renderToStaticMarkup(
    createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], children: content }),
  );
  // Use a Blob + ClipboardItem so we can write both HTML and plain text.
  const item = new ClipboardItem({
    'text/html': new Blob([html], { type: 'text/html' }),
    'text/plain': new Blob([content], { type: 'text/plain' }),
  });
  await navigator.clipboard.write([item]);
}

interface ExportPngOptions {
  /** Background color for the exported image. Falls back to the node's background. */
  backgroundColor?: string;
  /** Pixel ratio (2 = retina). Default: 2. */
  pixelRatio?: number;
  /** Output filename. Default: `ghost-editor.png`. */
  filename?: string;
}

/**
 * Capture a DOM node as a PNG and trigger a download.
 * Used for the "Export PNG" toolbar action — the node passed is
 * the `PreviewPane` root (the `<article data-theme="...">`).
 */
export async function exportNodeAsPng(
  node: HTMLElement,
  opts: ExportPngOptions = {},
): Promise<void> {
  const dataUrl = await toPng(node, {
    pixelRatio: opts.pixelRatio ?? 2,
    backgroundColor: opts.backgroundColor ?? getComputedBackground(node),
    cacheBust: true,
  });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = opts.filename ?? `ghost-editor-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function getComputedBackground(node: HTMLElement): string {
  // Walk up to find a non-transparent background.
  let el: HTMLElement | null = node;
  while (el) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
    el = el.parentElement;
  }
  return '#ffffff';
}
