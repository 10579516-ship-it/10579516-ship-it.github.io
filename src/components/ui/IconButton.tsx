import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon element. */
  icon: ReactNode;
  /** Optional visible label — shown next to the icon. */
  label?: string;
  /** Tooltip on hover (title attribute). */
  tooltip?: string;
  /** Active/pressed state — primary fill. */
  active?: boolean;
  /** Loading state — disables and shows a spinner over the icon. */
  loading?: boolean;
  /** Visual size variant. */
  size?: 'sm' | 'md';
}

/**
 * Small icon button used in the toolbar.
 * Wraps a Lucide icon in a square button with a hover state and tooltip.
 *
 * When `loading` is true, the icon is replaced by a centered spinner.
 * If `label` is also set, the label still shows (e.g. "Cancel" while in flight).
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { icon, label, tooltip, active = false, loading = false, size = 'md', className, disabled, ...rest },
    ref,
  ) {
    const dim = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
    const iconDim = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]';

    return (
      <button
        ref={ref}
        type="button"
        title={tooltip}
        aria-label={tooltip ?? label}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-1.5 rounded-md transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          active
            ? 'bg-zinc-900 text-white hover:bg-zinc-800'
            : 'text-zinc-700 hover:bg-zinc-100',
          label ? 'px-2.5' : dim,
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span
            className={cn(
              'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
              iconDim,
            )}
          />
        ) : (
          <span className={cn('inline-flex shrink-0 items-center justify-center', iconDim)}>{icon}</span>
        )}
        {label && <span className="text-sm font-medium">{label}</span>}
      </button>
    );
  },
);
