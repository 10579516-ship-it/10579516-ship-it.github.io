import { useState, type ReactNode } from 'react';
import { Edit3, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

/**
 * Responsive split-pane:
 *   - md+ (≥768px): CSS Grid with two equal columns (50/50), guaranteed by
 *     `grid-cols-2`. Each cell fills the grid row's height; long content
 *     scrolls *inside* the cell rather than extending the whole page.
 *   - below md: a tab toggle ("Edit" | "Preview") switches the pane.
 */
export function SplitLayout({ left, right }: SplitLayoutProps) {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* Mobile tab bar — hidden on md+ */}
      <div className="flex shrink-0 items-center gap-1 border-b border-[var(--paper-edge,#D9C8A8)] bg-[var(--paper,#F4ECD8)] px-3 py-1.5 md:hidden">
        <button
          type="button"
          onClick={() => setTab('edit')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            tab === 'edit'
              ? 'bg-[var(--ink,#1A1714)] text-[var(--paper,#F4ECD8)]'
              : 'text-[var(--ink-faded,#7A6E5D)] hover:bg-[var(--paper-deep,#E8D9C4)]',
          )}
        >
          <Edit3 className="h-3.5 w-3.5" />
          编辑
        </button>
        <button
          type="button"
          onClick={() => setTab('preview')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            tab === 'preview'
              ? 'bg-[var(--ink,#1A1714)] text-[var(--paper,#F4ECD8)]'
              : 'text-[var(--ink-faded,#7A6E5D)] hover:bg-[var(--paper-deep,#E8D9C4)]',
          )}
        >
          <Eye className="h-3.5 w-3.5" />
          预览
        </button>
      </div>

      {/* Mobile: stacked, single column. md+: 50/50 grid. */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-2">
        {/* Left: editor — full column. As a grid item, no `display: flex`
            here, otherwise the inner EditorPane becomes a flex item with
            `flex: 0 1 auto` and shrinks to its textarea's intrinsic width
            (~160px), leaving the rest of the 50% column empty. */}
        <div
          className={cn(
            'flex min-h-0 min-w-0 flex-col overflow-hidden border-[var(--paper-edge,#D9C8A8)] md:border-r',
            tab === 'edit' ? 'flex' : 'hidden',
            'md:flex',
          )}
        >
          {left}
        </div>
        {/* Right: preview — full column, fixed height (= grid row), and
            `overflow-y-auto` so long articles scroll *inside* this column
            instead of extending the page. PreviewPane fills 100% of this.

            The cell bg matches the article bg (--paper / --gh-bg) so the
            page reads as one continuous surface; the article's theme-
            controlled padding provides internal breathing room, so the
            cell's own padding stays minimal. */}
        <div
          className={cn(
            'min-h-0 min-w-0 h-full overflow-y-auto bg-[var(--paper,#F4ECD8)] p-0 md:p-2',
            tab === 'preview' ? 'block' : 'hidden',
            'md:block',
          )}
        >
          {right}
        </div>
      </div>
    </div>
  );
}
