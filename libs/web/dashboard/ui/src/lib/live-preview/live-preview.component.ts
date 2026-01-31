import { Component, inject, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownService, type ShikiTheme } from '@portfolio/util-markdown';

@Component({
  selector: 'lib-live-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-preview.component.html',
  styleUrls: ['./live-preview.component.scss'],
})
export class LivePreviewComponent {
  readonly markdown = input('');
  readonly theme = input<ShikiTheme>('github-dark');
  readonly minHeight = input('300px');

  private readonly markdownService = inject(MarkdownService);

  html = '';
  readingTime = 0;
  wordCount = 0;

  constructor() {
    // Use effect() instead of ngOnChanges for signal reactivity
    effect(() => {
      // This runs whenever markdown() or theme() changes
      this.updatePreview();
    });
  }

  private async updatePreview() {
    const md = this.markdown();
    if (!md) {
      this.html = '';
      this.readingTime = 0;
      this.wordCount = 0;
      return;
    }

    const result = await this.markdownService.parse(md, {
      highlight: true,
      theme: this.theme(),
      sanitize: true,
    });

    this.html = result.html;
    this.readingTime = result.readingTime;
    this.wordCount = result.wordCount;
  }
}
