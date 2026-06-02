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
          'min-h-0 flex-1 resize-none bg-white p-6 font-mono text-sm leading-relaxed text-zinc-800 outline-none',
          'placeholder:text-zinc-400',
          'lg:p-10',
        )}
      />
      <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-6 py-2 text-xs text-zinc-500 lg:px-10">
        <span>Markdown</span>
        <span>
          {counts.chars} 字符 · {counts.words} 词
        </span>
      </div>
    </div>
  );
}
