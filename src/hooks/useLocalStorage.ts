import { useCallback, useState } from 'react';

/**
 * State that mirrors a JSON-encoded value in localStorage.
 * - Lazy-initializes by calling the `initial()` factory on first render.
 * - On `setValue`, writes both to state and to localStorage.
 * - Returns a stable setter (memoized).
 *
 * If the stored value is corrupted, the initial factory's result is used
 * and the bad value is overwritten on the next set.
 */
export function useLocalStorage<T>(
  key: string,
  initial: () => T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValueInternal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initial();
      return JSON.parse(raw) as T;
    } catch {
      return initial();
    }
  });

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValueInternal((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Quota / disabled — drop silently.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setValue];
}
