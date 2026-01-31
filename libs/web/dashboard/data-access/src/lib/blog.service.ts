import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IPost {
  id: string;
  slug: string;
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
  seriesOrder?: number;
  categoryIds: string[];
  tagIds: string[];
  relatedPostIds: string[];
  readingTime?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITag {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISeries {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPostListParams {
  status?: 'draft' | 'published' | 'archived';
  categoryId?: string;
  tagId?: string;
  seriesId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'publishedAt' | 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedPosts {
  data: IPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private readonly http: HttpClient) {}

  private readonly apiUrl = '/api';

  // Posts
  getPosts(params?: IPostListParams): Observable<IPaginatedPosts> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.tagId) queryParams.append('tagId', params.tagId);
    if (params?.seriesId) queryParams.append('seriesId', params.seriesId);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.apiUrl}/blog/posts?${queryString}` : `${this.apiUrl}/blog/posts`;

    return this.http.get<IPaginatedPosts>(url);
  }

  getPostById(id: string): Observable<IPost> {
    return this.http.get<IPost>(`${this.apiUrl}/blog/posts/${id}`);
  }

  getPostBySlug(slug: string): Observable<IPost> {
    return this.http.get<IPost>(`${this.apiUrl}/blog/posts/slug/${slug}`);
  }

  createPost(data: Omit<IPost, 'id' | 'readingTime' | 'publishedAt' | 'createdAt' | 'updatedAt'>): Observable<IPost> {
    return this.http.post<IPost>(`${this.apiUrl}/blog/posts`, data);
  }

  updatePost(id: string, data: Partial<IPost>): Observable<IPost> {
    return this.http.patch<IPost>(`${this.apiUrl}/blog/posts/${id}`, data);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/posts/${id}`);
  }

  getPostsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/blog/posts/admin/count`);
  }

  // Categories
  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}/blog/categories`);
  }

  getRootCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}/blog/categories/root`);
  }

  getChildCategories(parentId: string): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}/blog/categories/${parentId}/children`);
  }

  getCategoryById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.apiUrl}/blog/categories/${id}`);
  }

  getCategoryBySlug(slug: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.apiUrl}/blog/categories/slug/${slug}`);
  }

  createCategory(data: Omit<ICategory, 'id' | 'createdAt' | 'updatedAt'>): Observable<ICategory> {
    return this.http.post<ICategory>(`${this.apiUrl}/blog/categories`, data);
  }

  updateCategory(id: string, data: Partial<ICategory>): Observable<ICategory> {
    return this.http.patch<ICategory>(`${this.apiUrl}/blog/categories/${id}`, data);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/categories/${id}`);
  }

  getCategoriesCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/blog/categories/admin/count`);
  }

  // Tags
  getTags(): Observable<ITag[]> {
    return this.http.get<ITag[]>(`${this.apiUrl}/blog/tags`);
  }

  getTagById(id: string): Observable<ITag> {
    return this.http.get<ITag>(`${this.apiUrl}/blog/tags/${id}`);
  }

  getTagBySlug(slug: string): Observable<ITag> {
    return this.http.get<ITag>(`${this.apiUrl}/blog/tags/slug/${slug}`);
  }

  createTag(data: Omit<ITag, 'id' | 'createdAt' | 'updatedAt'>): Observable<ITag> {
    return this.http.post<ITag>(`${this.apiUrl}/blog/tags`, data);
  }

  updateTag(id: string, data: Partial<ITag>): Observable<ITag> {
    return this.http.patch<ITag>(`${this.apiUrl}/blog/tags/${id}`, data);
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/tags/${id}`);
  }

  getTagsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/blog/tags/admin/count`);
  }

  // Series
  getSeries(): Observable<ISeries[]> {
    return this.http.get<ISeries[]>(`${this.apiUrl}/blog/series`);
  }

  getSeriesById(id: string): Observable<ISeries> {
    return this.http.get<ISeries>(`${this.apiUrl}/blog/series/${id}`);
  }

  getSeriesBySlug(slug: string): Observable<ISeries> {
    return this.http.get<ISeries>(`${this.apiUrl}/blog/series/slug/${slug}`);
  }

  getSeriesBySlugWithPosts(slug: string): Observable<ISeries & { posts: IPost[] }> {
    return this.http.get<ISeries & { posts: IPost[] }>(`${this.apiUrl}/blog/series/slug/${slug}/posts`);
  }

  createSeries(data: Omit<ISeries, 'id' | 'createdAt' | 'updatedAt'>): Observable<ISeries> {
    return this.http.post<ISeries>(`${this.apiUrl}/blog/series`, data);
  }

  updateSeries(id: string, data: Partial<ISeries>): Observable<ISeries> {
    return this.http.patch<ISeries>(`${this.apiUrl}/blog/series/${id}`, data);
  }

  deleteSeries(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/series/${id}`);
  }

  getSeriesCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/blog/series/admin/count`);
  }
}
