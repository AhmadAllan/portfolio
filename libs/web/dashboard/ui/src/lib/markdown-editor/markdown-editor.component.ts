import { Component, inject, model, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownService } from '@portfolio/util-markdown';

@Component({
  selector: 'lib-markdown-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
})
export class MarkdownEditorComponent {
  // Use model() for two-way binding
  readonly content = model('');

  // Regular inputs
  readonly placeholder = input('');
  readonly isReadonly = input(false); // Renamed to avoid 'readonly' keyword conflict
  readonly minHeight = input('300px');
  readonly maxHeight = input('600px');

  // Signal-based outputs
  readonly contentChange = output<string>();
  readonly blur = output<void>();

  private readonly markdownService = inject(MarkdownService);

  isPreviewMode = false;
  previewHtml = '';
  readingTime = 0;
  wordCount = 0;

  async updatePreview() {
    const currentContent = this.content();
    if (!currentContent) {
      this.previewHtml = '';
      this.readingTime = 0;
      this.wordCount = 0;
      return;
    }

    const result = await this.markdownService.parse(currentContent, {
      highlight: true,
      sanitize: true,
    });

    this.previewHtml = result.html;
    this.readingTime = result.readingTime;
    this.wordCount = result.wordCount;
  }

  insertMarkdown(prefix: string, suffix: string = '') {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    this.content.set(newText);
    this.contentChange.emit(newText);

    // Restore cursor position after Angular updates
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selection.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  insertHeading(level: number) {
    const prefix = '#'.repeat(level) + ' ';
    this.insertMarkdown(prefix);
  }

  insertBold() {
    this.insertMarkdown('**', '**');
  }

  insertItalic() {
    this.insertMarkdown('*', '*');
  }

  insertStrikethrough() {
    this.insertMarkdown('~~', '~~');
  }

  insertCode() {
    this.insertMarkdown('`', '`');
  }

  insertCodeBlock() {
    this.insertMarkdown('```\n', '\n```');
  }

  insertLink() {
    this.insertMarkdown('[', '](url)');
  }

  insertImage() {
    this.insertMarkdown('![alt](', ')');
  }

  insertUnorderedList() {
    this.insertMarkdown('- ');
  }

  insertOrderedList() {
    this.insertMarkdown('1. ');
  }

  insertBlockquote() {
    this.insertMarkdown('> ');
  }

  insertHorizontalRule() {
    this.insertMarkdown('\n---\n');
  }

  insertTable() {
    const tableTemplate = '\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |\n';
    this.insertMarkdown(tableTemplate);
  }

  onContentChange(value: string) {
    this.content.set(value);
    this.contentChange.emit(value);
    if (this.isPreviewMode) {
      this.updatePreview();
    }
  }

  onBlur() {
    this.blur.emit();
  }
}
