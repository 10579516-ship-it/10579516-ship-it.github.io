/**
 * Word (.docx) import pipeline.
 *
 *   File (Blob)
 *     → mammoth.convertToHtml  (DOCX → HTML)
 *     → new TurndownService().turndown  (HTML → Markdown)
 *     → formatTextWithLocalRules  (final structural cleanup)
 *
 * We intentionally do NOT call out to an LLM for cleanup — Ghost Editor
 * runs entirely in the browser and the local typographer is good enough
 * for the typical "Word doc with paragraphs and a few headings" case.
 */

import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { formatTextWithLocalRules } from './localTypographer';

export class WordImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WordImportError';
  }
}

export async function importDocx(file: File): Promise<string> {
  if (!file.name.toLowerCase().endsWith('.docx')) {
    throw new WordImportError('Please choose a .docx file.');
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new WordImportError('File is larger than 25 MB — please trim it first.');
  }

  let html: string;
  try {
    const buf = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer: buf });
    html = result.value;
  } catch (err) {
    throw new WordImportError(
      `Could not read the .docx file: ${(err as Error).message ?? 'unknown error'}`,
    );
  }

  if (!html || html.trim() === '') {
    throw new WordImportError('The file appears to be empty.');
  }

  let markdown: string;
  try {
    const turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '*',
    });
    // Strip Word-specific span styles that pollute output.
    turndown.addRule('strip-empty', {
      filter: (node) =>
        node.nodeName === 'P' && (node as HTMLElement).textContent?.trim() === '',
      replacement: () => '',
    });
    markdown = turndown.turndown(html);
  } catch (err) {
    throw new WordImportError(
      `HTML→Markdown conversion failed: ${(err as Error).message ?? 'unknown error'}`,
    );
  }

  return formatTextWithLocalRules(markdown);
}
