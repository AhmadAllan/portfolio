import { pgTable, varchar, timestamp, text, integer, boolean, index } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

// Project status enum
export const projectStatusEnum = ['active', 'completed', 'archived'] as const;
export type ProjectStatus = typeof projectStatusEnum[number];

// Projects table
export const projects = pgTable('portfolio_projects', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  description: text('description').notNull(),
  descriptionEn: text('description_en'),
  thumbnail: varchar('thumbnail', { length: 500 }),
  techStack: text('tech_stack').notNull(), // JSON array as text
  role: varchar('role', { length: 255 }),
  roleEn: varchar('role_en', { length: 255 }),
  gallery: text('gallery'), // JSON array as text
  liveUrl: varchar('live_url', { length: 500 }),
  githubUrl: varchar('github_url', { length: 500 }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  order: integer('order').notNull().default(0),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  slugIdx: index('projects_slug_idx').on(table.slug),
  statusIdx: index('projects_status_idx').on(table.status),
  orderIdx: index('projects_order_idx').on(table.order),
}));

// Employment type enum
export const employmentTypeEnum = ['full-time', 'part-time', 'contract', 'freelance', 'internship'] as const;
export type EmploymentType = typeof employmentTypeEnum[number];

// Experience table
export const experiences = pgTable('portfolio_experiences', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  company: varchar('company', { length: 255 }).notNull(),
  companyEn: varchar('company_en', { length: 255 }),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  location: varchar('location', { length: 255 }),
  locationEn: varchar('location_en', { length: 255 }),
  type: varchar('type', { length: 50 }).notNull(),
  description: text('description').notNull(),
  descriptionEn: text('description_en'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  isCurrent: boolean('is_current').notNull().default(false),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  orderIdx: index('experiences_order_idx').on(table.order),
  currentIdx: index('experiences_current_idx').on(table.isCurrent),
}));

// Skill category enum
export const skillCategoryEnum = ['languages', 'frameworks', 'tools', 'databases', 'cloud', 'other'] as const;
export type SkillCategory = typeof skillCategoryEnum[number];

// Skills table
export const skills = pgTable('portfolio_skills', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  category: varchar('category', { length: 50 }).notNull(),
  proficiency: integer('proficiency').notNull().default(50), // 0-100
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  categoryIdx: index('skills_category_idx').on(table.category),
  orderIdx: index('skills_order_idx').on(table.order),
}));

// Education table
export const educations = pgTable('portfolio_educations', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  institution: varchar('institution', { length: 255 }).notNull(),
  institutionEn: varchar('institution_en', { length: 255 }),
  degree: varchar('degree', { length: 255 }).notNull(),
  degreeEn: varchar('degree_en', { length: 255 }),
  field: varchar('field', { length: 255 }),
  fieldEn: varchar('field_en', { length: 255 }),
  description: text('description'),
  descriptionEn: text('description_en'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  isCertification: boolean('is_certification').notNull().default(false),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  orderIdx: index('educations_order_idx').on(table.order),
}));

// About table (singleton)
export const about = pgTable('portfolio_about', {
  id: varchar('id', { length: 26 }).primaryKey().$defaultFn(() => ulid()),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  bio: text('bio').notNull(),
  bioEn: text('bio_en'),
  avatar: varchar('avatar', { length: 500 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  location: varchar('location', { length: 255 }),
  locationEn: varchar('location_en', { length: 255 }),
  socialLinks: text('social_links'), // JSON object as text
  cvUrl: varchar('cv_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});
