# Code Review Fixes

> Generated: 2026-01-30
> Branch: `001-lovecraftian-portfolio-mvp`

This document outlines all issues found during code review, organized into phases for systematic resolution.

---

## Phase 1: Critical Blocking Issues

These issues prevent the project from building or linting correctly. **Must be fixed first.**

### 1.1 Duplicate Import in ESLint Config

**File:** `libs/shared/types/eslint.config.mjs:1-2`

**Problem:**
```javascript
import baseConfig from '../../../eslint.base.config.mjs';
import baseConfig from '../../../eslint.config.mjs';  // Duplicate identifier
```

**Fix:**
```javascript
import baseConfig from '../../../eslint.config.mjs';
```

Remove the first import line entirely.

---

### 1.2 Typo in Category Controller

**File:** `libs/api/blog/src/lib/category/category.controller.ts:1`

**Problem:**
```typescript
pimport {
```

**Fix:**
```typescript
import {
```

Remove the extra `p` character at the beginning of the file.

---

### 1.3 Imports at End of File

**Files:**
- `libs/api/blog/src/lib/category/category.service.ts:178-179`
- `libs/api/blog/src/lib/tag/tag.service.ts:120-121`
- `libs/api/blog/src/lib/series/series.service.ts:160-161`

**Problem:**
```typescript
// At the end of the file
import { sql } from 'drizzle-orm';
```

**Fix:** Move `sql` import to the top of each file with other drizzle-orm imports:

```typescript
import { eq, desc, asc, sql } from 'drizzle-orm';
```

Then remove the import statement from the bottom of the file.

---

## Phase 2: Route Ordering Issues

These issues cause endpoints to be unreachable due to Express route matching order.

### 2.1 Post Controller Route Order

**File:** `libs/api/blog/src/lib/post/post.controller.ts`

**Problem:** The `admin/count` endpoint is defined after `:id`, making it unreachable.

**Fix:** Reorder methods so static routes come before parameterized routes:

```typescript
@Controller('blog/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 1. Static routes FIRST
  @Public()
  @Get()
  async findAll(@Query() query: ListPostsDto) { ... }

  @UseGuards(JwtAuthGuard)
  @Get('admin/count')  // MOVE THIS BEFORE :id routes
  async count(@Query() query: ListPostsDto) { ... }

  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) { ... }

  // 2. Parameterized routes LAST
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) { ... }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto) { ... }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(...) { ... }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) { ... }
}
```

---

### 2.2 Category Controller Route Order

**File:** `libs/api/blog/src/lib/category/category.controller.ts`

**Fix:** Same pattern - move `admin/count` before `:id`:

```typescript
// Order should be:
// 1. @Get()
// 2. @Get('root')
// 3. @Get('admin/count')  <-- MOVE HERE
// 4. @Get('slug/:slug')
// 5. @Get(':parentId/children')
// 6. @Get(':id')
// 7. @Post()
// 8. @Patch(':id')
// 9. @Delete(':id')
```

---

### 2.3 Tag Controller Route Order

**File:** `libs/api/blog/src/lib/tag/tag.controller.ts`

**Fix:** Same pattern:

```typescript
// Order should be:
// 1. @Get()
// 2. @Get('admin/count')  <-- MOVE HERE
// 3. @Get('slug/:slug')
// 4. @Get(':id')
// 5. @Post()
// 6. @Patch(':id')
// 7. @Delete(':id')
```

---

### 2.4 Series Controller Route Order

**File:** `libs/api/blog/src/lib/series/series.controller.ts`

**Fix:** Same pattern:

```typescript
// Order should be:
// 1. @Get()
// 2. @Get('admin/count')  <-- MOVE HERE
// 3. @Get('slug/:slug')
// 4. @Get('slug/:slug/posts')
// 5. @Get(':id')
// 6. @Post()
// 7. @Patch(':id')
// 8. @Delete(':id')
```

---

## Phase 3: Angular Signal-Based Inputs/Outputs Migration

Migrate from decorator-based `@Input()/@Output()` to modern signal-based `input()/output()`.

### 3.1 Post Editor Component

**File:** `libs/web/dashboard/feature-portfolio/src/lib/post-editor/post-editor.component.ts`

**Current:**
```typescript
import { Component, inject, OnInit } from '@angular/core';
// ...
@Input() postId?: string;
```

**Fix:**
```typescript
import { Component, inject, OnInit, input } from '@angular/core';
// ...
readonly postId = input<string>();

// Update usages:
// this.postId  →  this.postId()
```

**Update method usages:**
```typescript
ngOnInit() {
  // ...
  if (this.postId()) {  // Add parentheses
    this.loadPost();
  }
}

private async loadPost() {
  const id = this.postId();  // Read signal value
  if (!id) return;
  // Use 'id' instead of 'this.postId'
}
```

---

### 3.2 Markdown Editor Component

**File:** `libs/web/dashboard/ui/src/lib/markdown-editor/markdown-editor.component.ts`

**Current:**
```typescript
import { Component, input, output, EventEmitter, forwardRef, inject } from '@angular/core';
// ...
@Input() content = '';
@Input() placeholder = '';
@Input() readonly = false;
@Input() minHeight = '300px';
@Input() maxHeight = '600px';
@Output() contentChange = new EventEmitter<string>();
@Output() blur = new EventEmitter<void>();
```

**Fix:**
```typescript
import { Component, inject, input, output, model } from '@angular/core';
// ...

// Use model() for two-way binding on content
readonly content = model('');

// Regular inputs
readonly placeholder = input('');
readonly isReadonly = input(false);  // Renamed to avoid 'readonly' keyword conflict
readonly minHeight = input('300px');
readonly maxHeight = input('600px');

// Signal-based outputs
readonly contentChange = output<string>();
readonly blur = output<void>();
```

**Update method usages:**
```typescript
async updatePreview() {
  const currentContent = this.content();  // Read signal
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
  // ...
}

onContentChange(value: string) {
  this.content.set(value);  // Use .set() for model
  this.contentChange.emit(value);
  if (this.isPreviewMode) {
    this.updatePreview();
  }
}
```

---

### 3.3 Live Preview Component

**File:** `libs/web/dashboard/ui/src/lib/live-preview/live-preview.component.ts`

**Current:**
```typescript
import { Component, input, inject } from '@angular/core';
// ...
@Input() markdown = '';
@Input() theme: 'dark-plus' | 'light-plus' | 'github-dark' | 'github-light' = 'github-dark';
@Input() minHeight = '300px';
```

**Fix:**
```typescript
import { Component, inject, input, effect } from '@angular/core';
import type { ShikiTheme } from '@portfolio/util-markdown';
// ...

readonly markdown = input('');
readonly theme = input<ShikiTheme>('github-dark');
readonly minHeight = input('300px');

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
  // ...
}
```

**Remove:** `ngOnChanges()` method (no longer needed with effect).

---

### 3.4 SEO Fields Component

**File:** `libs/web/dashboard/ui/src/lib/seo-fields/seo-fields.component.ts`

**Current:**
```typescript
import { Component, input, output, EventEmitter } from '@angular/core';
// ...
@Input() metaTitle = '';
@Input() metaTitleEn = '';
@Input() metaDescription = '';
@Input() metaDescriptionEn = '';
@Input() ogImage = '';
@Input() showLanguageToggle = true;
@Input() currentLanguage = 'en';
@Output() metaTitleChange = new EventEmitter<string>();
@Output() metaTitleEnChange = new EventEmitter<string>();
@Output() metaDescriptionChange = new EventEmitter<string>();
@Output() metaDescriptionEnChange = new EventEmitter<string>();
@Output() ogImageChange = new EventEmitter<string>();
```

**Fix:**
```typescript
import { Component, input, output, model, computed } from '@angular/core';
// ...

// Use model() for two-way bindable fields
readonly metaTitle = model('');
readonly metaTitleEn = model('');
readonly metaDescription = model('');
readonly metaDescriptionEn = model('');
readonly ogImage = model('');

// Regular inputs
readonly showLanguageToggle = input(true);
readonly currentLanguage = input<'en' | 'ar'>('en');

// Computed signal for language state
readonly isEnglish = computed(() => this.currentLanguage() === 'en');

// Outputs (still needed if parent needs change events beyond two-way binding)
readonly metaTitleChange = output<string>();
readonly metaTitleEnChange = output<string>();
readonly metaDescriptionChange = output<string>();
readonly metaDescriptionEnChange = output<string>();
readonly ogImageChange = output<string>();
```

**Update methods:**
```typescript
onMetaTitleChange(value: string) {
  this.metaTitle.set(value);
  this.metaTitleChange.emit(value);
}

// Similar updates for other change handlers...
```

**Remove:** `isEnglish` property and `toggleLanguage` method (use `currentLanguage` input from parent).

---

## Phase 4: Async Pattern Standardization

Convert all `.toPromise()` and `.subscribe()` to `firstValueFrom()` for consistent async/await usage.

### 4.1 Post Editor Component

**File:** `libs/web/dashboard/feature-portfolio/src/lib/post-editor/post-editor.component.ts`

**Add import:**
```typescript
import { firstValueFrom } from 'rxjs';
```

**Fix methods:**

```typescript
private async loadPosts(): Promise<void> {
  try {
    const result = await firstValueFrom(
      this.blogService.getPosts({ status: 'published' })
    );
    this.posts = result.data || [];
  } catch (error) {
    console.error('Error loading posts:', error);
  }
}

private async loadCategories(): Promise<void> {
  try {
    this.categories = await firstValueFrom(this.blogService.getCategories());
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

private async loadTags(): Promise<void> {
  try {
    this.tags = await firstValueFrom(this.blogService.getTags());
  } catch (error) {
    console.error('Error loading tags:', error);
  }
}

private async loadSeries(): Promise<void> {
  try {
    this.series = await firstValueFrom(this.blogService.getSeries());
  } catch (error) {
    console.error('Error loading series:', error);
  }
}

private async loadPost(): Promise<void> {
  const id = this.postId();
  if (!id) return;

  this.isLoading = true;
  try {
    const post = await firstValueFrom(this.blogService.getPostById(id));
    this.form = {
      title: post.title,
      // ... rest of form population
    };
  } catch (error) {
    console.error('Error loading post:', error);
  } finally {
    this.isLoading = false;
  }
}

async savePost(): Promise<void> {
  // ...
  this.isSaving = true;
  try {
    const postData = { /* ... */ };

    if (this.postId()) {
      await firstValueFrom(
        this.blogService.updatePost(this.postId()!, postData)
      );
    } else {
      await firstValueFrom(
        this.blogService.createPost(postData as any)
      );
    }

    this.router.navigate(['/dashboard/posts']);
  } catch (error) {
    console.error('Error saving post:', error);
  } finally {
    this.isSaving = false;
  }
}
```

---

### 4.2 Post List Component

**File:** `libs/web/dashboard/feature-portfolio/src/lib/post-list/post-list.component.ts`

**Add import:**
```typescript
import { firstValueFrom } from 'rxjs';
```

**Fix methods:**

```typescript
async loadReferenceData(): Promise<void> {
  try {
    const [categoriesData, tagsData, seriesData] = await Promise.all([
      firstValueFrom(this.blogService.getCategories()),
      firstValueFrom(this.blogService.getTags()),
      firstValueFrom(this.blogService.getSeries()),
    ]);

    this.categories.set(categoriesData || []);
    this.tags.set(tagsData || []);
    this.series.set(seriesData || []);
  } catch (err) {
    console.error('Failed to load reference data:', err);
  }
}

async loadPosts(): Promise<void> {
  this.isLoading.set(true);
  const f = this.filter();

  const params: IPostListParams = {
    page: this.currentPage(),
    limit: this.pageSize,
    sortBy: f.sortBy,
    sortOrder: f.sortOrder,
  };

  if (f.status !== 'all') params.status = f.status;
  if (f.categoryId) params.categoryId = f.categoryId;
  if (f.tagId) params.tagId = f.tagId;
  if (f.seriesId) params.seriesId = f.seriesId;
  if (f.search) params.search = f.search;

  try {
    const data = await firstValueFrom(this.blogService.getPosts(params));
    this.posts.set(data.data || []);
    this.totalPosts.set(data.total || 0);
    this.totalPages.set(Math.ceil((data.total || 0) / this.pageSize));
  } catch (err) {
    console.error('Failed to load posts:', err);
  } finally {
    this.isLoading.set(false);
  }
}

async deletePost(id: string): Promise<void> {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return;
  }

  this.isDeleting.set(true);
  try {
    await firstValueFrom(this.blogService.deletePost(id));
    await this.loadPosts();
  } catch (err) {
    console.error('Failed to delete post:', err);
    alert('Failed to delete post. Please try again.');
  } finally {
    this.isDeleting.set(false);
  }
}

// Update callers to be async
async ngOnInit(): Promise<void> {
  await this.loadReferenceData();
  await this.loadPosts();
}

async onFilterChange(): Promise<void> {
  this.currentPage.set(1);
  await this.loadPosts();
}

async onSearchChange(value: string): Promise<void> {
  this.filter.update(f => ({ ...f, search: value }));
  this.currentPage.set(1);
  await this.loadPosts();
}

async onPageChange(page: number): Promise<void> {
  this.currentPage.set(page);
  await this.loadPosts();
}

async onSortChange(sortBy: string): Promise<void> {
  this.filter.update(f => ({
    ...f,
    sortBy: sortBy as PostListFilter['sortBy'],
    sortOrder: f.sortBy === sortBy && f.sortOrder === 'desc' ? 'asc' : 'desc'
  }));
  await this.loadPosts();
}
```

---

### 4.3 Category Manager Component

**File:** `libs/web/dashboard/feature-portfolio/src/lib/category-manager/category-manager.component.ts`

**Add import:**
```typescript
import { firstValueFrom } from 'rxjs';
```

**Fix methods:**

```typescript
async loadCategories(): Promise<void> {
  this.isLoading.set(true);
  try {
    const data = await firstValueFrom(this.blogService.getCategories());
    this.categories.set(data || []);
  } catch (err) {
    console.error('Failed to load categories:', err);
  } finally {
    this.isLoading.set(false);
  }
}

async onSubmit(): Promise<void> {
  if (this.categoryForm.invalid) {
    this.markFormGroupTouched(this.categoryForm);
    return;
  }

  this.isSaving.set(true);
  const formValue = this.categoryForm.value as CategoryForm;

  try {
    if (formValue.id) {
      const updateData = {
        name: formValue.name,
        nameEn: formValue.nameEn,
        description: formValue.description,
        descriptionEn: formValue.descriptionEn,
        parentId: formValue.parentId
      };
      await firstValueFrom(
        this.blogService.updateCategory(formValue.id, updateData)
      );
    } else {
      const createData = {
        slug: formValue.slug,
        name: formValue.name,
        nameEn: formValue.nameEn,
        description: formValue.description,
        descriptionEn: formValue.descriptionEn,
        parentId: formValue.parentId
      };
      await firstValueFrom(this.blogService.createCategory(createData));
    }

    this.resetForm();
    await this.loadCategories();
  } catch (err) {
    console.error('Failed to save category:', err);
    alert('Failed to save category. Please try again.');
  } finally {
    this.isSaving.set(false);
  }
}

async deleteCategory(id: string): Promise<void> {
  if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    return;
  }

  this.isDeleting.set(true);
  try {
    await firstValueFrom(this.blogService.deleteCategory(id));
    await this.loadCategories();
    if (this.categoryForm.value.id === id) {
      this.resetForm();
    }
  } catch (err) {
    console.error('Failed to delete category:', err);
    alert('Failed to delete category. Please try again.');
  } finally {
    this.isDeleting.set(false);
  }
}
```

---

### 4.4 Tag Manager Component

**File:** `libs/web/dashboard/feature-portfolio/src/lib/tag-manager/tag-manager.component.ts`

Apply the same pattern as Category Manager - replace all `.subscribe()` with `await firstValueFrom()`.

---

### 4.5 Series Manager Component

**File:** `libs/web/dashboard/feature-portfolio/src/lib/series-manager/series-manager.component.ts`

Apply the same pattern as Category Manager - replace all `.subscribe()` with `await firstValueFrom()`.

---

## Phase 5: Type Safety Improvements

### 5.1 Remove Unsafe Type Assertions

**File:** `libs/api/blog/src/lib/post/post.controller.ts:31`

**Current:**
```typescript
query.status = 'published' as any;
```

**Fix:**
```typescript
query.status = 'published';
```

The DTO already allows this value, so no assertion needed.

---

**File:** `libs/api/blog/src/lib/post/post.service.ts:314`

**Current:**
```typescript
const updates: any = { ...updatePostDto, readingTime };
```

**Fix:**
```typescript
const updates: Partial<typeof posts.$inferInsert> & { readingTime: number } = {
  ...updatePostDto,
  readingTime,
};
```

Or create a proper type for updates.

---

### 5.2 Add Missing OnChanges Interface

**File:** `libs/web/dashboard/ui/src/lib/live-preview/live-preview.component.ts`

If keeping `ngOnChanges` instead of using `effect()`:

```typescript
import { Component, inject, input, OnChanges, SimpleChanges } from '@angular/core';

export class LivePreviewComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.updatePreview();
  }
}
```

---

## Phase 6: Code Quality Improvements

### 6.1 Replace DOM Manipulation with ViewChild

**File:** `libs/web/dashboard/ui/src/lib/markdown-editor/markdown-editor.component.ts`

**Current:**
```typescript
insertMarkdown(prefix: string, suffix: string = '') {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  // ...
}
```

**Fix:**
```typescript
import { Component, inject, input, output, model, viewChild, ElementRef } from '@angular/core';

// In component class:
private readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('editorTextarea');

insertMarkdown(prefix: string, suffix: string = ''): void {
  const textareaEl = this.textareaRef();
  if (!textareaEl) return;

  const textarea = textareaEl.nativeElement;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  // ... rest of logic
}
```

**In template:**
```html
<textarea #editorTextarea ...></textarea>
```

---

### 6.2 Extract Magic Numbers to Constants

**File:** `libs/api/blog/src/lib/post/post.service.ts`

```typescript
const WORDS_PER_MINUTE = 200;

private calculateReadingTime(content: string): number {
  // ...
  return Math.ceil(words / WORDS_PER_MINUTE);
}
```

**File:** `libs/web/util-markdown/src/lib/markdown.service.ts`

```typescript
const DEFAULT_WORDS_PER_MINUTE = 200;
```

---

### 6.3 Consistent Component Selector Prefixes

Decide on a convention and apply consistently:
- `lib-` for library/shared components (ui library)
- `app-` for application-specific components (feature library)

Or use project-specific prefixes configured in `angular.json`.

---

## Phase 7: ESLint Configuration Fix

### 7.1 Fix Type-Aware Rules

The root `eslint.config.mjs` enables type-aware rules but libraries don't have `parserOptions.project` configured.

**Option A:** Remove type-aware rules from root config:

```javascript
// Remove these rules:
// '@typescript-eslint/no-floating-promises': 'error',
// '@typescript-eslint/no-misused-promises': 'error',
// '@typescript-eslint/await-thenable': 'error',
```

**Option B:** Add parserOptions to each library's eslint config:

```javascript
// In each libs/**/eslint.config.mjs
export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

---

## Checklist

### Phase 1: Critical Blocking Issues
- [ ] Fix duplicate import in `libs/shared/types/eslint.config.mjs`
- [ ] Fix typo in `libs/api/blog/src/lib/category/category.controller.ts`
- [ ] Move `sql` import to top in `category.service.ts`
- [ ] Move `sql` import to top in `tag.service.ts`
- [ ] Move `sql` import to top in `series.service.ts`

### Phase 2: Route Ordering
- [ ] Reorder routes in `post.controller.ts`
- [ ] Reorder routes in `category.controller.ts`
- [ ] Reorder routes in `tag.controller.ts`
- [ ] Reorder routes in `series.controller.ts`

### Phase 3: Signal-Based Inputs/Outputs
- [ ] Migrate `post-editor.component.ts`
- [ ] Migrate `markdown-editor.component.ts`
- [ ] Migrate `live-preview.component.ts`
- [ ] Migrate `seo-fields.component.ts`

### Phase 4: Async Pattern Standardization
- [ ] Update `post-editor.component.ts`
- [ ] Update `post-list.component.ts`
- [ ] Update `category-manager.component.ts`
- [ ] Update `tag-manager.component.ts`
- [ ] Update `series-manager.component.ts`

### Phase 5: Type Safety
- [ ] Remove unsafe type assertions
- [ ] Add missing interface implementations

### Phase 6: Code Quality
- [ ] Replace DOM manipulation with ViewChild
- [ ] Extract magic numbers to constants
- [ ] Standardize selector prefixes

### Phase 7: ESLint Configuration
- [ ] Fix type-aware rules configuration

---

## Notes

- Run `npx nx run-many -t lint` after Phase 1 to verify blocking issues are resolved
- Run `npx nx run-many -t build` after each phase to catch type errors
- Consider adding unit tests for the refactored async methods
