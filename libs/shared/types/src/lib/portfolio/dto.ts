import type {
  IAbout,
  IEducation,
  IExperience,
  IProject,
  ISkill,
  ISocialLink,
} from './index';
import type { EmploymentType, ProjectStatus, SkillCategory } from '../common';

// Helper type for updates - makes all fields optional except id, createdAt, updatedAt
export type UpdateDto<T> = Partial<
  Omit<T, 'id' | 'createdAt' | 'updatedAt'>
>;

// Helper type for creates - removes id, createdAt, updatedAt
export type CreateDto<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// About DTOs
// ============================================

export interface CreateAboutDto {
  name: string;
  title: string;
  titleEn?: string;
  bio: string;
  bioEn?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  location?: string;
  locationEn?: string;
  socialLinks?: ISocialLink[];
  cvUrl?: string;
}

export interface UpdateAboutDto {
  name?: string;
  title?: string;
  titleEn?: string;
  bio?: string;
  bioEn?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  location?: string;
  locationEn?: string;
  socialLinks?: ISocialLink[];
  cvUrl?: string;
}

// ============================================
// Project DTOs
// ============================================

export interface CreateProjectDto {
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  thumbnail?: string;
  techStack: string[];
  role?: string;
  roleEn?: string;
  gallery?: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: ProjectStatus;
  order: number;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface UpdateProjectDto {
  slug?: string;
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  thumbnail?: string;
  techStack?: string[];
  role?: string;
  roleEn?: string;
  gallery?: string[];
  liveUrl?: string;
  githubUrl?: string;
  status?: ProjectStatus;
  order?: number;
  startDate?: Date | string;
  endDate?: Date | string;
}

// ============================================
// Experience DTOs
// ============================================

export interface CreateExperienceDto {
  company: string;
  companyEn?: string;
  title: string;
  titleEn?: string;
  location?: string;
  locationEn?: string;
  type: EmploymentType;
  description: string;
  descriptionEn?: string;
  startDate: Date | string;
  endDate?: Date | string;
  isCurrent: boolean;
  order: number;
}

export interface UpdateExperienceDto {
  company?: string;
  companyEn?: string;
  title?: string;
  titleEn?: string;
  location?: string;
  locationEn?: string;
  type?: EmploymentType;
  description?: string;
  descriptionEn?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  isCurrent?: boolean;
  order?: number;
}

// ============================================
// Education DTOs
// ============================================

export interface CreateEducationDto {
  institution: string;
  institutionEn?: string;
  degree: string;
  degreeEn?: string;
  field?: string;
  fieldEn?: string;
  description?: string;
  descriptionEn?: string;
  startDate: Date | string;
  endDate?: Date | string;
  isCertification: boolean;
  order: number;
}

export interface UpdateEducationDto {
  institution?: string;
  institutionEn?: string;
  degree?: string;
  degreeEn?: string;
  field?: string;
  fieldEn?: string;
  description?: string;
  descriptionEn?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  isCertification?: boolean;
  order?: number;
}

// ============================================
// Skill DTOs
// ============================================

export interface CreateSkillDto {
  name: string;
  nameEn?: string;
  category: SkillCategory;
  proficiency: number;
  order: number;
}

export interface UpdateSkillDto {
  name?: string;
  nameEn?: string;
  category?: SkillCategory;
  proficiency?: number;
  order?: number;
}
