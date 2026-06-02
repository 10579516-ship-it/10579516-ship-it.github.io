import { useEffect, type DependencyList, type EffectCallback } from 'react';

/**
 * Like `useEffect` but the effect runs only after `delay` ms of no
 * dependency changes. Useful for auto-save: fire on every keystroke,
 * persist only when typing pauses.
 */
export function useDebouncedEffect(
  effect: EffectCallback,
  deps: DependencyList,
  delay = 500,
): void {
  useEffect(() => {
    const handle = window.setTimeout(() => effect(), delay);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
