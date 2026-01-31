import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { eq, and, desc, asc, sql, like, or } from 'drizzle-orm';
import { db } from '@portfolio/api/core';
import { posts, postCategories, postTags, postRelated, categories, tags } from '@portfolio/api/core';
import { CreatePostDto, UpdatePostDto, ListPostsDto } from './dto';
import { postStatusEnum } from '@portfolio/api/core';

@Injectable()
export class PostService {
  private readonly WORDS_PER_MINUTE = 200;

  /**
   * Calculate reading time based on content length
   * Average reading speed: 200 words per minute
   */
  private calculateReadingTime(content: string): number {
    if (!content) return 0;
    // Strip markdown syntax and count words
    const plainText = content
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*.*?\*\*/g, '') // Remove bold
      .replace(/\*.*?\*/g, '') // Remove italic
      .replace(/`.*?`/g, '') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/> /g, '') // Remove blockquotes
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim();

    const words = plainText.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(words / this.WORDS_PER_MINUTE);
  }

  /**
   * Create a new post
   */
  async create(createPostDto: CreatePostDto) {
    // Check if slug already exists
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, createPostDto.slug))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Post with this slug already exists');
    }

    // Calculate reading time
    const readingTime = this.calculateReadingTime(createPostDto.content);

    // Insert post
    const [newPost] = await db
      .insert(posts)
      .values({
        ...createPostDto,
        readingTime,
        publishedAt: createPostDto.status === 'published' ? new Date() : null,
      })
      .returning();

    // Handle categories
    if (createPostDto.categoryIds && createPostDto.categoryIds.length > 0) {
      await db.insert(postCategories).values(
        createPostDto.categoryIds.map(categoryId => ({
          postId: newPost.id,
          categoryId,
        }))
      );
    }

    // Handle tags
    if (createPostDto.tagIds && createPostDto.tagIds.length > 0) {
      await db.insert(postTags).values(
        createPostDto.tagIds.map(tagId => ({
          postId: newPost.id,
          tagId,
        }))
      );
    }

    // Handle related posts
    if (createPostDto.relatedPostIds && createPostDto.relatedPostIds.length > 0) {
      await db.insert(postRelated).values(
        createPostDto.relatedPostIds.map((relatedPostId, index) => ({
          postId: newPost.id,
          relatedPostId,
          order: index,
        }))
      );
    }

    return this.findOne(newPost.id);
  }

  /**
   * Find all posts with filtering and pagination
   */
  async findAll(listPostsDto: ListPostsDto) {
    const {
      status,
      categoryId,
      tagId,
      seriesId,
      search,
      page = 1,
      limit = 10,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
    } = listPostsDto;

    const offset = (page - 1) * limit;

    // Build conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(posts.status, status));
    }

    if (seriesId) {
      conditions.push(eq(posts.seriesId, seriesId));
    }

    if (search) {
      conditions.push(
        or(
          like(posts.title, `%${search}%`),
          like(posts.titleEn, `%${search}%`),
          like(posts.excerpt, `%${search}%`),
          like(posts.excerptEn, `%${search}%`),
          like(posts.content, `%${search}%`),
          like(posts.contentEn, `%${search}%`)
        )
      );
    }

    // Build query
    let query = db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        titleEn: posts.titleEn,
        excerpt: posts.excerpt,
        excerptEn: posts.excerptEn,
        status: posts.status,
        featuredImage: posts.featuredImage,
        readingTime: posts.readingTime,
        seriesId: posts.seriesId,
        seriesOrder: posts.seriesOrder,
        metaTitle: posts.metaTitle,
        metaTitleEn: posts.metaTitleEn,
        metaDescription: posts.metaDescription,
        metaDescriptionEn: posts.metaDescriptionEn,
        ogImage: posts.ogImage,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts);

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sortBy === 'createdAt' ? posts.createdAt : posts.publishedAt;
    const sortDirection = sortOrder === 'asc' ? asc : desc;
    query = query.orderBy(sortDirection(sortColumn));

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const postsList = await query;

    // If filtering by category or tag, we need to join
    if (categoryId || tagId) {
      let filteredPosts = postsList;

      if (categoryId) {
        const categoryPosts = await db
          .select({ postId: postCategories.postId })
          .from(postCategories)
          .where(eq(postCategories.categoryId, categoryId));
        const categoryPostIds = new Set(categoryPosts.map(p => p.postId));
        filteredPosts = filteredPosts.filter(p => categoryPostIds.has(p.id));
      }

      if (tagId) {
        const tagPosts = await db
          .select({ postId: postTags.postId })
          .from(postTags)
          .where(eq(postTags.tagId, tagId));
        const tagPostIds = new Set(tagPosts.map(p => p.postId));
        filteredPosts = filteredPosts.filter(p => tagPostIds.has(p.id));
      }

      return filteredPosts;
    }

    return postsList;
  }

  /**
   * Find one post by ID with relations
   */
  async findOne(id: string) {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Get categories
    const postCategoriesList = await db
      .select({
        categoryId: postCategories.categoryId,
        id: categories.id,
        slug: categories.slug,
        name: categories.name,
        nameEn: categories.nameEn,
      })
      .from(postCategories)
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, id));

    // Get tags
    const postTagsList = await db
      .select({
        tagId: postTags.tagId,
        id: tags.id,
        slug: tags.slug,
        name: tags.name,
        nameEn: tags.nameEn,
      })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, id));

    // Get related posts
    const relatedPostsList = await db
      .select({
        relatedPostId: postRelated.relatedPostId,
        order: postRelated.order,
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        titleEn: posts.titleEn,
        featuredImage: posts.featuredImage,
        publishedAt: posts.publishedAt,
      })
      .from(postRelated)
      .innerJoin(posts, eq(postRelated.relatedPostId, posts.id))
      .where(eq(postRelated.postId, id))
      .orderBy(asc(postRelated.order));

    return {
      ...post,
      categories: postCategoriesList,
      tags: postTagsList,
      relatedPosts: relatedPostsList,
    };
  }

  /**
   * Find one post by slug
   */
  async findBySlug(slug: string) {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    return this.findOne(post.id);
  }

  /**
   * Update a post
   */
  async update(id: string, updatePostDto: UpdatePostDto) {
    // Check if post exists
    const existing = await this.findOne(id);

    // If slug is being updated, check if it's unique
    if (updatePostDto.slug && updatePostDto.slug !== existing.slug) {
      const slugExists = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, updatePostDto.slug))
        .limit(1);

      if (slugExists.length > 0) {
        throw new ConflictException('Post with this slug already exists');
      }
    }

    // Calculate reading time if content is updated
    let readingTime = existing.readingTime;
    if (updatePostDto.content) {
      readingTime = this.calculateReadingTime(updatePostDto.content);
    }

    // Handle status transitions
    const updates: UpdatePostDto & { readingTime?: number; publishedAt?: Date | null } = {
      ...updatePostDto,
      readingTime
    };

    // Set publishedAt when transitioning to published
    if (updatePostDto.status === 'published' && existing.status !== 'published') {
      updates.publishedAt = new Date();
    }

    // Clear publishedAt when transitioning away from published
    if (updatePostDto.status && updatePostDto.status !== 'published') {
      updates.publishedAt = null;
    }

    // Update post
    await db.update(posts).set(updates).where(eq(posts.id, id));

    // Handle categories update
    if (updatePostDto.categoryIds !== undefined) {
      // Delete existing categories
      await db.delete(postCategories).where(eq(postCategories.postId, id));

      // Add new categories
      if (updatePostDto.categoryIds.length > 0) {
        await db.insert(postCategories).values(
          updatePostDto.categoryIds.map(categoryId => ({
            postId: id,
            categoryId,
          }))
        );
      }
    }

    // Handle tags update
    if (updatePostDto.tagIds !== undefined) {
      // Delete existing tags
      await db.delete(postTags).where(eq(postTags.postId, id));

      // Add new tags
      if (updatePostDto.tagIds.length > 0) {
        await db.insert(postTags).values(
          updatePostDto.tagIds.map(tagId => ({
            postId: id,
            tagId,
          }))
        );
      }
    }

    // Handle related posts update
    if (updatePostDto.relatedPostIds !== undefined) {
      // Delete existing related posts
      await db.delete(postRelated).where(eq(postRelated.postId, id));

      // Add new related posts
      if (updatePostDto.relatedPostIds.length > 0) {
        await db.insert(postRelated).values(
          updatePostDto.relatedPostIds.map((relatedPostId, index) => ({
            postId: id,
            relatedPostId,
            order: index,
          }))
        );
      }
    }

    return this.findOne(id);
  }

  /**
   * Delete a post
   */
  async remove(id: string) {
    await db.delete(posts).where(eq(posts.id, id));
    return { id };
  }

  /**
   * Get post count
   */
  async count(listPostsDto: ListPostsDto) {
    const { status, seriesId, search } = listPostsDto;

    const conditions = [];

    if (status) {
      conditions.push(eq(posts.status, status));
    }

    if (seriesId) {
      conditions.push(eq(posts.seriesId, seriesId));
    }

    if (search) {
      conditions.push(
        or(
          like(posts.title, `%${search}%`),
          like(posts.titleEn, `%${search}%`),
          like(posts.excerpt, `%${search}%`),
          like(posts.excerptEn, `%${search}%`),
          like(posts.content, `%${search}%`),
          like(posts.contentEn, `%${search}%`)
        )
      );
    }

    let query = db.select({ count: sql<number>`count(*)::int` }).from(posts);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const [result] = await query;
    return result.count;
  }
}
