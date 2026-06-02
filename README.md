# Ghost Editor

A clean, static, **browser-only** Markdown editor with AI-powered structure formatting. No accounts. No cloud. No telemetry. No backend.

> **The promise:** the AI adds structure (headings, lists, bold, dividers). It never changes, summarizes, translates, or omits a single word of your writing.

**🟢 Live demo:** https://10579516-ship-it.github.io/

## Features

- **Split-pane editor** — raw Markdown on the left, live preview on the right.
- **15 built-in themes** — Notion Classic, Tokyo Night, Dracula, Nord Frost, Rose Pine, Monochrome, and more. Switch instantly.
- **Local typographer** — deterministic regex pipeline. Recognizes Chinese chapter / ordinal markers, section numbers, bullet styles, and "prefix: content" patterns. Free, offline, instant, idempotent.
- **AI typographer** — send the document to any OpenAI-compatible endpoint (OpenAI, DeepSeek, Moonshot, OpenRouter, Ollama, LM Studio). Your key, your model, your cost.
- **Word (.docx) import** — `mammoth` + `turndown`. No server needed.
- **Export** — copy as Markdown, copy as HTML (rich clipboard), export preview as PNG.
- **Auto-save** — content is persisted to `localStorage` 500ms after your last keystroke.
- **Mobile-friendly** — under 768px the split pane becomes a tab toggle.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run build      # production build → dist/
npm run preview    # serve dist/ on http://localhost:4173
```

## Using the AI typographer

1. Click the ⚙️ **gear icon** in the toolbar → **AI settings…**
2. Fill in:
   - **API Key** — your provider's secret key. Stripped of accidental quotes / `Bearer ` prefix automatically.
   - **Endpoint** — base URL, e.g. `https://api.openai.com/v1`. Don't include `/chat/completions`; it gets appended.
   - **Model** — e.g. `gpt-4o-mini`, `deepseek-chat`, `moonshot-v1-8k`.
3. Save. Your config is stored in `localStorage` only — no server.
4. Compose your document and click ✨ in the toolbar (or **Settings → AI settings** then close the modal and click ✨).

### CORS caveat

Ghost Editor calls the provider **directly from the browser**. Most providers allow this; some don't. If you get a "Network or CORS error":

- ✅ Works out of the box: **OpenAI**, **DeepSeek**, **Moonshot**, **OpenRouter**.
- ✅ Works with config: **Ollama** (set `OLLAMA_ORIGINS=*` before starting) and **LM Studio** (enable CORS in server settings).
- ❌ Blocked by default: most self-hosted gateways that don't allow browser origins.

There's no server-side proxy in Ghost Editor — by design.

### System prompt (the "structure, not words" rule)

```
You are an expert Markdown Typographer and layout formatter. …
1. DO NOT change, summarize, translate, rewrite, or omit any words, sentences, or phrases from the original text. Keep the exact copy 100% unchanged.
2. ACTIVELY structure the document visually by inserting appropriate Markdown formatting elements: headings (#/##/###), lists, bold, tables, blockquotes (>), dividers (---).
3. Your output must contain strictly ONLY the beautifully formatted Markdown text. Do NOT wrap the result in markdown code blocks.
```

## Local typographer rules (cheat sheet)

| Input pattern               | Output                     |
| --------------------------- | -------------------------- |
| `第一章 标题`                 | `# 标题`                    |
| `一、 标题`                   | `## 标题`                   |
| `（一） 标题`                | `## 标题`                   |
| `1. 标题`                    | `## 标题`                   |
| `1.1 标题`                   | `### 标题`                  |
| `1.1.1 标题`                | `### 标题`                  |
| `① 内容` / `- 内容` / `• 内容` | `- 内容`                   |
| `关键结论：xxx`              | `**关键结论：** xxx`        |

Already-marked lines (`#`, `>`, `-`, `1.`, ```` ``` ````) are left alone. Code fences are passed through untouched.

## Build & deploy

Static site — no build-time environment variables. Drop `dist/` on any host.

| Host               | Notes                                         |
| ------------------ | --------------------------------------------- |
| Vercel             | `vercel.json` is included. Auto-detected.     |
| Netlify            | `public/_redirects` is included.              |
| Cloudflare Pages   | Build cmd `npm run build`, output `dist`.     |
| GitHub Pages       | `base: './'` in `vite.config.ts` already set. |

## Tech stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `react-markdown` 10 + `remark-gfm` 4
- `mammoth` 1.12 + `turndown` 7.2
- `html-to-image` 1.11
- `motion` 11 (the rebranded framer-motion)
- `lucide-react` (icons)

## Privacy

- **Content** lives only in your browser's `localStorage`.
- **API key** lives only in your browser's `localStorage`.
- **The AI request** is sent directly from your browser to the provider you chose. Ghost Editor does not see it.
- There is no analytics, no telemetry, no remote config.

To wipe everything: DevTools → Application → Local Storage → delete all `ghost-editor:*` keys.

## License

MIT. See [LICENSE](./LICENSE).
