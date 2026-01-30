import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IAbout {
  id: string;
  name: string;
  nameEn?: string;
  title: string;
  titleEn?: string;
  bio: string;
  bioEn?: string;
  avatar?: string;
  email: string;
  socialLinks: Array<{ platform: string; url: string; displayOrder: number }>;
  createdAt: string;
  updatedAt: string;
}

export interface IProject {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  thumbnail: string;
  techStack: string[];
  role?: string;
  roleEn?: string;
  duration?: string;
  durationEn?: string;
  teamSize?: number;
  challenges?: string;
  challengesEn?: string;
  liveUrl?: string;
  githubUrl?: string;
  gallery?: string[];
  status: string;
  displayOrder: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IExperience {
  id: string;
  company: string;
  companyEn?: string;
  title: string;
  titleEn?: string;
  location?: string;
  locationEn?: string;
  type: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  descriptionEn?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISkill {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  icon?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface IEducation {
  id: string;
  institution: string;
  institutionEn?: string;
  degree: string;
  degreeEn?: string;
  field?: string;
  fieldEn?: string;
  year: number;
  type: string;
  description?: string;
  descriptionEn?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  constructor(private readonly http: HttpClient) {}

  private readonly apiUrl = '/api';

  // About
  getAbout(): Observable<IAbout> {
    return this.http.get<IAbout>(`${this.apiUrl}/portfolio/about`);
  }

  updateAbout(id: string, data: Partial<IAbout>): Observable<IAbout> {
    return this.http.put<IAbout>(`${this.apiUrl}/portfolio/about/${id}`, data);
  }

  // Projects
  getProjects(): Observable<IProject[]> {
    return this.http.get<IProject[]>(`${this.apiUrl}/portfolio/projects`);
  }

  getFeaturedProjects(): Observable<IProject[]> {
    return this.http.get<IProject[]>(`${this.apiUrl}/portfolio/projects/featured`);
  }

  getProjectById(id: string): Observable<IProject> {
    return this.http.get<IProject>(`${this.apiUrl}/portfolio/projects/${id}`);
  }

  getProjectBySlug(slug: string): Observable<IProject> {
    return this.http.get<IProject>(`${this.apiUrl}/portfolio/projects/slug/${slug}`);
  }

  createProject(data: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Observable<IProject> {
    return this.http.post<IProject>(`${this.apiUrl}/portfolio/projects`, data);
  }

  updateProject(id: string, data: Partial<IProject>): Observable<IProject> {
    return this.http.put<IProject>(`${this.apiUrl}/portfolio/projects/${id}`, data);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/portfolio/projects/${id}`);
  }

  // Experiences
  getExperiences(): Observable<IExperience[]> {
    return this.http.get<IExperience[]>(`${this.apiUrl}/portfolio/experiences`);
  }

  getCurrentExperiences(): Observable<IExperience[]> {
    return this.http.get<IExperience[]>(`${this.apiUrl}/portfolio/experiences/current`);
  }

  getExperienceById(id: string): Observable<IExperience> {
    return this.http.get<IExperience>(`${this.apiUrl}/portfolio/experiences/${id}`);
  }

  createExperience(data: Omit<IExperience, 'id' | 'createdAt' | 'updatedAt'>): Observable<IExperience> {
    return this.http.post<IExperience>(`${this.apiUrl}/portfolio/experiences`, data);
  }

  updateExperience(id: string, data: Partial<IExperience>): Observable<IExperience> {
    return this.http.put<IExperience>(`${this.apiUrl}/portfolio/experiences/${id}`, data);
  }

  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/portfolio/experiences/${id}`);
  }

  // Skills
  getSkills(): Observable<ISkill[]> {
    return this.http.get<ISkill[]>(`${this.apiUrl}/portfolio/skills`);
  }

  getSkillsByCategory(category: string): Observable<ISkill[]> {
    return this.http.get<ISkill[]>(`${this.apiUrl}/portfolio/skills/category/${category}`);
  }

  getSkillById(id: string): Observable<ISkill> {
    return this.http.get<ISkill>(`${this.apiUrl}/portfolio/skills/${id}`);
  }

  createSkill(data: Omit<ISkill, 'id' | 'createdAt' | 'updatedAt'>): Observable<ISkill> {
    return this.http.post<ISkill>(`${this.apiUrl}/portfolio/skills`, data);
  }

  updateSkill(id: string, data: Partial<ISkill>): Observable<ISkill> {
    return this.http.put<ISkill>(`${this.apiUrl}/portfolio/skills/${id}`, data);
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/portfolio/skills/${id}`);
  }

  // Education
  getEducations(): Observable<IEducation[]> {
    return this.http.get<IEducation[]>(`${this.apiUrl}/portfolio/educations`);
  }

  getEducationById(id: string): Observable<IEducation> {
    return this.http.get<IEducation>(`${this.apiUrl}/portfolio/educations/${id}`);
  }

  createEducation(data: Omit<IEducation, 'id' | 'createdAt' | 'updatedAt'>): Observable<IEducation> {
    return this.http.post<IEducation>(`${this.apiUrl}/portfolio/educations`, data);
  }

  updateEducation(id: string, data: Partial<IEducation>): Observable<IEducation> {
    return this.http.put<IEducation>(`${this.apiUrl}/portfolio/educations/${id}`, data);
  }

  deleteEducation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/portfolio/educations/${id}`);
  }
}
