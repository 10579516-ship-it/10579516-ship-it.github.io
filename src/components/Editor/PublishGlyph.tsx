import type { PlatformId } from '@/utils/wechatFormat';

/* ============================================================
   Per-platform brand glyphs (small inline SVG).
   ------------------------------------------------------------
   lucide-react doesn't ship WeChat / RED / Zhihu / Toutiao icons,
   so we use custom SVG glyphs. These render with currentColor so
   they pick up the surrounding text colour (and the brand tint on
   hover via group-hover).
   ============================================================ */

export function PublishGlyph({ id, className }: { id: PlatformId; className?: string }) {
  const common = 'h-[18px] w-[18px]';
  switch (id) {
    case 'wechat':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? common} aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <circle cx="9" cy="11" r="0.7" fill="var(--paper,#F4ECD8)" />
          <circle cx="13" cy="11" r="0.7" fill="var(--paper,#F4ECD8)" />
        </svg>
      );
    case 'xiaohongshu':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? common} aria-hidden="true">
          <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700">红</text>
        </svg>
      );
    case 'zhihu':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? common} aria-hidden="true">
          <text x="12" y="17" textAnchor="middle" fontSize="17" fontWeight="700">知</text>
        </svg>
      );
    case 'toutiao':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? common} aria-hidden="true">
          <text x="12" y="17" textAnchor="middle" fontSize="16" fontWeight="700">头</text>
        </svg>
      );
  }
}

export const PLATFORM_TINTS: Record<PlatformId, { background: string }> = {
  wechat:       { background: '#1AAD19' },
  xiaohongshu:  { background: '#FF2442' },
  zhihu:        { background: '#0084FF' },
  toutiao:      { background: '#F04142' },
};