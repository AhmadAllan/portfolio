import type { ICategory, IPost, ISeries, ITag } from './index';
import type { PostStatus } from '../common';

// ============================================
// Post DTOs
// ============================================

export interface CreatePostDto {
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  status: PostStatus;
  featuredImage?: string;
  seriesId?: string;
  seriesOrder?: number;
  metaTitle?: string;
  metaTitleEn?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  ogImage?: string;
  categoryIds?: string[];
  tagIds?: string[];
  publishedAt?: Date | string;
}

export interface UpdatePostDto {
  slug?: string;
  title?: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  content?: string;
  contentEn?: string;
  status?: PostStatus;
  featuredImage?: string;
  seriesId?: string;
  seriesOrder?: number;
  metaTitle?: string;
  metaTitleEn?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  ogImage?: string;
  categoryIds?: string[];
  tagIds?: string[];
  publishedAt?: Date | string;
}

// ============================================
// Category DTOs
// ============================================

export interface CreateCategoryDto {
  slug: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  parentId?: string;
}

export interface UpdateCategoryDto {
  slug?: string;
  name?: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  parentId?: string;
}

// ============================================
// Tag DTOs
// ============================================

export interface CreateTagDto {
  slug: string;
  name: string;
  nameEn?: string;
}

export interface UpdateTagDto {
  slug?: string;
  name?: string;
  nameEn?: string;
}

// ============================================
// Series DTOs
// ============================================

export interface CreateSeriesDto {
  slug: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
}

export interface UpdateSeriesDto {
  slug?: string;
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
}
