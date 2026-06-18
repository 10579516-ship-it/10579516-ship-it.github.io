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
 * Theme picker. Opens as a centered modal with two grouped sections
 * (Classics + Breathable), each showing a 3-column grid of swatch
 * cards. Each card previews bg / fg / accent colors and marks the
 * active one with a vermillion check.
 *
 * The modal itself uses the manuscript paper aesthetic to match
 * the landing page chrome.
 */
export function ThemePicker({ open, activeId, onClose, onSelect }: ThemePickerProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Split themes into the two groups by ID prefix. New "breathable"
  // themes (added in v2) all live alongside `cinnabar-manuscript`.
  const classics = themes.filter((t) => !BREATHABLE_IDS.has(t.id));
  const breathable = themes.filter((t) => BREATHABLE_IDS.has(t.id));

  return (
    <Modal open={open} onClose={onClose} title="Choose a theme" maxWidth="max-w-4xl">
      <ThemeSection
        kicker="§ 01"
        title="Classics · 经典十五套"
        subtitle="Established palettes, all kept for backward compatibility."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {classics.map((t) => (
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
      </ThemeSection>

      <div className="my-5 h-px bg-[var(--paper-edge,#D9C8A8)]" />

      <ThemeSection
        kicker="§ 02"
        title="Breathable · 透气新五套"
        subtitle="No pure-dark backgrounds. Each sets its own line-height, letter-spacing, padding, and divider."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {breathable.map((t) => (
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
      </ThemeSection>
    </Modal>
  );
}

const BREATHABLE_IDS = new Set([
  'tea-mist',
  'rice-paper',
  'ink-wash',
  'soft-plum',
  'cinnabar-manuscript',
]);

interface ThemeSectionProps {
  kicker: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function ThemeSection({ kicker, title, subtitle, children }: ThemeSectionProps) {
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-faded,#7A6E5D)]">
          {kicker}
        </span>
        <h3 className="font-serif text-[15px] font-semibold tracking-tight" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {title}
        </h3>
      </div>
      {subtitle && (
        <p className="mb-3 text-[12px] leading-relaxed text-[var(--ink-faded,#7A6E5D)]">
          {subtitle}
        </p>
      )}
      {children}
    </div>
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
          ? 'border-[var(--cinnabar,#C8392A)] ring-2 ring-[var(--cinnabar,#C8392A)] ring-offset-1 ring-offset-[var(--paper,#F4ECD8)]'
          : 'border-[var(--paper-edge,#D9C8A8)] hover:border-[var(--ink-faded,#7A6E5D)]',
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
          <div
            className="absolute left-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-white shadow"
            style={{ background: 'var(--cinnabar,#C8392A)' }}
          >
            <Check className="h-3 w-3" />
          </div>
        )}
        {isHover && !isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-xs font-medium text-[var(--ink,#1A1714)]">
            Click to apply
          </div>
        )}
      </div>
      <div>
        <div className="text-[13px] font-medium leading-tight text-[var(--ink,#1A1714)]">
          {theme.name}
        </div>
        <div className="mt-0.5 text-[11px] text-[var(--ink-faded,#7A6E5D)]">{theme.author}</div>
      </div>
    </button>
  );
}
