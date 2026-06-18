import type { ThemeMeta } from './types';

/**
 * 15 built-in themes. The actual colors are defined as CSS custom
 * properties on `[data-theme="..."]` selectors in `src/index.css`.
 * This file only holds display metadata for the picker UI.
 *
 * If you add a new theme:
 *   1. Add a CSS block in index.css for `[data-theme="your-id"]`.
 *   2. Add an entry here with matching preview swatches.
 */
export const themes: ThemeMeta[] = [
  {
    id: 'notion-classic',
    name: 'Notion Classic',
    author: 'Built-in',
    swatch: { bg: '#ffffff', fg: '#37352f', accent: '#2383e2' },
  },
  {
    id: 'manus-minimal',
    name: 'Manus Minimal',
    author: 'Built-in',
    swatch: { bg: '#fafaf7', fg: '#1a1a1a', accent: '#d97706' },
  },
  {
    id: 'google-material',
    name: 'Google Material',
    author: 'Built-in',
    swatch: { bg: '#ffffff', fg: '#212121', accent: '#1a73e8' },
  },
  {
    id: 'red-note',
    name: 'Red Note',
    author: 'Built-in',
    swatch: { bg: '#fff5f5', fg: '#2c2c2c', accent: '#ff2442' },
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    author: 'Built-in',
    swatch: { bg: '#ffffff', fg: '#1f2328', accent: '#0969da' },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    author: 'Built-in',
    swatch: { bg: '#1a1b26', fg: '#c0caf5', accent: '#7aa2f7' },
  },
  {
    id: 'everforest',
    name: 'Everforest',
    author: 'Built-in',
    swatch: { bg: '#2d353b', fg: '#d3c6aa', accent: '#a7c080' },
  },
  {
    id: 'nord-frost',
    name: 'Nord Frost',
    author: 'Built-in',
    swatch: { bg: '#2e3440', fg: '#d8dee9', accent: '#88c0d0' },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    author: 'Built-in',
    swatch: { bg: '#282a36', fg: '#f8f8f2', accent: '#bd93f9' },
  },
  {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    author: 'Built-in',
    swatch: { bg: '#fafafa', fg: '#171717', accent: '#525252' },
  },
  {
    id: 'zhihu-blue',
    name: 'Zhihu Blue',
    author: 'Built-in',
    swatch: { bg: '#ffffff', fg: '#1a1a1a', accent: '#0084ff' },
  },
  {
    id: 'rose-pine',
    name: 'Rose Pine',
    author: 'Built-in',
    swatch: { bg: '#191724', fg: '#e0def4', accent: '#c4a7e7' },
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    author: 'Built-in',
    swatch: { bg: '#f0fdf4', fg: '#14532d', accent: '#16a34a' },
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    author: 'Built-in',
    swatch: { bg: '#0f172a', fg: '#e2e8f0', accent: '#60a5fa' },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    author: 'Built-in',
    swatch: { bg: '#ffffff', fg: '#000000', accent: '#000000' },
  },
  {
    id: 'tea-mist',
    name: 'Tea Mist 茶雾',
    author: 'Built-in',
    swatch: { bg: '#f3ecdc', fg: '#3a2a1f', accent: '#b58070' },
  },
  {
    id: 'rice-paper',
    name: 'Rice Paper 米纸',
    author: 'Built-in',
    swatch: { bg: '#faf6ec', fg: '#2c2823', accent: '#6b5d4a' },
  },
  {
    id: 'ink-wash',
    name: 'Ink Wash 水墨',
    author: 'Built-in',
    swatch: { bg: '#f4f2ee', fg: '#2a2826', accent: '#6b6b6b' },
  },
  {
    id: 'soft-plum',
    name: 'Soft Plum 软梅',
    author: 'Built-in',
    swatch: { bg: '#f8efe8', fg: '#3d2a28', accent: '#8b5c5c' },
  },
  {
    id: 'cinnabar-manuscript',
    name: 'Cinnabar Manuscript 朱砂稿纸',
    author: 'Built-in',
    swatch: { bg: '#f4ecd8', fg: '#1a1714', accent: '#c8392a' },
  },
];

export const defaultThemeId = themes[0]!.id;

export function getThemeMeta(id: string): ThemeMeta {
  return themes.find((t) => t.id === id) ?? themes[0]!;
}
