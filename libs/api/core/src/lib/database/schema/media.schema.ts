import { pgTable, varchar, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

// Media folders table
export const mediaFolders = pgTable('media_folders', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  name: varchar('name', { length: 255 }).notNull(),
  parentId: varchar('parent_id', { length: 26 }).references((): any => mediaFolders.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  parentIdx: index('folders_parent_idx').on(table.parentId),
}));

// Media file type enum
export const mediaFileTypeEnum = ['image', 'video', 'document', 'other'] as const;
export type MediaFileType = typeof mediaFileTypeEnum[number];

// Media files table
export const mediaFiles = pgTable('media_files', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileType: varchar('file_type', { length: 20 }).notNull(),
  size: integer('size').notNull(), // in bytes
  path: varchar('path', { length: 500 }).notNull(),
  thumbnailPath: varchar('thumbnail_path', { length: 500 }),
  width: integer('width'),
  height: integer('height'),
  altText: varchar('alt_text', { length: 500 }),
  altTextEn: varchar('alt_text_en', { length: 500 }),
  caption: varchar('caption', { length: 500 }),
  captionEn: varchar('caption_en', { length: 500 }),
  folderId: varchar('folder_id', { length: 26 }).references(() => mediaFolders.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  folderIdx: index('files_folder_idx').on(table.folderId),
  typeIdx: index('files_type_idx').on(table.fileType),
}));
