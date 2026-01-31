import { pgTable, varchar, timestamp, text, boolean, index, primaryKey } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

// Note maturity levels enum
export const noteMaturityEnum = ['seedling', 'budding', 'evergreen'] as const;
export type NoteMaturity = typeof noteMaturityEnum[number];

// Notes table
export const notes = pgTable('garden_notes', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  content: text('content').notNull(),
  contentEn: text('content_en'),
  maturity: varchar('maturity', { length: 20 }).notNull().default('seedling'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  slugIdx: index('notes_slug_idx').on(table.slug),
  maturityIdx: index('notes_maturity_idx').on(table.maturity),
}));

// Note-Tag junction table (many-to-many) - reuses blog tags
export const noteTags = pgTable('note_tags', {
  noteId: varchar('note_id', { length: 26 }).notNull().references(() => notes.id, { onDelete: 'cascade' }),
  tagId: varchar('tag_id', { length: 26 }).notNull(),  // References blog_tags
}, (table) => ({
  pk: primaryKey({ columns: [table.noteId, table.tagId] }),
}));

// Note links table - tracks wiki-link connections
export const noteLinks = pgTable('garden_note_links', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  sourceNoteId: varchar('source_note_id', { length: 26 }).notNull().references(() => notes.id, { onDelete: 'cascade' }),
  targetSlug: varchar('target_slug', { length: 255 }).notNull(),
  targetNoteId: varchar('target_note_id', { length: 26 }).references(() => notes.id, { onDelete: 'cascade' }),
  isBroken: boolean('is_broken').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  sourceIdx: index('note_links_source_idx').on(table.sourceNoteId),
  targetSlugIdx: index('note_links_target_slug_idx').on(table.targetSlug),
  targetNoteIdx: index('note_links_target_note_idx').on(table.targetNoteId),
  brokenIdx: index('note_links_broken_idx').on(table.isBroken),
}));
