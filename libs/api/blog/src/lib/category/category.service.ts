import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { eq, desc, asc, sql } from 'drizzle-orm';
import { db } from '@portfolio/api/core';
import { categories } from '@portfolio/api/core';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  /**
   * Create a new category
   */
  async create(createCategoryDto: CreateCategoryDto) {
    // Check if slug already exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, createCategoryDto.slug))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Category with this slug already exists');
    }

    // If parentId is provided, check if parent exists
    if (createCategoryDto.parentId) {
      const [parent] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, createCategoryDto.parentId))
        .limit(1);

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const [newCategory] = await db
      .insert(categories)
      .values(createCategoryDto)
      .returning();

    return newCategory;
  }

  /**
   * Find all categories
   */
  async findAll() {
    return db
      .select()
      .from(categories)
      .orderBy(asc(categories.name));
  }

  /**
   * Find one category by ID
   */
  async findOne(id: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Find one category by slug
   */
  async findBySlug(slug: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  /**
   * Find all root categories (no parent)
   */
  async findRootCategories() {
    return db
      .select()
      .from(categories)
      .where(eq(categories.parentId, null))
      .orderBy(asc(categories.name));
  }

  /**
   * Find child categories of a parent
   */
  async findChildCategories(parentId: string) {
    // Check if parent exists
    await this.findOne(parentId);

    return db
      .select()
      .from(categories)
      .where(eq(categories.parentId, parentId))
      .orderBy(asc(categories.name));
  }

  /**
   * Update a category
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Check if category exists
    const existing = await this.findOne(id);

    // If slug is being updated, check if it's unique
    if (updateCategoryDto.slug && updateCategoryDto.slug !== existing.slug) {
      const slugExists = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, updateCategoryDto.slug))
        .limit(1);

      if (slugExists.length > 0) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // If parentId is being updated, check if parent exists
    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId) {
        // Prevent circular reference
        if (updateCategoryDto.parentId === id) {
          throw new ConflictException('Category cannot be its own parent');
        }

        const [parent] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, updateCategoryDto.parentId))
          .limit(1);

        if (!parent) {
          throw new NotFoundException('Parent category not found');
        }
      }
    }

    await db.update(categories).set(updateCategoryDto).where(eq(categories.id, id));

    return this.findOne(id);
  }

  /**
   * Delete a category
   */
  async remove(id: string) {
    await db.delete(categories).where(eq(categories.id, id));
    return { id };
  }

  /**
   * Get category count
   */
  async count() {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(categories);
    return result.count;
  }
}
