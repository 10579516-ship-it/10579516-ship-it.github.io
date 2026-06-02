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
import type { ThemeMeta } from '@/data/types';

interface ToolbarProps {
  theme: ThemeMeta;
  isAiLoading: boolean;
  isLocalLoading: boolean;
  onCopyMd: () => void;
  onCopyWechat: () => void;
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
  onCopyWechat,
  onExportPng,
  onAiConvert,
  onLocalFormat,
  onImportWord,
  onOpenGuide,
  onOpenThemePicker,
  rightSlot,
}: ToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 py-1.5 lg:px-4">
      {/* Left: theme indicator + guide */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onOpenThemePicker}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          title="Change theme"
        >
          <span className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-sm border border-zinc-200">
            <span
              className="block h-2.5 w-2.5 rounded-full"
              style={{ background: theme.swatch.accent }}
            />
          </span>
          <span className="hidden sm:inline">{theme.name}</span>
        </button>
        <IconButton
          icon={<BookOpen className="h-[18px] w-[18px]" />}
          tooltip="Markdown Guide"
          onClick={onOpenGuide}
        />
      </div>

      {/* Center: copy / export / format / import */}
      <div className="flex items-center gap-1">
        <IconButton
          icon={<Copy className="h-[18px] w-[18px]" />}
          tooltip="Copy as Markdown"
          onClick={onCopyMd}
        />
        <IconButton
          icon={<WechatIcon className="h-[18px] w-[18px]" />}
          tooltip="复制到微信公众号（带样式粘贴）"
          onClick={onCopyWechat}
        />
        <IconButton
          icon={<ImageIcon className="h-[18px] w-[18px]" />}
          tooltip="Export PNG"
          onClick={onExportPng}
        />
        <div className="mx-1 h-5 w-px bg-zinc-200" />
        <IconButton
          icon={<Wand2 className="h-[18px] w-[18px]" />}
          tooltip="Local typographer — free, offline"
          onClick={onLocalFormat}
          loading={isLocalLoading}
        />
        <IconButton
          icon={isAiLoading ? <Loader2 className="h-[18px] w-[18px]" /> : <Sparkles className="h-[18px] w-[18px]" />}
          label={isAiLoading ? 'Cancel' : undefined}
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
      <div className="flex items-center gap-1">{rightSlot}</div>
    </div>
  );
}

/**
 * WeChat icon — lucide-react doesn't ship a WeChat glyph, so we use a
 * small inline SVG. Two overlapping speech bubbles, green-tinted.
 */
function WechatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <circle cx="9" cy="11" r="0.5" fill="currentColor" />
      <circle cx="13" cy="11" r="0.5" fill="currentColor" />
    </svg>
  );
}
