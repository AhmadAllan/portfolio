# util-markdown

Markdown utility library with Shiki syntax highlighting support.

## Features

- Markdown parsing with [marked](https://github.com/markedjs/marked)
- Syntax highlighting with [Shiki](https://shiki.style/)
- Reading time calculation
- Sanitized HTML output
- Customizable highlighter themes

## Usage

```typescript
import { MarkdownService } from '@portfolio/util-markdown';

const markdownService = new MarkdownService();
const html = markdownService.parse('# Hello World');
const readingTime = markdownService.calculateReadingTime(markdownText);
```

## Installation

This library is part of the portfolio monorepo and is automatically available to other libraries and applications.
