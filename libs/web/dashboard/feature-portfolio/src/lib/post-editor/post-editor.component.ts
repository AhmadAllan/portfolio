import { Component, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BlogService, ICategory, IPost, ISeries, ITag } from '@portfolio/dashboard/data-access';

interface PostForm {
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  metaTitle?: string;
  metaTitleEn?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  ogImage?: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  seriesId?: string;
  seriesOrder?: number | null;
  categoryIds: string[];
  tagIds: string[];
  relatedPostIds: string[];
  publishedAt?: string;
}

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss'],
})
export class PostEditorComponent implements OnInit {
  readonly postId = input<string>();

  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);

  form!: PostForm;
  posts: IPost[] = [];
  categories: ICategory[] = [];
  tags: ITag[] = [];
  series: ISeries[] = [];
  isLoading = false;
  isSaving = false;
  currentLanguage: 'en' | 'ar' = 'en';

  ngOnInit(): void {
    this.initForm();
    void this.loadPosts();
    void this.loadCategories();
    void this.loadTags();
    void this.loadSeries();
    const id = this.postId();
    if (id) {
      void this.loadPost();
    }
  }

  private initForm(): void {
    this.form = {
      title: '',
      titleEn: '',
      excerpt: '',
      excerptEn: '',
      content: '',
      contentEn: '',
      metaTitle: '',
      metaTitleEn: '',
      metaDescription: '',
      metaDescriptionEn: '',
      ogImage: '',
      status: 'draft',
      featuredImage: '',
      seriesId: '',
      seriesOrder: null,
      categoryIds: [],
      tagIds: [],
      relatedPostIds: []
    };
  }

  private async loadPosts(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.blogService.getPosts({ status: 'published' })
      );
      this.posts = result.data ?? [];
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
    if (!id) {
      return;
    }

    this.isLoading = true;
    try {
      const post = await firstValueFrom(this.blogService.getPostById(id));
      this.form = {
        title: post.title,
        titleEn: post.titleEn,
        excerpt: post.excerpt,
        excerptEn: post.excerptEn,
        content: post.content,
        contentEn: post.contentEn,
        metaTitle: post.metaTitle,
        metaTitleEn: post.metaTitleEn,
        metaDescription: post.metaDescription,
        metaDescriptionEn: post.metaDescriptionEn,
        ogImage: post.ogImage,
        status: post.status,
        featuredImage: post.featuredImage,
        seriesId: post.seriesId,
        seriesOrder: post.seriesOrder,
        categoryIds: post.categoryIds,
        tagIds: post.tagIds,
        relatedPostIds: post.relatedPostIds
      };
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async savePost(): Promise<void> {
    if (this.form.status === 'published') {
      this.form.publishedAt = new Date().toISOString();
    }

    this.isSaving = true;
    try {
      const postData = {
        title: this.form.title,
        titleEn: this.form.titleEn,
        excerpt: this.form.excerpt,
        excerptEn: this.form.excerptEn,
        content: this.form.content,
        contentEn: this.form.contentEn,
        metaTitle: this.form.metaTitle,
        metaTitleEn: this.form.metaTitleEn,
        metaDescription: this.form.metaDescription,
        metaDescriptionEn: this.form.metaDescriptionEn,
        ogImage: this.form.ogImage,
        status: this.form.status,
        featuredImage: this.form.featuredImage,
        seriesId: this.form.seriesId,
        seriesOrder: this.form.seriesOrder,
        categoryIds: this.form.categoryIds,
        tagIds: this.form.tagIds,
        relatedPostIds: this.form.relatedPostIds
      };

      const id = this.postId();
      if (id) {
        await firstValueFrom(this.blogService.updatePost(id, postData));
      } else {
        await firstValueFrom(this.blogService.createPost(postData));
      }

      void this.router.navigate(['/dashboard/posts']);
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      this.isSaving = false;
    }
  }

  toggleLanguage(lang: 'en' | 'ar'): void {
    this.currentLanguage = lang;
  }

  get isDraft(): boolean {
    return this.form.status === 'draft';
  }

  get isPublished(): boolean {
    return this.form.status === 'published';
  }

  get isArchived(): boolean {
    return this.form.status === 'archived';
  }

  get isValid(): boolean {
    return this.form.title && this.form.content;
  }
}
