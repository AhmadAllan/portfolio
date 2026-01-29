import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { IJSendSuccess } from '@portfolio/shared-types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Check auth status on service initialization
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus();
    } else {
      this.isLoadingSubject.next(false);
    }
  }

  login(credentials: LoginCredentials): Observable<AuthUser> {
    return this.http
      .post<IJSendSuccess<AuthResponse>>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.data.user),
        tap((user) => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError((error) => {
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          throw error;
        })
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<IJSendSuccess<{ message: string }>>(`${this.apiUrl}/logout`, {}, {
        withCredentials: true,
      })
      .pipe(
        map(() => void 0),
        tap(() => {
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/dashboard/login']);
        }),
        catchError(() => {
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          return of(void 0);
        })
      );
  }

  refreshToken(): Observable<boolean> {
    return this.http
      .post<IJSendSuccess<{ message: string }>>(`${this.apiUrl}/refresh`, {}, {
        withCredentials: true,
      })
      .pipe(
        map(() => true),
        catchError(() => {
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          return of(false);
        })
      );
  }

  checkAuthStatus(): void {
    this.isLoadingSubject.next(true);
    this.http
      .post<IJSendSuccess<AuthResponse>>(`${this.apiUrl}/me`, {}, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.currentUserSubject.next(response.data.user);
          this.isAuthenticatedSubject.next(true);
          this.isLoadingSubject.next(false);
        }),
        catchError(() => {
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          this.isLoadingSubject.next(false);
          return of(null);
        })
      )
      .subscribe();
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
