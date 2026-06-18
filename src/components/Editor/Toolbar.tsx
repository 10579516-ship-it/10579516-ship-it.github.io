import type { ReactNode } from 'react';
import {
  Copy,
  Image as ImageIcon,
  Sparkles,
  Wand2,
  BookOpen,
  FileUp,
  Loader2,
} from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { PublishMenu } from '@/components/Settings/PublishMenu';
import type { ThemeMeta } from '@/data/types';
import type { PlatformId } from '@/utils/wechatFormat';

interface ToolbarProps {
  theme: ThemeMeta;
  isAiLoading: boolean;
  isLocalLoading: boolean;
  onCopyMd: () => void;
  onCopyToPlatform: (id: PlatformId) => void;
  onExportPng: () => void;
  onAiConvert: () => void;
  onLocalFormat: () => void;
  onImportWord: () => void;
  onOpenGuide: () => void;
  onOpenThemePicker: () => void;
  /** Right-aligned slot — used for the gear menu in App.tsx. */
  rightSlot?: ReactNode;
}

/**
 * Top toolbar. All actions are pure event emitters — actual logic
 * lives in App.tsx. The right-most slot is rendered as-is so callers
 * can drop in any dropdown (e.g. SettingsMenu) without coupling.
 */
export function Toolbar({
  theme,
  isAiLoading,
  isLocalLoading,
  onCopyMd,
  onCopyToPlatform,
  onExportPng,
  onAiConvert,
  onLocalFormat,
  onImportWord,
  onOpenGuide,
  onOpenThemePicker,
  rightSlot,
}: ToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 overflow-x-auto border-b px-3 py-1.5 lg:px-4"
      style={{
        background: 'var(--paper,#F4ECD8)',
        borderColor: 'var(--paper-edge,#D9C8A8)',
        color: 'var(--ink,#1A1714)',
      }}
    >
      {/* Left: theme indicator + guide. shrink-0 so it never compresses
          when the center group is wide. */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onOpenThemePicker}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-[var(--paper-deep,#E8D9C4)]"
          style={{ color: 'var(--ink,#1A1714)' }}
          title="Change theme"
        >
          <span
            className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-sm border"
            style={{ borderColor: 'var(--paper-edge,#D9C8A8)' }}
          >
            <span
              className="block h-2.5 w-2.5 rounded-full"
              style={{ background: theme.swatch.accent }}
            />
          </span>
          <span className="hidden sm:inline" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {theme.name}
          </span>
        </button>
        <IconButton
          icon={<BookOpen className="h-[18px] w-[18px]" />}
          tooltip="Markdown 指南 / Markdown Guide"
          onClick={onOpenGuide}
        />
      </div>

      {/* Center: copy / publish / export / format / import. */}
      <div className="flex shrink-0 items-center gap-1">
        <IconButton
          icon={<Copy className="h-[18px] w-[18px]" />}
          tooltip="Copy as Markdown"
          onClick={onCopyMd}
        />
        <PublishMenu onCopyToPlatform={onCopyToPlatform} />
        <IconButton
          icon={<ImageIcon className="h-[18px] w-[18px]" />}
          tooltip="Export PNG"
          onClick={onExportPng}
        />
        <div className="mx-1 h-5 w-px" style={{ background: 'var(--paper-edge,#D9C8A8)' }} />
        <IconButton
          icon={<Wand2 className="h-[18px] w-[18px]" />}
          tooltip="Local typographer — free, offline"
          onClick={onLocalFormat}
          loading={isLocalLoading}
        />
        <IconButton
          icon={isAiLoading ? <Loader2 className="h-[18px] w-[18px]" /> : <Sparkles className="h-[18px] w-[18px]" />}
          label={isAiLoading ? '取消' : undefined}
          tooltip={isAiLoading ? 'Cancel AI typographer' : 'AI typographer (uses your API key)'}
          onClick={onAiConvert}
          loading={isAiLoading}
        />
        <IconButton
          icon={<FileUp className="h-[18px] w-[18px]" />}
          tooltip="Import .docx"
          onClick={onImportWord}
        />
      </div>

      {/* Right: caller-provided slot (gear menu) */}
      <div className="flex shrink-0 items-center gap-1">{rightSlot}</div>
    </div>
  );
}
