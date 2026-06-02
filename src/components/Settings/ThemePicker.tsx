import { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { themes } from '@/data/themes';
import type { ThemeMeta } from '@/data/types';
import { cn } from '@/utils/cn';

interface ThemePickerProps {
  open: boolean;
  activeId: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}

/**
 * Theme picker. Opens as a centered modal with a 3-column grid
 * of swatch cards. Each card shows the theme's three preview colors
 * (bg / fg / accent) and a check mark on the active one.
 */
export function ThemePicker({ open, activeId, onClose, onSelect }: ThemePickerProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <Modal open={open} onClose={onClose} title="Choose a theme" maxWidth="max-w-3xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {themes.map((t) => (
          <ThemeCard
            key={t.id}
            theme={t}
            isActive={t.id === activeId}
            isHover={hoverId === t.id}
            onHover={setHoverId}
            onClick={() => {
              onSelect(t.id);
              onClose();
            }}
          />
        ))}
      </div>
    </Modal>
  );
}

interface ThemeCardProps {
  theme: ThemeMeta;
  isActive: boolean;
  isHover: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

function ThemeCard({ theme, isActive, isHover, onHover, onClick }: ThemeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHover(theme.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        'group relative flex flex-col gap-2 rounded-lg border p-3 text-left transition-all',
        isActive
          ? 'border-zinc-900 ring-2 ring-zinc-900 ring-offset-1'
          : 'border-zinc-200 hover:border-zinc-400',
      )}
    >
      {/* Mini preview swatch — bg card with fg text and accent dot */}
      <div
        className="relative h-20 overflow-hidden rounded-md"
        style={{ background: theme.swatch.bg }}
      >
        <div className="flex h-full flex-col justify-center gap-1 p-3">
          <div
            className="h-2 w-3/4 rounded-sm"
            style={{ background: theme.swatch.fg, opacity: 0.9 }}
          />
          <div
            className="h-1.5 w-1/2 rounded-sm"
            style={{ background: theme.swatch.fg, opacity: 0.5 }}
          />
          <div
            className="mt-1 h-1.5 w-1/3 rounded-sm"
            style={{ background: theme.swatch.accent }}
          />
        </div>
        {/* Swatch dots */}
        <div className="absolute right-2 top-2 flex gap-1">
          <span
            className="block h-3 w-3 rounded-full border border-black/10"
            style={{ background: theme.swatch.bg }}
          />
          <span
            className="block h-3 w-3 rounded-full border border-black/10"
            style={{ background: theme.swatch.fg }}
          />
          <span
            className="block h-3 w-3 rounded-full border border-black/10"
            style={{ background: theme.swatch.accent }}
          />
        </div>
        {isActive && (
          <div className="absolute left-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white shadow">
            <Check className="h-3 w-3" />
          </div>
        )}
        {isHover && !isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-xs font-medium text-zinc-900">
            Click to apply
          </div>
        )}
      </div>
      <div>
        <div className="text-sm font-medium text-zinc-900">{theme.name}</div>
        <div className="text-xs text-zinc-500">{theme.author}</div>
      </div>
    </button>
  );
}
