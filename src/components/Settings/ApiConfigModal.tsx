import { useEffect, useState } from 'react';
import { Eye, EyeOff, ExternalLink, KeyRound, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import type { ApiConfig } from '@/data/types';
import { sanitizeApiKey, sanitizeEndpoint, sanitizeModel } from '@/utils/sanitize';

interface ApiConfigModalProps {
  open: boolean;
  initial: ApiConfig | null;
  onClose: () => void;
  onSave: (cfg: ApiConfig) => void;
  onClear: () => void;
}

const MODEL_PRESETS = [
  'gpt-4o-mini',
  'gpt-4o',
  'deepseek-chat',
  'moonshot-v1-8k',
  'claude-3-5-sonnet-latest',
  'llama3.1',
];

const ENDPOINT_PRESETS = [
  'https://api.openai.com/v1',
  'https://api.deepseek.com/v1',
  'https://api.moonshot.cn/v1',
  'https://openrouter.ai/api/v1',
];

/**
 * Settings modal for the AI typographer.
 * Fields: API key (password-masked), endpoint, model. All sanitized
 * on save — both visually displayed values and the stored values
 * pass through the `sanitize*` helpers so accidental quotes / Bearer
 * prefixes get stripped.
 */
export function ApiConfigModal({ open, initial, onClose, onSave, onClear }: ApiConfigModalProps) {
  const [apiKey, setApiKey] = useState(initial?.apiKey ?? '');
  const [endpoint, setEndpoint] = useState(initial?.apiEndpoint ?? 'https://api.openai.com/v1');
  const [model, setModel] = useState(initial?.model ?? 'gpt-4o-mini');
  const [showKey, setShowKey] = useState(false);
  const [touched, setTouched] = useState(false);

  // Reset form whenever the modal opens with a different initial.
  useEffect(() => {
    if (open) {
      setApiKey(initial?.apiKey ?? '');
      setEndpoint(initial?.apiEndpoint ?? 'https://api.openai.com/v1');
      setModel(initial?.model ?? 'gpt-4o-mini');
      setShowKey(false);
      setTouched(false);
    }
  }, [open, initial]);

  const keyError =
    touched && apiKey.trim() === '' ? 'API key is required to use the AI typographer.' : null;
  const endpointError =
    touched && !/^https?:\/\//.test(endpoint.trim()) ? 'Endpoint must start with http(s)://' : null;

  const canSave = apiKey.trim() !== '' && /^https?:\/\//.test(endpoint.trim()) && model.trim() !== '';

  const handleSave = () => {
    setTouched(true);
    if (!canSave) return;
    onSave({
      apiKey: sanitizeApiKey(apiKey),
      apiEndpoint: sanitizeEndpoint(endpoint),
      model: sanitizeModel(model),
    });
    onClose();
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

        {/* API key */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-800">API Key</label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
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
            placeholder="https://api.openai.com/v1"
            list="endpoint-presets"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-zinc-900"
          />
          <datalist id="endpoint-presets">
            {ENDPOINT_PRESETS.map((e) => (
              <option key={e} value={e} />
            ))}
          </datalist>
          {endpointError && <p className="mt-1 text-xs text-rose-600">{endpointError}</p>}
          <p className="mt-1 text-xs text-zinc-500">
            OpenAI-compatible URL. The browser will POST to <code className="font-mono">{endpoint || '…'}/chat/completions</code>.
            Your provider must allow CORS.
          </p>
        </div>

        {/* Model */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-800">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-4o-mini"
            list="model-presets"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-zinc-900"
          />
          <datalist id="model-presets">
            {MODEL_PRESETS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900"
          >
            <ExternalLink className="h-3 w-3" />
            Get an OpenAI key
          </a>
          <div className="flex items-center gap-2">
            {initial && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Remove the saved API key from this browser?')) {
                    onClear();
                    setApiKey('');
                    setTouched(true);
                  }
                }}
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
