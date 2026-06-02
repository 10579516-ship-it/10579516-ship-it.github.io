/**
 * Defensive input sanitization for user-pasted API config.
 *
 * Users often copy-paste API keys from notes / docs and accidentally
 * include surrounding quotes, a "Bearer " prefix, or trailing slashes.
 * These helpers strip those out so the actual API call sees clean input.
 *
 * The same helpers run:
 *   1. When saving the config (in the settings modal)
 *   2. Right before each request (defense in depth)
 */

/** Strip surrounding single or double quotes and whitespace. */
function stripQuotes(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.substring(1, t.length - 1).trim();
  }
  return t;
}

/** Strip a leading "Bearer " (case-insensitive). */
function stripBearer(s: string): string {
  const t = s.trim();
  if (/^Bearer\s+/i.test(t)) {
    return t.replace(/^Bearer\s+/i, '').trim();
  }
  return t;
}

/** Strip a trailing "/chat/completions" segment (case-insensitive). */
function stripChatCompletions(s: string): string {
  return s.replace(/\/chat\/completions\/?$/i, '');
}

/** Strip a trailing slash. */
function stripTrailingSlash(s: string): string {
  return s.replace(/\/+$/, '');
}

export function sanitizeApiKey(raw: string): string {
  let s = raw.trim();
  s = stripQuotes(s);
  s = stripBearer(s);
  return s.trim();
}

export function sanitizeEndpoint(raw: string): string {
  let s = raw.trim();
  s = stripQuotes(s);
  s = stripChatCompletions(s);
  s = stripTrailingSlash(s);
  return s;
}

export function sanitizeModel(raw: string): string {
  return raw.trim();
}
