import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Toolbar } from '@/components/Editor/Toolbar';
import { EditorPane } from '@/components/Editor/EditorPane';
import { PreviewPane } from '@/components/Editor/PreviewPane';
import { SplitLayout } from '@/components/Editor/SplitLayout';
import { MarkdownGuideDrawer } from '@/components/Editor/MarkdownGuideDrawer';
import { ApiConfigModal } from '@/components/Settings/ApiConfigModal';
import { ThemePicker } from '@/components/Settings/ThemePicker';
import { SettingsMenu } from '@/components/Settings/SettingsMenu';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';
import { useAiRequest } from '@/hooks/useAiRequest';
import {
  getContent,
  setContent as persistContent,
  getApiConfig,
  getActiveThemeId,
  setActiveThemeId as persistThemeId,
} from '@/data/storage';
import { getThemeMeta } from '@/data/themes';
import { initialContent } from '@/data/initialContent';
import { formatTextWithLocalRules } from '@/ai/localTypographer';
import { importDocx, WordImportError } from '@/ai/wordImport';
import { copyMarkdown, exportNodeAsPng } from '@/utils/export';
import {
  copyMarkdownAsPlatform,
  readThemeFromElement,
  DEFAULT_PLATFORM_THEME,
  PLATFORM_CONFIGS,
  type PlatformId,
} from '@/utils/wechatFormat';
import { cn } from '@/utils/cn';
import type { ApiConfig } from '@/data/types';

type Toast = { id: number; kind: 'success' | 'error' | 'info'; message: string };

/**
 * Top-level component. Owns:
 *   - Document content (with debounced localStorage persistence)
 *   - Active theme id (with localStorage persistence)
 *   - All modal/drawer open flags
 *   - Toast queue
 *   - The `useAiRequest` hook (which owns AI request lifecycle)
 *
 * The PreviewPane is the source of truth for theme application — the
 * `data-theme` attribute on its root `<article>` drives all theming
 * via CSS custom properties.
 */
export default function App() {
  /* ---------------- state ---------------- */
  const [content, setContent] = useState<string>(() => getContent());
  const [themeId, setThemeIdState] = useState<string>(() => getActiveThemeId());
  const [apiConfig, setApiConfigState] = useState<ApiConfig | null>(() => getApiConfig());

  const [showApiModal, setShowApiModal] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const previewRef = useRef<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const ai = useAiRequest(apiConfig);

  /* ---------------- persistence ---------------- */
  useDebouncedEffect(() => persistContent(content), [content], 500);
  useDebouncedEffect(() => persistThemeId(themeId), [themeId], 200);

  /* ---------------- toast helpers ---------------- */
  const pushToast = useCallback((kind: Toast['kind'], message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  /* ---------------- handlers ---------------- */
  const theme = useMemo(() => getThemeMeta(themeId), [themeId]);

  const handleThemeSelect = useCallback((id: string) => {
    setThemeIdState(id);
  }, []);

  const handleLocalFormat = useCallback(() => {
    if (!content.trim()) {
      pushToast('info', 'Editor is empty — nothing to format.');
      return;
    }
    setIsLocalLoading(true);
    // Defer one frame so the spinner can render — the function is sync.
    requestAnimationFrame(() => {
      try {
        const formatted = formatTextWithLocalRules(content);
        setContent(formatted);
        pushToast('success', 'Local typographer applied.');
      } catch (err) {
        pushToast('error', `Local typographer failed: ${(err as Error).message}`);
      } finally {
        setIsLocalLoading(false);
      }
    });
  }, [content, pushToast]);

  const handleAiConvert = useCallback(async () => {
    if (ai.status === 'running') {
      ai.cancel();
      return;
    }
    if (!content.trim()) {
      pushToast('info', 'Editor is empty — nothing to format.');
      return;
    }
    const result = await ai.run(content);
    if (result === null) {
      // Either error or cancelled. Error message is already on the hook.
      return;
    }
    setContent(result);
    pushToast('success', 'AI typographer applied.');
  }, [ai, content, pushToast]);

  const handleCopyMd = useCallback(async () => {
    try {
      await copyMarkdown(content);
      pushToast('success', 'Markdown copied to clipboard.');
    } catch {
      pushToast('error', 'Could not copy — clipboard permission denied?');
    }
  }, [content, pushToast]);

  const handleCopyToPlatform = useCallback(
    async (platformId: PlatformId) => {
      // Read the active theme's colors + typography tokens from the live
      // preview DOM so the pasted result matches what the user sees.
      const theme = previewRef.current
        ? readThemeFromElement(previewRef.current)
        : DEFAULT_PLATFORM_THEME;
      const platform = PLATFORM_CONFIGS[platformId];
      try {
        await copyMarkdownAsPlatform(platformId, content, theme);
        pushToast('success', `已复制到「${platform.label}」 — 粘贴到编辑器即可看到当前主题样式。`);
      } catch {
        pushToast('error', `复制到「${platform.label}」失败 — 浏览器可能拒绝了剪贴板权限。`);
      }
    },
    [content, pushToast],
  );

  const handleExportPng = useCallback(async () => {
    const node = previewRef.current;
    if (!node) {
      pushToast('error', 'Preview is not ready yet.');
      return;
    }
    try {
      await exportNodeAsPng(node);
      pushToast('success', 'PNG downloaded.');
    } catch (err) {
      pushToast('error', `PNG export failed: ${(err as Error).message}`);
    }
  }, [pushToast]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChosen = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ''; // allow re-selecting the same file
      if (!file) return;
      try {
        const md = await importDocx(file);
        setContent(md);
        pushToast('success', `Imported "${file.name}" (${md.length} chars).`);
      } catch (err) {
        const msg = err instanceof WordImportError ? err.message : (err as Error).message;
        pushToast('error', msg);
      }
    },
    [pushToast],
  );

  const handleResetContent = useCallback(() => {
    setContent(initialContent);
    persistContent(initialContent);
    pushToast('info', 'Editor reset to welcome content.');
  }, [pushToast]);

  // First-time hint to open the markdown guide — show once on mount.
  useEffect(() => {
    // No-op: the guide button is always available; we keep the storage
    // hook for future use (e.g. a "first time" tooltip).
  }, []);

  /* ---------------- render ---------------- */
  return (
    <div className="flex h-full flex-col" data-theme={themeId}>
      <Toolbar
        theme={theme}
        isAiLoading={ai.status === 'running'}
        isLocalLoading={isLocalLoading}
        onCopyMd={handleCopyMd}
        onCopyToPlatform={handleCopyToPlatform}
        onExportPng={handleExportPng}
        onAiConvert={handleAiConvert}
        onLocalFormat={handleLocalFormat}
        onImportWord={handleImportClick}
        onOpenGuide={() => setShowGuide(true)}
        onOpenThemePicker={() => setShowThemePicker(true)}
        rightSlot={
          <SettingsMenu
            onOpenSettings={() => setShowApiModal(true)}
            onOpenGuide={() => setShowGuide(true)}
            onReset={handleResetContent}
          />
        }
      />

      <div className="min-h-0 flex-1">
        <SplitLayout
          left={<EditorPane value={content} onChange={setContent} />}
          right={<PreviewPane ref={previewRef} content={content} />}
        />
      </div>

      {/* Hidden file input for Word import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileChosen}
        className="hidden"
      />

      {/* Modals & drawers */}
      <ApiConfigModal
        open={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSaved={(cfg) => {
          setApiConfigState(cfg);
          pushToast('success', 'API settings saved.');
        }}
      />
      <ThemePicker
        open={showThemePicker}
        activeId={themeId}
        onClose={() => setShowThemePicker(false)}
        onSelect={handleThemeSelect}
      />
      <MarkdownGuideDrawer
        open={showGuide}
        onClose={() => setShowGuide(false)}
      />

      {/* AI error toast — sticks around until dismissed or replaced */}
      <AnimatePresence>
        {ai.errorMessage && (
          <motion.div
            key="ai-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed left-1/2 top-16 z-50 -translate-x-1/2"
          >
            <button
              type="button"
              onClick={ai.clearError}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3.5 py-2 text-sm text-rose-900 shadow-lg ring-1 ring-rose-200 hover:bg-rose-100"
            >
              <AlertTriangle className="h-4 w-4" />
              {ai.errorMessage}
              <span className="ml-2 text-rose-500">×</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transient toasts */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className={cn(
                'pointer-events-auto inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm shadow-lg ring-1',
                t.kind === 'success' && 'bg-emerald-50 text-emerald-900 ring-emerald-200',
                t.kind === 'error' && 'bg-rose-50 text-rose-900 ring-rose-200',
                t.kind === 'info' && 'bg-[var(--paper-deep,#E8D9C4)] text-[var(--ink,#1A1714)] ring-[var(--paper-edge,#D9C8A8)]',
              )}
            >
              {t.kind === 'success' && <CheckCircle2 className="h-4 w-4" />}
              {t.kind === 'error' && <XCircle className="h-4 w-4" />}
              {t.kind === 'info' && <AlertTriangle className="h-4 w-4" />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
