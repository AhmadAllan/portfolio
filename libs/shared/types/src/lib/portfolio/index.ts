import { ProjectStatus, EmploymentType, SkillCategory } from '../common';

export interface IProject {
  id: string;
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
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExperience {
  id: string;
  company: string;
  companyEn?: string;
  title: string;
  titleEn?: string;
  location?: string;
  locationEn?: string;
  type: EmploymentType;
  description: string;
  descriptionEn?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkill {
  id: string;
  name: string;
  nameEn?: string;
  category: SkillCategory;
  proficiency: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEducation {
  id: string;
  institution: string;
  institutionEn?: string;
  degree: string;
  degreeEn?: string;
  field?: string;
  fieldEn?: string;
  description?: string;
  descriptionEn?: string;
  startDate: Date;
  endDate?: Date;
  isCertification: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface IAbout {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}
