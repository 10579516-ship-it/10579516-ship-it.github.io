/**
 * Welcome document shown on first visit.
 * Demonstrates headings, lists, blockquote, table, code block, and a tip
 * about the two typographer features.
 */
export const initialContent = `# Welcome to Ghost Editor

A clean, **static** Markdown editor that runs entirely in your browser. No accounts, no cloud, no telemetry.

## Why this exists

Most AI editors do too much — they want to *rewrite* your writing. Ghost Editor is built around a different promise:

> **Structure, not words.** The AI adds headings, lists, and emphasis. It never changes, summarizes, translates, or omits a single word of your original text.

## Two ways to format

### 1. Local typographer (free, offline)

Regex-based. Instant. Catches the common Chinese / English structural patterns:

- \`一、\` / \`（一）\` / \`第X章\` → headings
- \`1.1\` / \`1.1.1\` → sub-headings
- \`①\` / \`a.\` / \`i.\` → bullet lists
- \`结论：xxx\` → **结论：** xxx

### 2. AI typographer (your own key)

OpenAI-compatible endpoint, structure-only transformation, full control over cost. Configure it once in the settings (gear icon) and reuse across sessions — your key lives in this browser's localStorage.

## Markdown quick reference

| Element   | Syntax                       |
| --------- | ---------------------------- |
| Heading   | \`# H1\` \`## H2\` \`### H3\`   |
| Bold      | \`**bold**\`                 |
| Italic    | \`*italic*\`                 |
| List      | \`- item\` or \`1. item\`     |
| Quote     | \`> quoted text\`            |
| Code      | \`inline\` or \`\`\`block\`\`\` |
| Divider   | \`---\`                      |
| Link      | \`[text](url)\`              |

\`\`\`ts
function hello(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> Tip: the **Markdown Guide** button in the toolbar opens a full cheatsheet.

---

Made for writers who care about words. 🖋
`;
