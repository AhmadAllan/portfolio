import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ENVIRONMENT, Environment } from '@portfolio/web-shared';
import type {
  IAbout,
  IEducation,
  IExperience,
  IProject,
  ISkill,
  IJSendSuccess,
} from '@portfolio/shared-types';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private env: Environment
  ) {
    // Build portfolio API URL from base API URL
    const baseUrl = this.env.apiUrl.replace(/\/api\/v\d+$/, '');
    this.apiUrl = `${baseUrl}/api/portfolio`;
  }

  // About
  getAbout(): Observable<IJSendSuccess<IAbout>> {
    return this.http.get<IJSendSuccess<IAbout>>(`${this.apiUrl}/about`);
  }

  // Projects
  getProjects(): Observable<IJSendSuccess<IProject[]>> {
    return this.http.get<IJSendSuccess<IProject[]>>(`${this.apiUrl}/projects`);
  }

  getProject(id: string): Observable<IJSendSuccess<IProject>> {
    return this.http.get<IJSendSuccess<IProject>>(`${this.apiUrl}/projects/${id}`);
  }

  // Experience
  getExperience(): Observable<IJSendSuccess<IExperience[]>> {
    return this.http.get<IJSendSuccess<IExperience[]>>(`${this.apiUrl}/experience`);
  }

  // Skills
  getSkills(): Observable<IJSendSuccess<ISkill[]>> {
    return this.http.get<IJSendSuccess<ISkill[]>>(`${this.apiUrl}/skills`);
  }

  // Education
  getEducation(): Observable<IJSendSuccess<IEducation[]>> {
    return this.http.get<IJSendSuccess<IEducation[]>>(`${this.apiUrl}/education`);
  }

  // Contact info (if stored in about)
  getContactInfo(): Observable<{
    email?: string;
    phone?: string;
    location?: string;
    socialLinks?: IAbout['socialLinks'];
  }> {
    return this.http.get<IJSendSuccess<IAbout>>(`${this.apiUrl}/about`).pipe(
      map((response) => ({
        email: response.data.email,
        phone: response.data.phone,
        location: response.data.location,
        socialLinks: response.data.socialLinks,
      }))
    );
  }
}
