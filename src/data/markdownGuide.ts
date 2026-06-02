/**
 * Markdown cheatsheet shown in the right-side drawer.
 * Plain Markdown string — rendered with the same ReactMarkdown config as the preview.
 */
export const markdownGuide = `# Markdown Quick Reference

A concise reference for the syntax Ghost Editor understands. GFM (GitHub Flavored Markdown) is enabled, so tables, task lists, strikethrough, and autolinks all work.

## Headings

\`\`\`
# H1
## H2
### H3
\`\`\`

## Emphasis

- \`**bold**\` → **bold**
- \`*italic*\` → *italic*
- \`~~strike~~\` → ~~strike~~

## Lists

Unordered:
\`\`\`
- item one
- item two
  - nested
\`\`\`

Ordered:
\`\`\`
1. first
2. second
\`\`\`

Task list:
\`\`\`
- [x] done
- [ ] todo
\`\`\`

## Links & images

\`\`\`
[Ghost Editor](https://github.com)
![alt text](https://...)
\`\`\`

## Code

Inline: \`const x = 1\`

Block:
\`\`\`ts
function add(a: number, b: number): number {
  return a + b;
}
\`\`\`

## Blockquote

\`\`\`
> To be, or not to be.
\`\`\`

## Tables (GFM)

\`\`\`
| Column A | Column B |
| -------- | -------- |
| cell 1   | cell 2   |
| cell 3   | cell 4   |
\`\`\`

## Divider

\`\`\`
---
\`\`\`

## Special: structural prefixes the Local Typographer recognizes

| Pattern               | Becomes            |
| --------------------- | ------------------ |
| \`第一章 标题\`           | \`# 标题\`            |
| \`一、 标题\`            | \`## 标题\`           |
| \`（一） 标题\`          | \`## 标题\`           |
| \`1.1 标题\`            | \`### 标题\`          |
| \`① 文本\`              | \`- 文本\`            |
| \`关键结论：xxx\`         | \`**关键结论：** xxx\` |

> The AI typographer does the same job, but understands nuance: it can infer *where* a divider should go, when to bold key terms, and how to wrap long sections in tables. It still preserves every word of your text.
`;
