/**
 * LLM typographer — calls any OpenAI-compatible chat completions endpoint
 * with a "structure-only" system prompt. The model is told to never
 * change, summarize, translate, or omit a single word of the input —
 * only add Markdown structure (headings, lists, bold, tables, dividers).
 */

import { sanitizeApiKey, sanitizeEndpoint, sanitizeModel } from '@/utils/sanitize';
import type { ApiConfig } from '@/data/types';

const SYSTEM_PROMPT = `You are an expert Markdown Typographer and layout formatter. Your goal is to transform plain, unformatted, or poorly formatted text into a beautifully structured, highly readable document using clean Markdown layout elements, WHILE strictly preserving every single word of the original text.

Rules:
1. DO NOT change, summarize, translate, rewrite, or omit any words, sentences, or phrases from the original text. Keep the exact copy 100% unchanged.
2. ACTIVELY structure the document visually by inserting appropriate Markdown formatting elements: headings (#, ##, ###), lists (- or 1.), bold, italics, tables, blockquotes (>), and dividers (---).
3. Output must be ONLY the formatted Markdown text — do NOT wrap the result in markdown code blocks, do NOT add commentary or explanation.`;

export type LlmErrorKind =
  | 'network'
  | 'unauthorized'
  | 'rateLimit'
  | 'server'
  | 'parse'
  | 'cors'
  | 'aborted';

export class LlmError extends Error {
  readonly kind: LlmErrorKind;
  readonly status?: number;
  readonly providerMessage?: string;
  constructor(kind: LlmErrorKind, message: string, status?: number, providerMessage?: string) {
    super(message);
    this.name = 'LlmError';
    this.kind = kind;
    this.status = status;
    this.providerMessage = providerMessage;
  }
}

interface FormatOptions {
  signal?: AbortSignal;
}

/**
 * Send the document to the LLM and return the formatted Markdown.
 * Throws an `LlmError` on any failure — caller maps to a user-friendly toast.
 *
 * Sanitization is applied to apiKey / endpoint / model at request time
 * (in addition to the save-time sanitization in the settings modal)
 * to defend against localStorage hand-edits.
 */
export async function formatTextWithLlm(
  input: string,
  cfg: ApiConfig,
  opts: FormatOptions = {},
): Promise<string> {
  if (opts.signal?.aborted) {
    throw new LlmError('aborted', 'Request was cancelled');
  }

  const apiKey = sanitizeApiKey(cfg.apiKey);
  const baseUrl = sanitizeEndpoint(cfg.apiEndpoint);
  const model = sanitizeModel(cfg.model);

  if (!apiKey) throw new LlmError('unauthorized', 'API key is empty');
  if (!/^https?:\/\//.test(baseUrl)) {
    throw new LlmError('network', 'Endpoint must start with http(s)://');
  }
  if (!model) throw new LlmError('parse', 'Model name is empty');

  const targetUrl = `${baseUrl}/chat/completions`;

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      signal: opts.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        stream: false,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Format the following document while preserving every word of the original text:\n\n${input}` },
        ],
      }),
    });
  } catch (err) {
    if ((err as { name?: string }).name === 'AbortError') {
      throw new LlmError('aborted', 'Request was cancelled');
    }
    // fetch's TypeError on network failure / CORS is indistinguishable here.
    // Heuristic: if the user is hitting an https endpoint with a Bearer header,
    // a TypeError almost always means either offline or blocked-by-CORS.
    throw new LlmError(
      'cors',
      'Network or CORS error — check that your endpoint allows browser requests.',
    );
  }

  const text = await response.text();
  if (!response.ok) {
    let providerMessage: string | undefined;
    try {
      const parsed = JSON.parse(text) as { error?: { message?: string }; message?: string };
      providerMessage = parsed.error?.message ?? parsed.message;
    } catch {
      // Non-JSON error body — use raw text excerpt.
      providerMessage = text.slice(0, 300);
    }
    const kind =
      response.status === 401 || response.status === 403
        ? 'unauthorized'
        : response.status === 429
        ? 'rateLimit'
        : response.status >= 500
        ? 'server'
        : 'parse';
    throw new LlmError(
      kind,
      providerMessage ?? `Provider responded with status ${response.status}`,
      response.status,
      providerMessage,
    );
  }

  let data: { choices?: { message?: { content?: string } }[] };
  try {
    data = JSON.parse(text);
  } catch {
    throw new LlmError('parse', 'Provider returned non-JSON response');
  }

  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || content.length === 0) {
    throw new LlmError('parse', 'Provider response had no message content');
  }

  return stripCodeFences(content.trim());
}

/** Strip a single pair of outer markdown code fences if present. */
function stripCodeFences(s: string): string {
  const m = /^```(?:[a-zA-Z0-9_-]*)?\s*\n([\s\S]*?)\n```\s*$/.exec(s);
  return m ? m[1]!.trimEnd() : s;
}

/** Map an LlmError to a human-friendly message. */
export function llmErrorMessage(err: unknown): string {
  if (err instanceof LlmError) {
    switch (err.kind) {
      case 'aborted':
        return ''; // silent
      case 'unauthorized':
        return 'Invalid API key or insufficient permissions.';
      case 'rateLimit':
        return 'Rate limited — try again in a moment.';
      case 'server':
        return `Provider error${err.status ? ` (${err.status})` : ''}. Try again.`;
      case 'cors':
        return 'Network or CORS error — the provider must allow browser-origin requests.';
      case 'parse':
        return err.message || 'Unexpected response from the provider.';
      case 'network':
        return err.message || 'Network error.';
    }
  }
  return (err as Error)?.message ?? 'Unknown error';
}
