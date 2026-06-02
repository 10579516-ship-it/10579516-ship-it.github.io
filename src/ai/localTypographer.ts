/**
 * Local typographer — deterministic, offline, free.
 *
 * Hard rule: NEVER change a single word of the input. Only structure.
 * The AI typographer enforces the same rule via a system prompt; both
 * paths share the "structure, not words" brand promise.
 *
 * Pipeline (line by line, top to bottom):
 *   1. Preserve code fences (```...```) — content inside is left alone.
 *   2. Preserve already-marked lines (# / ## / > / * / + / - / 1. / - [ ]).
 *   3. Recognize chapter / section markers → # H1
 *   4. Chinese ordinal list (一、) → ## H2
 *   5. Parenthetical ordinal (（一）) or Arabic number with title → ## H2
 *   6. Dotted section number (1.1) → ### H3
 *   7. Bullets: ①, -, *, •, ·, a., i. → list
 *   8. Short prefix:  content → **prefix:** content
 *   9. Normalize: blank line before/after each heading, collapse 3+ blanks
 *      to 1, trim trailing whitespace per line.
 *
 * Idempotent: running the same input twice produces the same output.
 */

/** Returns true if the line starts with any explicit Markdown block marker. */
function isAlreadyMarked(line: string): boolean {
  return /^(#{1,6}\s|>\s|[-*+]\s|\d+\.\s|[-*+]\[[ xX]\]\s|```|~~~)/.test(line);
}

/** Returns true if the line is a code fence delimiter. */
function isFence(line: string): boolean {
  return /^```|^~~~/.test(line);
}

/** Returns true if the line looks like a Chinese-ordinal H2 marker. */
function isChineseOrdinalHeading(line: string): boolean {
  // 一、 二、 … 十、 十一、 二十、 etc. followed by a title.
  return /^[一二三四五六七八九十百千]+、\s*\S/.test(line);
}

/** Returns true if the line looks like a parenthetical or arabic-ordinal H2. */
function isParenOrdinalHeading(line: string): boolean {
  // （一） / (1) / 1. / 1、 followed by a short title (≤ 60 chars).
  if (/^[（(][一二三四五六七八九十0-9]+[)）]\s*\S/.test(line)) return true;
  if (/^\d+[、.]\s*\S/.test(line)) {
    // Avoid matching `1.1`, `1.1.1` — those go to H3.
    if (/^\d+\.\d/.test(line)) return false;
    return line.trim().length <= 60;
  }
  return false;
}

/** Returns true if the line looks like a chapter / section H1. */
function isChapterHeading(line: string): boolean {
  return /^第[一二三四五六七八九十百千0-9]+章\s+\S/.test(line) ||
         /^Chapter\s+\d+/i.test(line) ||
         /^Section\s+\d+/i.test(line);
}

/** Returns true if the line is a dotted-section-number H3 (1.1, 1.1.1). */
function isDottedSection(line: string): boolean {
  return /^\d+(\.\d+){1,3}\s+\S/.test(line) && line.trim().length <= 80;
}

/** Returns true if the line is a bullet (①, -, *, •, ·, a., i., A., I.). */
function isBullet(line: string): boolean {
  return /^[①-⑳]\s/.test(line) ||
         /^[-*•·]\s+\S/.test(line) ||
         /^[a-zA-Z]\.\s+\S/.test(line) ||
         /^[ivxIVX]+\.\s+\S/.test(line);
}

/**
 * Returns the bold-prefix replacement if the line matches
 * `prefix: content` (with a short, plausible prefix), else null.
 */
function boldPrefix(line: string): string | null {
  // Match "label: rest" or "label：rest" (CJK colon).
  // Prefix must be 1–8 chars (CJK letters or A-Za-z0-9), no spaces, not a URL/time.
  const m = /^([一-鿿A-Za-z0-9]{1,8})[：:]\s*(.+)$/.exec(line);
  if (!m) return null;
  const [, prefix, rest] = m;
  // Skip if the prefix looks like a time, URL, or code.
  if (/^\d/.test(prefix!)) return null;
  if (/^(http|https|ftp)$/i.test(prefix!)) return null;
  if (rest!.trim().length === 0) return null;
  return `**${prefix}：** ${rest}`;
}

/** Trim trailing whitespace from a line. */
function rtrim(s: string): string {
  return s.replace(/[ \t]+$/, '');
}

/** Apply a single line transform. Returns the new line content (without newline). */
function transformLine(rawLine: string): string {
  const line = rtrim(rawLine);
  if (line === '') return '';
  if (isAlreadyMarked(line)) return line;

  if (isChapterHeading(line)) {
    // Upgrade to H1: prepend '# '.
    return `# ${line}`;
  }
  if (isChineseOrdinalHeading(line) || isParenOrdinalHeading(line)) {
    return `## ${line}`;
  }
  if (isDottedSection(line)) {
    return `### ${line}`;
  }
  if (isBullet(line)) {
    return `- ${line.replace(/^[-*•·]\s+/, '').replace(/^[①-⑳]\s+/, '').replace(/^[a-zA-Z]\.\s+/, '').replace(/^[ivxIVX]+\.\s+/, '')}`;
  }
  const bold = boldPrefix(line);
  if (bold !== null) return bold;
  return line;
}

/**
 * Post-process: ensure headings have a blank line before them and
 * collapse runs of 3+ blank lines down to 1.
 */
function normalize(lines: string[]): string[] {
  const out: string[] = [];
  let prevBlank = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const isHeading = /^#{1,6}\s/.test(line);
    if (isHeading) {
      // Insert a blank line if the previous non-empty output line isn't blank.
      if (out.length > 0 && out[out.length - 1] !== '') out.push('');
    }
    if (line === '') {
      if (prevBlank) continue; // collapse 2nd blank onwards
      prevBlank = true;
    } else {
      prevBlank = false;
    }
    out.push(line);
  }
  // Strip trailing blanks.
  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  return out;
}

/**
 * Format a document using the local rule pipeline.
 * Idempotent: `format(format(x)) === format(x)`.
 */
export function formatTextWithLocalRules(input: string): string {
  if (!input) return '';
  // Split preserving line endings would over-engineer; \n is the universal contract.
  const rawLines = input.split('\n');
  const out: string[] = [];
  let inFence = false;
  let fenceMarker = '';

  for (const raw of rawLines) {
    if (isFence(raw)) {
      // Toggle fence state. Don't transform the fence line itself.
      if (!inFence) {
        inFence = true;
        fenceMarker = raw.slice(0, 3); // ``` or ~~~
      } else if (raw.startsWith(fenceMarker)) {
        inFence = false;
      }
      out.push(rtrim(raw));
      continue;
    }
    if (inFence) {
      // Inside a code block — leave untouched.
      out.push(raw);
      continue;
    }
    out.push(transformLine(raw));
  }

  return normalize(out).join('\n') + '\n';
}
