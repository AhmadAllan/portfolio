export interface MarkdownParseOptions {
  /** Enable syntax highlighting */
  highlight?: boolean;
  /** Shiki theme for syntax highlighting */
  theme?: string;
  /** Enable sanitization of HTML output */
  sanitize?: boolean;
  /** Custom marked options */
  markedOptions?: any;
}

export interface MarkdownParseResult {
  /** Rendered HTML */
  html: string;
  /** Reading time in minutes */
  readingTime: number;
  /** Word count */
  wordCount: number;
}

export interface ReadingTimeOptions {
  /** Words per minute for reading time calculation */
  wordsPerMinute?: number;
}

export type ShikiTheme =
  | 'dark-plus'
  | 'light-plus'
  | 'github-dark'
  | 'github-light'
  | 'nord'
  | 'dracula'
  | 'monokai'
  | 'solarized-dark'
  | 'solarized-light';
