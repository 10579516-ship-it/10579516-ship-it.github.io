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
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100"
          title="Settings menu"
        >
          <SettingsIcon className="h-[18px] w-[18px]" />
        </span>
      }
      panelClassName="min-w-[220px]"
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
            label="Markdown guide"
            onClick={() => {
              close();
              onOpenGuide();
            }}
          />
          <div className="my-1 h-px bg-zinc-100" />
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
          <div className="px-3 py-2 text-[10px] leading-relaxed text-zinc-400">
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
      className={
        'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-zinc-50 ' +
        (danger ? 'text-rose-600 hover:bg-rose-50' : 'text-zinc-700')
      }
    >
      <span className="text-zinc-400">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
