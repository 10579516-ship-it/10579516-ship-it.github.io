/**
 * Typed localStorage helpers. All keys are namespaced under `ghost-editor:`.
 * Every read is wrapped in try/catch and returns a safe default on:
 *   - disabled localStorage (private mode, sandbox restrictions)
 *   - quota errors
 *   - JSON parse errors
 *   - missing keys
 */

import { initialContent } from './initialContent';
import { defaultThemeId, themes } from './themes';
import type { ApiConfig } from './types';

const NS = 'ghost-editor:';

const KEYS = {
  content: `${NS}content`,
  apiConfig: `${NS}api-config`,
  themeId: `${NS}theme-id`,
  showGuideTutorial: `${NS}show-guide-tutorial`,
} as const;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota / disabled — silently drop.
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/* ---------------- Content ---------------- */

export function getContent(): string {
  const v = safeGet(KEYS.content);
  if (v === null || v === '') return initialContent;
  return v;
}

export function setContent(s: string): void {
  safeSet(KEYS.content, s);
}

/* ---------------- API config ---------------- */

export function getApiConfig(): ApiConfig | null {
  const raw = safeGet(KEYS.apiConfig);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ApiConfig;
    if (
      typeof parsed.apiKey === 'string' &&
      typeof parsed.apiEndpoint === 'string' &&
      typeof parsed.model === 'string'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setApiConfig(cfg: ApiConfig): void {
  safeSet(KEYS.apiConfig, JSON.stringify(cfg));
}

export function clearApiConfig(): void {
  safeRemove(KEYS.apiConfig);
}

/* ---------------- Theme ---------------- */

export function getActiveThemeId(): string {
  const v = safeGet(KEYS.themeId);
  if (v && themes.some((t) => t.id === v)) return v;
  return defaultThemeId;
}

export function setActiveThemeId(id: string): void {
  if (!themes.some((t) => t.id === id)) return;
  safeSet(KEYS.themeId, id);
}

/* ---------------- First-time guide hint ---------------- */

export function getShowGuideTutorial(): boolean {
  const v = safeGet(KEYS.showGuideTutorial);
  // Default: show on first visit (no key set).
  return v === null ? true : v === 'true';
}

export function setShowGuideTutorial(v: boolean): void {
  safeSet(KEYS.showGuideTutorial, String(v));
}

/* ---------------- Reset ---------------- */

export function resetAll(): void {
  safeRemove(KEYS.content);
  safeRemove(KEYS.apiConfig);
  safeRemove(KEYS.themeId);
  safeRemove(KEYS.showGuideTutorial);
}
