import { useState, type ReactNode } from 'react';
import { Edit3, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

/**
 * Responsive split-pane:
 *   - md+ (≥768px): two equal-width columns side by side, each filling its column.
 *   - below md: a tab toggle ("Edit" | "Preview") switches the pane.
 *
 * Internal state — the active tab only matters on mobile.
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

      <div className="flex min-h-0 flex-1">
        {/* Left: editor — full width of its column */}
        <div
          className={cn(
            'min-w-0 min-h-0 flex-1 border-r border-zinc-200',
            tab === 'edit' ? 'flex' : 'hidden',
            'md:flex',
          )}
        >
          {left}
        </div>
        {/* Right: preview — full width of its column, small padding for the gutter */}
        <div
          className={cn(
            'min-w-0 min-h-0 flex-1 overflow-y-auto bg-zinc-100 p-2 md:p-4',
            tab === 'preview' ? 'flex' : 'hidden',
            'md:flex',
          )}
        >
          <div className="flex min-h-0 w-full flex-1">{right}</div>
        </div>
      </div>
    </div>
  );
}
