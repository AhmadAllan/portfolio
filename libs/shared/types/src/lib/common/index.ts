export * from './user.interface';

// JSend response types
export interface IJSendSuccess<T = unknown> {
  status: 'success';
  data: T;
}

export interface IJSendFail {
  status: 'fail';
  data: Record<string, string>;
}

export interface IJSendError<T = Record<string, unknown>> {
  status: 'error';
  message: string;
  code?: string;
  data?: T;
}

export type IJSendResponse<T = unknown> = IJSendSuccess<T> | IJSendFail | IJSendError;

// Pagination
export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  items: T[];
  meta: IPaginationMeta;
}

// Common enums
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SPAM = 'spam',
  DELETED = 'deleted',
}

export enum NoteMaturity {
  SEEDLING = 'seedling',
  BUDDING = 'budding',
  EVERGREEN = 'evergreen',
}

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export enum SkillCategory {
  LANGUAGES = 'languages',
  FRAMEWORKS = 'frameworks',
  TOOLS = 'tools',
  DATABASES = 'databases',
  CLOUD = 'cloud',
  OTHER = 'other',
}

export enum MediaFileType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  OTHER = 'other',
}
