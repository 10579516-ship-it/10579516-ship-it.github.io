import { Send } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { PLATFORM_CONFIGS, type PlatformId } from '@/utils/wechatFormat';

/* ============================================================
   Per-platform brand glyphs (small inline SVG).
   ------------------------------------------------------------
   lucide-react doesn't ship WeChat / RED / Zhihu / Toutiao icons,
   so we use small colored badges to keep the visual distinction
   readable in the toolbar.
   ============================================================ */

function PlatformGlyph({ id, className }: { id: PlatformId; className?: string }) {
  const common = 'h-3.5 w-3.5';
  switch (id) {
    case 'wechat':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? common} aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <circle cx="9" cy="11" r="0.7" fill="#fff" />
          <circle cx="13" cy="11" r="0.7" fill="#fff" />
        </svg>
      );
    case 'xiaohongshu':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className={className ?? common} aria-hidden="true">
          <text x="12" y="16" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor" stroke="none">红</text>
        </svg>
      );
    case 'zhihu':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? common} aria-hidden="true">
          <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700">知</text>
        </svg>
      );
    case 'toutiao':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? common} aria-hidden="true">
          <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="700">头</text>
        </svg>
      );
  }
}

interface PublishMenuProps {
  onCopyToPlatform: (id: PlatformId) => void;
}

/**
 * Dropdown menu for the four publishing targets. Each item copies
 * the current Markdown to the clipboard with that platform's specific
 * inline-styled HTML (different font sizes, line-heights, hr style,
 * etc — see PLATFORM_CONFIGS).
 */
export function PublishMenu({ onCopyToPlatform }: PublishMenuProps) {
  const platforms: PlatformId[] = ['wechat', 'xiaohongshu', 'zhihu', 'toutiao'];

  return (
    <Dropdown
      align="right"
      trigger={
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--ink,#1A1714)] hover:bg-[var(--paper-deep,#E8D9C4)]"
          title="一键发布 / Copy to platform"
        >
          <Send className="h-[18px] w-[18px]" />
        </span>
      }
      panelClassName="min-w-[240px]"
    >
      {(close) => (
        <div className="py-1">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--ink-faded,#7A6E5D)] opacity-80">
            一键发布 · One-click publish
          </div>
          {platforms.map((id) => {
            const p = PLATFORM_CONFIGS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  close();
                  onCopyToPlatform(id);
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[var(--ink,#1A1714)] transition-colors hover:bg-[var(--paper-deep,#E8D9C4)]"
              >
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white"
                  style={PLATFORM_TINTS[id]}
                >
                  <PlatformGlyph id={id} />
                </span>
                <span className="flex flex-col items-start">
                  <span className="text-[13px] font-medium">{p.label}</span>
                  <span className="text-[11px] text-[var(--ink-faded,#7A6E5D)] opacity-80">{p.labelEn} · {p.fontSize} · {p.lineHeight}</span>
                </span>
              </button>
            );
          })}
          <div className="border-t border-[var(--paper-edge,#D9C8A8)] px-3 py-2 text-[11px] leading-relaxed text-[var(--ink-faded,#7A6E5D)]">
            复制带主题样式的 HTML，粘贴到目标平台即可。
          </div>
        </div>
      )}
    </Dropdown>
  );
}

const PLATFORM_TINTS: Record<PlatformId, { background: string }> = {
  wechat:       { background: '#1AAD19' },
  xiaohongshu:  { background: '#FF2442' },
  zhihu:        { background: '#0084FF' },
  toutiao:      { background: '#F04142' },
};