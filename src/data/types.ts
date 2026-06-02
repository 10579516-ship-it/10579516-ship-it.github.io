/**
 * Type definitions for Ghost Editor.
 *
 * Theme data is exposed both as TypeScript (for the picker UI / metadata)
 * and as CSS custom properties (for the actual rendering). The CSS file
 * in `src/index.css` is the source of truth for colors — `themes.ts`
 * holds display info (id, name, author, preview swatches) only.
 */

export interface ThemeMeta {
  /** Stable id used in localStorage and as `data-theme` attribute. */
  id: string;
  /** Human-readable name shown in the picker. */
  name: string;
  /** Original author or "Community" / "Built-in". */
  author: string;
  /** Three CSS color values used to render the picker swatch (bg, fg, accent). */
  swatch: {
    bg: string;
    fg: string;
    accent: string;
  };
}

export interface ApiConfig {
  apiKey: string;
  apiEndpoint: string;
  model: string;
}
