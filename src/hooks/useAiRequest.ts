import { useCallback, useEffect, useRef, useState } from 'react';
import { formatTextWithLlm, llmErrorMessage, LlmError } from '@/ai/llmFormat';
import type { ApiConfig } from '@/data/types';

export type AiStatus = 'idle' | 'running' | 'error';

interface UseAiRequestResult {
  status: AiStatus;
  errorMessage: string | null;
  /** Start a formatting run. Returns the result, or null on error/cancel. */
  run: (content: string) => Promise<string | null>;
  /** Cancel any in-flight run. Safe to call when idle. */
  cancel: () => void;
  clearError: () => void;
}

/**
 * Wraps `formatTextWithLlm` with:
 *   - AbortController lifecycle (one per run, cancelled on unmount)
 *   - Status state machine for the UI
 *   - Friendly error message extraction
 *
 * The hook does NOT own the input content — the caller passes it on
 * each `run()`. This keeps the hook composable and avoids stale closures.
 */
export function useAiRequest(cfg: ApiConfig | null): UseAiRequestResult {
  const [status, setStatus] = useState<AiStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus('idle');
  }, []);

  // Cancel any in-flight request on unmount.
  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const run = useCallback(
    async (content: string): Promise<string | null> => {
      if (!cfg) {
        setErrorMessage('Configure your API key in Settings first.');
        setStatus('error');
        return null;
      }
      // Cancel any prior run before starting a new one.
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setStatus('running');
      setErrorMessage(null);
      try {
        const result = await formatTextWithLlm(content, cfg, { signal: controller.signal });
        if (controller.signal.aborted) return null;
        setStatus('idle');
        return result;
      } catch (err) {
        if (err instanceof LlmError && err.kind === 'aborted') {
          setStatus('idle');
          return null;
        }
        setErrorMessage(llmErrorMessage(err));
        setStatus('error');
        return null;
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [cfg],
  );

  const clearError = useCallback(() => setErrorMessage(null), []);

  return { status, errorMessage, run, cancel, clearError };
}
