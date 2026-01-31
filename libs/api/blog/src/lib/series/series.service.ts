import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { eq, desc, asc, sql } from 'drizzle-orm';
import { db } from '@portfolio/api/core';
import { series, posts } from '@portfolio/api/core';
import { CreateSeriesDto, UpdateSeriesDto } from './dto';

@Injectable()
export class SeriesService {
  /**
   * Create a new series
   */
  async create(createSeriesDto: CreateSeriesDto) {
    // Check if slug already exists
    const existing = await db
      .select()
      .from(series)
      .where(eq(series.slug, createSeriesDto.slug))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Series with this slug already exists');
    }

    const [newSeries] = await db
      .insert(series)
      .values(createSeriesDto)
      .returning();

    return newSeries;
  }

  /**
   * Find all series
   */
  async findAll() {
    return db
      .select()
      .from(series)
      .orderBy(asc(series.title));
  }

  /**
   * Find one series by ID
   */
  async findOne(id: string) {
    const [seriesData] = await db
      .select()
      .from(series)
      .where(eq(series.id, id))
      .limit(1);

    if (!seriesData) {
      throw new NotFoundException(`Series with ID ${id} not found`);
    }

    return seriesData;
  }

  /**
   * Find one series by slug
   */
  async findBySlug(slug: string) {
    const [seriesData] = await db
      .select()
      .from(series)
      .where(eq(series.slug, slug))
      .limit(1);

    if (!seriesData) {
      throw new NotFoundException(`Series with slug ${slug} not found`);
    }

    return seriesData;
  }

  /**
   * Find one series by slug with posts
   */
  async findBySlugWithPosts(slug: string) {
    const [seriesData] = await db
      .select()
      .from(series)
      .where(eq(series.slug, slug))
      .limit(1);

    if (!seriesData) {
      throw new NotFoundException(`Series with slug ${slug} not found`);
    }

    // Get posts in this series
    const seriesPosts = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        titleEn: posts.titleEn,
        excerpt: posts.excerpt,
        excerptEn: posts.excerptEn,
        featuredImage: posts.featuredImage,
        readingTime: posts.readingTime,
        seriesOrder: posts.seriesOrder,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(eq(posts.seriesId, seriesData.id))
      .where(eq(posts.status, 'published'))
      .orderBy(asc(posts.seriesOrder));

    return {
      ...seriesData,
      posts: seriesPosts,
    };
  }

  /**
   * Update a series
   */
  async update(id: string, updateSeriesDto: UpdateSeriesDto) {
    // Check if series exists
    const existing = await this.findOne(id);

    // If slug is being updated, check if it's unique
    if (updateSeriesDto.slug && updateSeriesDto.slug !== existing.slug) {
      const slugExists = await db
        .select()
        .from(series)
        .where(eq(series.slug, updateSeriesDto.slug))
        .limit(1);

      if (slugExists.length > 0) {
        throw new ConflictException('Series with this slug already exists');
      }
    }

    await db.update(series).set(updateSeriesDto).where(eq(series.id, id));

    return this.findOne(id);
  }

  /**
   * Delete a series
   */
  async remove(id: string) {
    await db.delete(series).where(eq(series.id, id));
    return { id };
  }

  /**
   * Get series count
   */
  async count() {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(series);
    return result.count;
  }
}
