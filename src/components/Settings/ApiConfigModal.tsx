import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, ExternalLink, KeyRound, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { providers, customProvider, findProvider, REGION_LABELS, type ProviderRegion, type ProviderPreset } from '@/data/providers';
import { sanitizeApiKey, sanitizeEndpoint, sanitizeModel } from '@/utils/sanitize';
import { getApiConfig, setApiConfig as persistApiConfig, clearApiConfig } from '@/data/storage';
import type { ApiConfig } from '@/data/types';
import { cn } from '@/utils/cn';

interface ApiConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (cfg: ApiConfig, providerId: string | null) => void;
}

const PROVIDER_STORAGE_KEY = 'ghost-editor:api-provider';

function loadProviderId(): string {
  try {
    return localStorage.getItem(PROVIDER_STORAGE_KEY) ?? customProvider.id;
  } catch {
    return customProvider.id;
  }
}

function saveProviderId(id: string) {
  try {
    localStorage.setItem(PROVIDER_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

/**
 * Settings modal for the AI typographer.
 *
 * UX:
 *   1. Pick a provider (grouped by region) — endpoint + default model
 *      auto-fill. Both stay editable.
 *   2. Paste your API key (sanitized on save: strips quotes + "Bearer ").
 *   3. Save → stored in localStorage. Ghost Editor never sees the key
 *      after the browser-level clipboard write to your chosen provider.
 */
export function ApiConfigModal({ open, onClose, onSaved }: ApiConfigModalProps) {
  const initial = open ? getApiConfig() : null;
  const [providerId, setProviderId] = useState<string>(() => loadProviderId());
  const [apiKey, setApiKey] = useState(initial?.apiKey ?? '');
  const [endpoint, setEndpoint] = useState(initial?.apiEndpoint ?? 'https://api.openai.com/v1');
  const [model, setModel] = useState(initial?.model ?? 'gpt-4o-mini');
  const [showKey, setShowKey] = useState(false);
  const [touched, setTouched] = useState(false);

  // Reset on open.
  useEffect(() => {
    if (open) {
      const cfg = getApiConfig();
      const pid = loadProviderId();
      setProviderId(pid);
      setApiKey(cfg?.apiKey ?? '');
      setEndpoint(cfg?.apiEndpoint ?? (findProvider(pid)?.endpoint ?? 'https://api.openai.com/v1'));
      setModel(cfg?.model ?? (findProvider(pid)?.defaultModel ?? 'gpt-4o-mini'));
      setShowKey(false);
      setTouched(false);
    }
  }, [open]);

  const provider = useMemo(() => findProvider(providerId) ?? customProvider, [providerId]);

  // Group providers by region for the <select>.
  const grouped = useMemo(() => {
    const out: Record<ProviderRegion, ProviderPreset[]> = { global: [], cn: [], local: [] };
    for (const p of providers) out[p.region].push(p);
    return out;
  }, []);

  // Datalist options: current provider's models + anything the user typed.
  const modelDatalistId = `model-options-${providerId}`;
  const endpointDatalistId = `endpoint-options-${providerId}`;

  const keyError =
    touched && apiKey.trim() === '' ? 'API key is required to use the AI typographer.' : null;
  const endpointError =
    touched && endpoint.trim() !== '' && !/^https?:\/\//.test(endpoint.trim())
      ? 'Endpoint must start with http(s)://'
      : null;

  const canSave =
    apiKey.trim() !== '' &&
    (endpoint.trim() === '' || /^https?:\/\//.test(endpoint.trim())) &&
    model.trim() !== '';

  const handleProviderChange = (newId: string) => {
    setProviderId(newId);
    saveProviderId(newId);
    if (newId === customProvider.id) return; // don't overwrite user's manual fields
    const p = findProvider(newId);
    if (p) {
      setEndpoint(p.endpoint);
      setModel(p.defaultModel);
    }
  };

  const handleSave = () => {
    setTouched(true);
    if (!canSave) return;
    const cfg: ApiConfig = {
      apiKey: sanitizeApiKey(apiKey),
      apiEndpoint: sanitizeEndpoint(endpoint),
      model: sanitizeModel(model),
    };
    persistApiConfig(cfg);
    onSaved?.(cfg, providerId);
    onClose();
  };

  const handleClear = () => {
    if (!confirm('Remove the saved API key from this browser?')) return;
    clearApiConfig();
    setApiKey('');
    setTouched(true);
  };

  return (
    <Modal open={open} onClose={onClose} title="AI Typographer — API settings" maxWidth="max-w-lg">
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div>
            Your API key is stored only in this browser's <code className="font-mono">localStorage</code> and
            sent as a <code className="font-mono">Bearer</code> header directly to your chosen provider.
            Ghost Editor never proxies the request.
          </div>
        </div>

        {/* Provider */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-800">Provider</label>
          <select
            value={providerId}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
          >
            {(Object.keys(grouped) as ProviderRegion[]).flatMap((region) => {
              const items = grouped[region];
              if (items.length === 0) return [];
              return [
                <optgroup key={region} label={REGION_LABELS[region]}>
                  {items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>,
              ];
            })}
            <option value={customProvider.id}>自定义 / Custom</option>
          </select>
          {provider.note && (
            <p className="mt-1 text-xs text-zinc-500">{provider.note}</p>
          )}
        </div>

        {/* API key */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-800">API Key</label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider.keyUrl ? 'sk-...' : 'API key'}
              autoComplete="off"
              className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-10 font-mono text-sm outline-none focus:border-zinc-900"
            />
            <button
              type="button"
              onClick={() => setShowKey((s) => !s)}
              aria-label={showKey ? 'Hide key' : 'Show key'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 hover:bg-zinc-100"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {keyError && <p className="mt-1 text-xs text-rose-600">{keyError}</p>}
        </div>

        {/* Endpoint */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-800">Endpoint</label>
          <input
            type="url"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder={provider.endpoint}
            list={endpointDatalistId}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-zinc-900"
          />
          <datalist id={endpointDatalistId}>
            {providers.map((p) => (
              <option key={p.id} value={p.endpoint} />
            ))}
          </datalist>
          {endpointError && <p className="mt-1 text-xs text-rose-600">{endpointError}</p>}
          <p className="mt-1 text-xs text-zinc-500">
            The browser POSTs to <code className="font-mono">{endpoint || '…'}/chat/completions</code>.
            Your provider must allow CORS for browser-origin requests.
          </p>
        </div>

        {/* Model */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-800">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={provider.defaultModel || 'model-name'}
            list={modelDatalistId}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-zinc-900"
          />
          <datalist id={modelDatalistId}>
            {provider.models.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          {provider.models.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {provider.models.slice(0, 6).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[11px] transition-colors',
                    model === m
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {provider.keyUrl ? (
            <a
              href={provider.keyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900"
            >
              <ExternalLink className="h-3 w-3" />
              获取 {provider.name} 的 Key
            </a>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {initial && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:text-rose-600"
              >
                Forget key
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
