import { useMemo } from 'react';
import { cn } from '@/utils/cn';

interface EditorPaneProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

/**
 * Plain Markdown editor. The simplest possible rich-text surface:
 * a `<textarea>` with monospace font and a small word/char counter.
 */
export function EditorPane({ value, onChange, placeholder }: EditorPaneProps) {
  const counts = useMemo(() => {
    const trimmed = value.trim();
    // Word count: split on whitespace. For CJK text, we also count
    // every CJK character as one word (since they have no spaces).
    const wsWords = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const cjkChars = (value.match(/[一-鿿㐀-䶿]/g) ?? []).length;
    return {
      chars: value.length,
      words: Math.max(wsWords, cjkChars),
    };
  }, [value]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          'min-h-0 flex-1 resize-none p-4 font-mono text-sm leading-relaxed outline-none',
          'bg-[var(--paper,#F4ECD8)] text-[var(--ink,#1A1714)]',
          'placeholder:text-[var(--ink-faded,#7A6E5D)] placeholder:opacity-60',
          'md:p-6',
        )}
        style={{ letterSpacing: '0.01em' }}
      />
      <div
        className="flex shrink-0 items-center justify-between border-t px-4 py-1.5 text-xs md:px-6"
        style={{
          background: 'var(--paper-deep,#E8D9C4)',
          borderColor: 'var(--paper-edge,#D9C8A8)',
          color: 'var(--ink-faded,#7A6E5D)',
        }}
      >
        <span className="font-mono uppercase tracking-[0.14em]">Markdown</span>
        <span>
          {counts.chars} 字符 · {counts.words} 词
        </span>
      </div>
    </div>
  );
}
