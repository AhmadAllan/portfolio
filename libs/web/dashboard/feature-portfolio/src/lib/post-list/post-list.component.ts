import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BlogService, IPost, IPaginatedPosts, ICategory, ITag, ISeries } from '@portfolio/dashboard/data-access';

interface PostListFilter {
  status: 'all' | 'draft' | 'published' | 'archived';
  categoryId: string | null;
  tagId: string | null;
  seriesId: string | null;
  search: string;
  sortBy: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly DEFAULT_PAGE_SIZE = 10;

  // State
  posts = signal<IPost[]>([]);
  categories = signal<ICategory[]>([]);
  tags = signal<ITag[]>([]);
  series = signal<ISeries[]>([]);
  isLoading = signal(true);
  isDeleting = signal(false);

  // Pagination
  currentPage = signal(1);
  pageSize = this.DEFAULT_PAGE_SIZE;
  totalPosts = signal(0);
  totalPages = signal(0);

  // Filter state
  filter = signal<PostListFilter>({
    status: 'all',
    categoryId: null,
    tagId: null,
    seriesId: null,
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  async ngOnInit(): Promise<void> {
    await this.loadReferenceData();
    await this.loadPosts();
  }

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
      sortOrder: f.sortOrder
    };

    if (f.status !== 'all') {
      params.status = f.status;
    }

    if (f.categoryId) {
      params.categoryId = f.categoryId;
    }

    if (f.tagId) {
      params.tagId = f.tagId;
    }

    if (f.seriesId) {
      params.seriesId = f.seriesId;
    }

    if (f.search) {
      params.search = f.search;
    }

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

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Draft',
      published: 'Published',
      archived: 'Archived'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      draft: 'post-list__status--draft',
      published: 'post-list__status--published',
      archived: 'post-list__status--archived'
    };
    return classes[status] || '';
  }

  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getReadingTime(minutes: number | null): string {
    if (!minutes) return '-';
    return `${minutes} min`;
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const current = this.currentPage();
    const total = this.totalPages();

    // Always show first page
    if (total > 0) {
      pages.push(1);
    }

    // Show pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Always show last page
    if (total > 1 && !pages.includes(total)) {
      pages.push(total);
    }

    return pages;
  }
}
