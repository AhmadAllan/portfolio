import { pgTable, varchar, timestamp, text, integer, boolean, index, primaryKey } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { users } from './user.schema';

// Post statuses enum
export const postStatusEnum = ['draft', 'published', 'archived'] as const;
export type PostStatus = typeof postStatusEnum[number];

// Posts table
export const posts = pgTable('blog_posts', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  excerpt: text('excerpt').notNull(),
  excerptEn: text('excerpt_en'),
  content: text('content').notNull(),
  contentEn: text('content_en'),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  featuredImage: varchar('featured_image', { length: 500 }),
  readingTime: integer('reading_time').notNull().default(0),
  seriesId: varchar('series_id', { length: 26 }).references(() => series.id, { onDelete: 'set null' }),
  seriesOrder: integer('series_order'),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaTitleEn: varchar('meta_title_en', { length: 255 }),
  metaDescription: text('meta_description'),
  metaDescriptionEn: text('meta_description_en'),
  ogImage: varchar('og_image', { length: 500 }),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  slugIdx: index('posts_slug_idx').on(table.slug),
  statusIdx: index('posts_status_idx').on(table.status),
  publishedAtIdx: index('posts_published_at_idx').on(table.publishedAt),
}));

// Categories table
export const categories = pgTable('blog_categories', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  description: text('description'),
  descriptionEn: text('description_en'),
  parentId: varchar('parent_id', { length: 26 }).references((): any => categories.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  slugIdx: index('categories_slug_idx').on(table.slug),
}));

// Tags table
export const tags = pgTable('blog_tags', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  slugIdx: index('tags_slug_idx').on(table.slug),
}));

// Series table
export const series = pgTable('blog_series', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  description: text('description'),
  descriptionEn: text('description_en'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  slugIdx: index('series_slug_idx').on(table.slug),
}));

// Post-Category junction table (many-to-many)
export const postCategories = pgTable('post_categories', {
  postId: varchar('post_id', { length: 26 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  categoryId: varchar('category_id', { length: 26 }).notNull().references(() => categories.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.categoryId] }),
}));

// Post-Tag junction table (many-to-many)
export const postTags = pgTable('post_tags', {
  postId: varchar('post_id', { length: 26 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId: varchar('tag_id', { length: 26 }).notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}));

// Post-Related junction table (many-to-many)
export const postRelated = pgTable('post_related', {
  postId: varchar('post_id', { length: 26 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  relatedPostId: varchar('related_post_id', { length: 26 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.relatedPostId] }),
}));

// Comment statuses enum
export const commentStatusEnum = ['pending', 'approved', 'spam', 'deleted'] as const;
export type CommentStatus = typeof commentStatusEnum[number];

// Comments table
export const comments = pgTable('blog_comments', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  postId: varchar('post_id', { length: 26 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  parentId: varchar('parent_id', { length: 26 }).references((): any => comments.id, { onDelete: 'cascade' }),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorEmail: varchar('author_email', { length: 255 }).notNull(),
  authorWebsite: varchar('author_website', { length: 500 }),
  content: text('content').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  postIdIdx: index('comments_post_id_idx').on(table.postId),
  statusIdx: index('comments_status_idx').on(table.status),
  emailIdx: index('comments_email_idx').on(table.authorEmail),
}));
