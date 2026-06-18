<div align="center">

# 幽 · Ghost Editor

### Markdown 进。WeChat 出。

*Markdown editor for Chinese content creators — pure-static, browser-direct, AI-typography-ready.*

---

**[🌐 Live Demo](https://10579516-ship-it.github.io/)** ·
[📖 Quick start](#quick-start) ·
[🎨 Themes](#themes) ·
[🐛 Issues](https://github.com/10579516-ship-it/10579516-ship-it.github.io/issues) ·
[⭐ Star this repo](https://github.com/10579516-ship-it/10579516-ship-it.github.io)

---

A clean, static, **browser-only** Markdown editor with AI-powered structure formatting.
No accounts. No cloud. No telemetry. No backend.

> **The promise:** the AI adds structure — headings, lists, bold, dividers.
> It never changes, summarizes, translates, or omits a single word of your writing.

</div>

---

## ❉ The seal · 印

```
┌────────────┐
│            │
│    幽      │
│            │
│    灵      │
│            │
└────────────┘
```

The vermillion seal stamp is the brand mark — a 幽靈 of your writing that
lives in the browser. It appears throughout the UI as the visual signature,
in the header, in the demo, in the theme picker, in the footer.

---

## ❉ Features

- **Split-pane editor** — raw Markdown on the left, live preview on the right.
- **20 built-in themes** — 15 classics + 5 new *breathable* themes.
- **Per-theme typography** — every theme controls line-height, letter-spacing,
  page padding, divider length, divider style, and max-width.
- **Local typographer** — deterministic regex pipeline that recognizes Chinese
  chapter markers, ordinals, bullets, and `prefix: content` patterns.
- **AI typographer** — any OpenAI-compatible endpoint. 24 provider presets
  (OpenAI, DeepSeek, Moonshot, OpenRouter, Ollama, LM Studio, …).
- **Word (.docx) import** — `mammoth` + `turndown`. No server.
- **One-click publish** — copy as Markdown, copy as HTML for WeChat, export
  preview as PNG.
- **Auto-save** — content persisted to `localStorage` 500 ms after last keystroke.

---

## ❉ Themes

### Classics · 15 built-in

| # | Theme | Background | Text | Accent | Register |
|---|-------|-----------:|------:|-------:|----------|
|  1 | Notion Classic       | `#ffffff` | `#37352f` | `#2383e2` | clean white |
|  2 | Manus Minimal        | `#fafaf7` | `#1a1a1a` | `#d97706` | warm paper, orange |
|  3 | Google Material      | `#ffffff` | `#212121` | `#1a73e8` | flat white, blue |
|  4 | Red Note (小红书)      | `#fff5f5` | `#2c2c2c` | `#ff2442` | pink, red |
|  5 | GitHub Light         | `#ffffff` | `#1f2328` | `#0969da` | GitHub classic |
|  6 | Tokyo Night          | `#1a1b26` | `#c0caf5` | `#7aa2f7` | dark, blue |
|  7 | Everforest           | `#2d353b` | `#d3c6aa` | `#a7c080` | warm dark, green |
|  8 | Nord Frost           | `#2e3440` | `#d8dee9` | `#88c0d0` | dark, frost |
|  9 | Dracula              | `#282a36` | `#f8f8f2` | `#bd93f9` | dark, purple |
| 10 | Minimal Gray         | `#fafafa` | `#171717` | `#525252` | minimal gray |
| 11 | Zhihu Blue (知乎)      | `#ffffff` | `#1a1a1a` | `#0084ff` | Zhihu classic |
| 12 | Rose Pine            | `#191724` | `#e0def4` | `#c4a7e7` | dark, lavender |
| 13 | Mint Fresh           | `#f0fdf4` | `#14532d` | `#16a34a` | light green |
| 14 | Midnight Blue        | `#0f172a` | `#e2e8f0` | `#60a5fa` | dark, blue |
| 15 | Monochrome           | `#ffffff` | `#000000` | `#000000` | pure B/W |

### Breathable · 5 new

Each controls its own line-height, letter-spacing, padding, and rule-length.
None use pure dark backgrounds — they are tuned for long-form reading.

| # | Theme | Background | Text | Accent | line-height | letter-spacing | rule-length | rule-style | max-width |
|---|-------|-----------:|------:|-------:|------------:|---------------:|------------:|-----------:|----------:|
| 16 | Tea Mist 茶雾              | `#f3ecdc` | `#3a2a1f` | `#b58070` | 1.95 | 0.03em | 50% | dashed    | 660 px |
| 17 | Rice Paper 米纸            | `#faf6ec` | `#2c2823` | `#6b5d4a` | 1.90 | 0.02em | 65% | solid     | 700 px |
| 18 | Ink Wash 水墨              | `#f4f2ee` | `#2a2826` | `#6b6b6b` | 1.85 | 0.015em | 70% | solid    | 720 px |
| 19 | Soft Plum 软梅             | `#f8efe8` | `#3d2a28` | `#8b5c5c` | 1.95 | 0.03em | 60% | double    | 680 px |
| 20 | Cinnabar Manuscript 朱砂稿纸 | `#f4ecd8` | `#1a1714` | `#c8392a` | 2.00 | 0.04em | 50% | solid 2px | 640 px |

### Typography tokens · 主题排版控制

Every theme overrides these CSS custom properties on the `[data-theme]` selector.
The `.prose-ghost` article reads them — so changing a theme instantly re-flows
your text.

| Token | Default | What it controls |
|-------|--------:|------------------|
| `--gh-line-height`      | `1.85`         | Paragraph line-height |
| `--gh-letter-spacing`   | `0.01em`       | CJK character spacing |
| `--gh-page-padding`     | `1.5rem 1.75rem` | Mobile padding (vert / horiz) |
| `--gh-page-padding-md`  | `2rem 2.5rem`  | Tablet padding |
| `--gh-page-padding-lg`  | `2.5rem 3rem`  | Desktop padding |
| `--gh-max-width`        | `720px`        | Article max width |
| `--gh-rule-length`      | `60%`          | `<hr>` width as % of container |
| `--gh-rule-style`       | `solid`        | `<hr>` style: `solid` / `dashed` / `double` / `dotted` |
| `--gh-rule-weight`      | `1px`          | `<hr>` thickness |
| `--gh-p-spacing`        | `0.9em`        | Paragraph top/bottom margin |
| `--gh-heading-spacing`  | `1.6em`        | Heading top margin |
| `--gh-radius` / `--gh-radius-lg` | `8px` / `10px` | Border radius |

> Want to add your own theme? Add a `[data-theme="your-id"]` block in
> `src/index.css` and an entry in `src/data/themes.ts`. Done.

---

## ❉ Quick start

```bash
npm install
npm run dev          # → http://localhost:5173
```

```bash
npm run build        # production build → dist/
npm run preview      # serve dist/ on http://localhost:4173
```

The repo ships as a **Vite multi-page app**:

```
index.html   →  landing page    (deployed at /)
editor.html  →  React editor    (deployed at /editor.html)
```

Both emit from `npm run build` into `dist/`. No backend, no environment variables.

---

## ❉ Using the AI typographer

1. Click the ⚙️ **gear icon** in the toolbar → **AI settings…**
2. Fill in:
   - **API Key** — your provider's secret key. Stripped of accidental quotes / `Bearer ` prefix automatically.
   - **Endpoint** — base URL, e.g. `https://api.openai.com/v1`. Don't include `/chat/completions`; it gets appended.
   - **Model** — e.g. `gpt-4o-mini`, `deepseek-chat`, `moonshot-v1-8k`.
3. Save. Your config is stored in `localStorage` only — no server.
4. Compose your document and click ✨ in the toolbar.

### CORS caveat

Ghost Editor calls the provider **directly from the browser**. Most providers allow this; some don't.

- ✅ Works out of the box: **OpenAI**, **DeepSeek**, **Moonshot**, **OpenRouter**.
- ✅ Works with config: **Ollama** (set `OLLAMA_ORIGINS=*` before starting) and **LM Studio** (enable CORS in server settings).
- ❌ Blocked by default: most self-hosted gateways that don't allow browser origins.

There's no server-side proxy in Ghost Editor — by design.

### System prompt (the "structure, not words" rule)

```
You are an expert Markdown Typographer and layout formatter. …
1. DO NOT change, summarize, translate, rewrite, or omit any words, sentences,
   or phrases from the original text. Keep the exact copy 100% unchanged.
2. ACTIVELY structure the document visually by inserting appropriate Markdown
   formatting elements: headings (#/##/###), lists, bold, tables, blockquotes (>),
   dividers (---).
3. Your output must contain strictly ONLY the beautifully formatted Markdown text.
   Do NOT wrap the result in markdown code blocks.
```

---

## ❉ Local typographer rules

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

Already-marked lines (`#`, `>`, `-`, `1.`, ```` ``` ````) are left alone.
Code fences are passed through untouched.

---

## ❉ Deploy

Static site — no build-time environment variables. Drop `dist/` on any host.

| Host               | Notes                                         |
| ------------------ | --------------------------------------------- |
| Vercel             | `vercel.json` is included. Auto-detected.     |
| Netlify            | `public/_redirects` is included.              |
| Cloudflare Pages   | Build cmd `npm run build`, output `dist`.     |
| GitHub Pages       | `base: './'` in `vite.config.ts` already set. |

---

## ❉ Tech stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `react-markdown` 10 + `remark-gfm` 4
- `mammoth` 1.12 + `turndown` 7.2
- `html-to-image` 1.11
- `motion` 11 (the rebranded framer-motion)
- `lucide-react` (icons)

---

## ❉ Privacy

- **Content** lives only in your browser's `localStorage`.
- **API key** lives only in your browser's `localStorage`.
- **The AI request** is sent directly from your browser to the provider you chose.
  Ghost Editor does not see it.
- There is no analytics, no telemetry, no remote config.

To wipe everything: DevTools → Application → Local Storage → delete all
`ghost-editor:*` keys.

---

## ❉ License

MIT. See [LICENSE](./LICENSE).