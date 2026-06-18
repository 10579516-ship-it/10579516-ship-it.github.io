import { Settings as SettingsIcon, RotateCcw, BookOpen } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { initialContent } from '@/data/initialContent';

interface SettingsMenuProps {
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  onReset: () => void;
}

/**
 * The gear-icon menu in the toolbar. Three actions:
 *   1. AI settings (the main use)
 *   2. Markdown guide
 *   3. Reset to welcome content (with confirm)
 */
export function SettingsMenu({ onOpenSettings, onOpenGuide, onReset }: SettingsMenuProps) {
  return (
    <Dropdown
      align="right"
      trigger={
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[var(--paper-deep,#E8D9C4)]"
          style={{ color: 'var(--ink,#1A1714)' }}
          title="Settings menu"
        >
          <SettingsIcon className="h-[18px] w-[18px]" />
        </span>
      }
      panelClassName="min-w-[240px]"
    >
      {(close) => (
        <div className="py-1">
          <MenuItem
            icon={<SettingsIcon className="h-4 w-4" />}
            label="AI settings…"
            onClick={() => {
              close();
              onOpenSettings();
            }}
          />
          <MenuItem
            icon={<BookOpen className="h-4 w-4" />}
            label="Markdown 指南 / Guide"
            onClick={() => {
              close();
              onOpenGuide();
            }}
          />
          <div className="my-1 h-px" style={{ background: 'var(--paper-edge,#D9C8A8)' }} />
          <MenuItem
            icon={<RotateCcw className="h-4 w-4" />}
            label="Reset to welcome content"
            danger
            onClick={() => {
              if (
                confirm(
                  'Reset the editor to the welcome content?\n\nThis will replace your current document. The current content is auto-saved in localStorage — you can copy it before resetting if you want to keep it.',
                )
              ) {
                onReset();
                close();
              }
            }}
          />
          <div
            className="px-3 py-2 text-[10px] leading-relaxed"
            style={{ color: 'var(--ink-faded,#7A6E5D)' }}
          >
            {initialContent.length} chars in welcome doc
          </div>
        </div>
      )}
    </Dropdown>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors"
      style={{
        color: danger ? 'var(--cinnabar-deep,#8B1A1A)' : 'var(--ink,#1A1714)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = danger
          ? 'rgba(200,57,42,0.08)'
          : 'var(--paper-deep,#E8D9C4)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
    >
      <span style={{ color: 'var(--ink-faded,#7A6E5D)' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
