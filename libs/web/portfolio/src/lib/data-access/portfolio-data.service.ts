import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private apiUrl = 'http://localhost:3000/api/portfolio';

  constructor(private http: HttpClient) {}

  // About
  getAbout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/about`);
  }

  // Projects
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }

  getProject(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${id}`);
  }

  // Experience
  getExperience(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/experience`);
  }

  // Skills
  getSkills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/skills`);
  }

  // Education
  getEducation(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/education`);
  }

  // Contact info (if stored in about)
  getContactInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/about`).pipe(
      map((about: any) => ({
        email: about.email,
        phone: about.phone,
        location: about.location,
        socialLinks: about.socialLinks
      }))
    );
  }
}
