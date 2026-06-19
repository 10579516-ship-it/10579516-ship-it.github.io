import { forwardRef, type ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils/cn';

interface PreviewPaneProps {
  content: string;
}

/**
 * The live Markdown preview.
 *
 * Theming works via the `data-theme` attribute on the React root
 * `<div>` (in App.tsx). CSS custom properties cascade down to every
 * chrome element AND the article, so switching themes paints the
 * whole page in one pass.
 *
 * The `forwardRef` exposes the article element so the parent can use
 * it as the source for PNG export (`html-to-image`).
 */
export const PreviewPane = forwardRef<HTMLElement, PreviewPaneProps>(
  function PreviewPane({ content }, ref) {
    return (
      <article
        ref={ref as React.Ref<HTMLElement>}
        className={cn('prose-ghost h-full w-full')}
      >
        {content.trim() ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents as never}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <p className="text-[var(--ink-faded,#7A6E5D)] opacity-80 italic">Nothing to preview yet — start typing on the left.</p>
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
