import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { eq, desc, asc, sql } from 'drizzle-orm';
import { db } from '@portfolio/api/core';
import { tags } from '@portfolio/api/core';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagService {
  /**
   * Create a new tag
   */
  async create(createTagDto: CreateTagDto) {
    // Check if slug already exists
    const existing = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, createTagDto.slug))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Tag with this slug already exists');
    }

    const [newTag] = await db
      .insert(tags)
      .values(createTagDto)
      .returning();

    return newTag;
  }

  /**
   * Find all tags
   */
  async findAll() {
    return db
      .select()
      .from(tags)
      .orderBy(asc(tags.name));
  }

  /**
   * Find one tag by ID
   */
  async findOne(id: string) {
    const [tag] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1);

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  /**
   * Find one tag by slug
   */
  async findBySlug(slug: string) {
    const [tag] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .limit(1);

    if (!tag) {
      throw new NotFoundException(`Tag with slug ${slug} not found`);
    }

    return tag;
  }

  /**
   * Update a tag
   */
  async update(id: string, updateTagDto: UpdateTagDto) {
    // Check if tag exists
    const existing = await this.findOne(id);

    // If slug is being updated, check if it's unique
    if (updateTagDto.slug && updateTagDto.slug !== existing.slug) {
      const slugExists = await db
        .select()
        .from(tags)
        .where(eq(tags.slug, updateTagDto.slug))
        .limit(1);

      if (slugExists.length > 0) {
        throw new ConflictException('Tag with this slug already exists');
      }
    }

    await db.update(tags).set(updateTagDto).where(eq(tags.id, id));

    return this.findOne(id);
  }

  /**
   * Delete a tag
   */
  async remove(id: string) {
    await db.delete(tags).where(eq(tags.id, id));
    return { id };
  }

  /**
   * Get tag count
   */
  async count() {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(tags);
    return result.count;
  }
}
