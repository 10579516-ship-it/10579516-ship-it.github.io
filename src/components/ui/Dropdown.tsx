import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/utils/cn';

interface DropdownProps {
  /** Element shown in the trigger slot. Clicks on it toggle the menu. */
  trigger: ReactNode;
  /** Content of the popover. */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** Alignment of the popover relative to the trigger. Default: 'right'. */
  align?: 'left' | 'right';
  /** Pixel offset from the trigger. */
  offset?: number;
  /** Optional wrapper className for the trigger. */
  triggerClassName?: string;
  /** Optional className for the popover panel. */
  panelClassName?: string;
}

/**
 * Click-outside-aware dropdown. Renders a trigger (passed as a node so the
 * caller controls styling) and a popover panel below it.
 *
 * Closes on:
 *   - click outside
 *   - ESC
 *   - selecting an item via the `children` function form
 */
export function Dropdown({
  trigger,
  children,
  align = 'right',
  offset = 8,
  triggerClassName,
  panelClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const renderContent = typeof children === 'function' ? children(close) : children;

  return (
    <div ref={wrapperRef} className={cn('relative inline-block', triggerClassName)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center"
      >
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.1 }}
            style={{ [align]: 0, marginTop: offset }}
            className={cn(
              'absolute z-40 min-w-[180px] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl',
              panelClassName,
            )}
          >
            {renderContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
