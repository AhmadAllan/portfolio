import { Injectable } from '@angular/core';
import { marked, Renderer } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import {
  createHighlighter,
  type Highlighter,
  type BundledLanguage,
  type BundledTheme,
} from 'shiki';
import {
  MarkdownParseOptions,
  MarkdownParseResult,
  ReadingTimeOptions,
  ShikiTheme,
} from './markdown.types';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private highlighter: Highlighter | null = null;
  private highlighterPromise: Promise<Highlighter> | null = null;
  private defaultTheme: ShikiTheme = 'github-dark';

  constructor() {
    // Configure marked with safe defaults
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }

  /**
   * Parse markdown to HTML with optional syntax highlighting
   */
  async parse(
    markdown: string,
    options: MarkdownParseOptions = {}
  ): Promise<MarkdownParseResult> {
    const {
      highlight = true,
      theme = this.defaultTheme,
      sanitize = true,
      markedOptions = {},
    } = options;

    // Calculate reading time and word count
    const wordCount = this.countWords(markdown);
    const readingTime = this.calculateReadingTime(markdown);

    // Parse markdown to HTML
    let html: string;

    if (highlight) {
      html = await this.parseWithHighlight(markdown, theme, markedOptions);
    } else {
      html = await marked.parse(markdown, markedOptions);
    }

    // Sanitize HTML if requested
    if (sanitize) {
      html = DOMPurify.sanitize(html);
    }

    return {
      html,
      readingTime,
      wordCount,
    };
  }

  /**
   * Parse markdown with Shiki syntax highlighting
   */
  private async parseWithHighlight(
    markdown: string,
    theme: ShikiTheme,
    markedOptions: any
  ): Promise<string> {
    const highlighter = await this.getHighlighter(theme);

    // Configure marked renderer with Shiki
    const renderer = new Renderer();
    const originalCodeRenderer = renderer.code.bind(renderer);

    renderer.code = async (code: string, language: string) => {
      const lang = (language || 'text') as BundledLanguage;
      try {
        const html = highlighter.codeToHtml(code, {
          lang,
          theme: theme as BundledTheme,
        });
        return html;
      } catch {
        // Fallback to original renderer if language is not supported
        return originalCodeRenderer(code, language);
      }
    };

    return marked.parse(markdown, {
      ...markedOptions,
      renderer,
    });
  }

  /**
   * Get or initialize the Shiki highlighter
   */
  private async getHighlighter(theme: ShikiTheme): Promise<Highlighter> {
    if (this.highlighter) {
      return this.highlighter;
    }

    if (this.highlighterPromise) {
      return this.highlighterPromise;
    }

    this.highlighterPromise = createHighlighter({
      themes: [theme as BundledTheme],
      langs: [
        'javascript',
        'typescript',
        'python',
        'java',
        'c',
        'cpp',
        'csharp',
        'go',
        'rust',
        'php',
        'ruby',
        'swift',
        'kotlin',
        'html',
        'css',
        'scss',
        'json',
        'yaml',
        'markdown',
        'bash',
        'shell',
        'sql',
      ],
    });

    this.highlighter = await this.highlighterPromise;
    return this.highlighter;
  }

  /**
   * Calculate reading time for markdown content
   * Based on average reading speed of 200 words per minute
   */
  calculateReadingTime(
    markdown: string,
    options: ReadingTimeOptions = {}
  ): number {
    const { wordsPerMinute = 200 } = options;
    const wordCount = this.countWords(markdown);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Count words in markdown content
   * Strips markdown syntax and counts actual words
   */
  countWords(markdown: string): number {
    // Remove code blocks
    let text = markdown.replace(/```[\s\S]*?```/g, '');
    // Remove inline code
    text = text.replace(/`[^`]+`/g, '');
    // Remove markdown syntax
    text = text
      .replace(/#{1,6}\s/g, '') // Headers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
      .replace(/\*([^*]+)\*/g, '$1') // Italic
      .replace(/~~([^~]+)~~/g, '$1') // Strikethrough
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Images
      .replace(/^>\s+/gm, '') // Blockquotes
      .replace(/^[-*+]\s+/gm, '') // Lists
      .replace(/^\d+\.\s+/gm, ''); // Numbered lists

    // Split by whitespace and count non-empty words
    const words = text.trim().split(/\s+/);
    return words.filter((word) => word.length > 0).length;
  }

  /**
   * Extract plain text from markdown (for previews, excerpts, etc.)
   */
  extractPlainText(markdown: string, maxLength?: number): string {
    // Remove code blocks
    let text = markdown.replace(/```[\s\S]*?```/g, '');
    // Remove inline code
    text = text.replace(/`[^`]+`/g, '');
    // Remove markdown syntax
    text = text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/~~/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/^>\s+/gm, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '');

    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // Truncate if maxLength is specified
    if (maxLength && text.length > maxLength) {
      return text.substring(0, maxLength).trim() + '...';
    }

    return text;
  }

  /**
   * Extract headings from markdown
   */
  extractHeadings(markdown: string): Array<{ level: number; text: string; id: string }> {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Array<{ level: number; text: string; id: string }> = [];
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      headings.push({ level, text, id });
    }

    return headings;
  }

  /**
   * Extract code blocks from markdown
   */
  extractCodeBlocks(markdown: string): Array<{ language: string; code: string }> {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const codeBlocks: Array<{ language: string; code: string }> = [];
    let match;

    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      const language = match[1] || 'text';
      const code = match[2].trim();
      codeBlocks.push({ language, code });
    }

    return codeBlocks;
  }
}
