import { forwardRef, type ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils/cn';

interface PreviewPaneProps {
  content: string;
  themeId: string;
}

/**
 * The live Markdown preview.
 *
 * Theming works via a `data-theme` attribute on the root `<article>`.
 * The actual color application happens in `src/index.css`:
 *   .prose-ghost { background: var(--gh-bg); color: var(--gh-fg); ... }
 *   [data-theme="dracula"] { --gh-bg: #...; ... }
 *
 * This means switching themes is a single attribute change — no React
 * reconciliation of per-element styles, no remount, no flicker.
 *
 * The `forwardRef` exposes the root element so the parent can use it
 * as the source for PNG export (`html-to-image`).
 */
export const PreviewPane = forwardRef<HTMLElement, PreviewPaneProps>(
  function PreviewPane({ content, themeId }, ref) {
    // Note: `ReactMarkdown` doesn't accept `className` on its root,
    // so we wrap it in an `<article>` and pass the className there.
    return (
      <article
        ref={ref as React.Ref<HTMLElement>}
        data-theme={themeId}
        className={cn('prose-ghost h-full overflow-y-auto shadow-sm')}
      >
        {content.trim() ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents as never}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <p className="text-zinc-400 italic">Nothing to preview yet — start typing on the left.</p>
        )}
      </article>
    );
  },
);

/**
 * Custom renderers for a few elements. We use className-only (no inline
 * styles) so all theming flows through CSS custom properties.
 *
 * Most elements are styled purely by the CSS rules in `index.css` —
 * we only need overrides for things like `a` (border-bottom treatment)
 * and `input[type=checkbox]` (visually align with the rest).
 */
const markdownComponents: Record<string, React.FC<ComponentProps<'a'>>> = {
  a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
};
