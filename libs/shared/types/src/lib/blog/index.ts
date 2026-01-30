import { PostStatus } from '../common';

export interface IPost {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  status: PostStatus;
  featuredImage?: string;
  readingTime: number;
  seriesId?: string;
  seriesOrder?: number;
  metaTitle?: string;
  metaTitleEn?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  ogImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  categories?: ICategory[];
  tags?: ITag[];
  series?: ISeries;
  relatedPosts?: IPost[];
}

export interface ICategory {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  parent?: ICategory;
  children?: ICategory[];
}

export interface ITag {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISeries {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  posts?: IPost[];
}

// Export DTOs
export * from './dto';
