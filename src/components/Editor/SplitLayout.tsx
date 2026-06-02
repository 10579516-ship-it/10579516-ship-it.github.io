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
 *     `grid-cols-2` rather than flex-1. More robust against children that
 *     try to grow.
 *   - below md: a tab toggle ("Edit" | "Preview") switches the pane.
 */
export function SplitLayout({ left, right }: SplitLayoutProps) {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Mobile tab bar — hidden on md+ */}
      <div className="flex shrink-0 items-center gap-1 border-b border-zinc-200 bg-white px-3 py-1.5 md:hidden">
        <button
          type="button"
          onClick={() => setTab('edit')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            tab === 'edit' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100',
          )}
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => setTab('preview')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            tab === 'preview' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100',
          )}
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>
      </div>

      {/* Mobile: stacked, single column. md+: 50/50 grid. */}
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
        {/* Left: editor — full column. As a grid item, no `display: flex`
            here, otherwise the inner EditorPane becomes a flex item with
            `flex: 0 1 auto` and shrinks to its textarea's intrinsic width
            (~160px), leaving the rest of the 50% column empty. */}
        <div
          className={cn(
            'min-w-0 min-h-0 border-zinc-200 md:border-r',
            tab === 'edit' ? 'block' : 'hidden',
            'md:block',
          )}
        >
          {left}
        </div>
        {/* Right: preview — full column, gutter for the article. Same:
            not a flex container, so the inner wrapper fills 100% width. */}
        <div
          className={cn(
            'min-w-0 min-h-0 bg-zinc-100 p-2 md:p-4',
            tab === 'preview' ? 'block' : 'hidden',
            'md:block',
          )}
        >
          <div className="flex min-h-0 w-full flex-1">{right}</div>
        </div>
      </div>
    </div>
  );
}
