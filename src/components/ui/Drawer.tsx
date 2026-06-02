import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Width class (Tailwind). Default: `w-[480px] max-w-[90vw]`. */
  width?: string;
  /** Which edge the drawer slides in from. Default: 'right'. */
  side?: 'right' | 'left';
}

/**
 * Slide-in side drawer. Used for the Markdown Guide and (optionally)
 * any future side panel. ESC + click outside both close it.
 */
export function Drawer({ open, onClose, title, children, width = 'w-[480px] max-w-[90vw]', side = 'right' }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const initialX = side === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            aria-label="Close drawer"
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'absolute top-0 h-full bg-white shadow-2xl flex flex-col',
              side === 'right' ? 'right-0' : 'left-0',
              width,
            )}
            initial={{ x: initialX }}
            animate={{ x: 0 }}
            exit={{ x: initialX }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5">
                <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
