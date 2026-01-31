import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { IJSendSuccess } from '@portfolio/shared-types';
import { ENVIRONMENT, Environment } from '../config/environment.token';

/**
 * Authenticated user information
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Login credentials
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication API response
 */
interface AuthResponse {
  user: AuthUser;
}

/**
 * Frontend authentication service managing user authentication state
 *
 * Features:
 * - JWT authentication with HttpOnly cookies
 * - Reactive state management with RxJS
 * - Automatic authentication check on initialization
 * - Token refresh mechanism
 * - SSR-compatible (checks platform before browser operations)
 *
 * The service maintains three observables:
 * - currentUser$: Current authenticated user
 * - isAuthenticated$: Boolean authentication status
 * - isLoading$: Loading state during auth checks
 *
 * @example
 * // Login
 * authService.login({ email, password }).subscribe(user => {
 *   console.log('Logged in:', user);
 * });
 *
 * @example
 * // Check auth status
 * authService.isAuthenticated$.subscribe(isAuth => {
 *   if (isAuth) {
 *     // User is authenticated
 *   }
 * });
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string;
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(ENVIRONMENT) private env: Environment
  ) {
    this.apiUrl = `${this.env.apiUrl}/auth`;
    // Check auth status on service initialization
    if (isPlatformBrowser(this.platformId)) {
      // Subscribe to check auth status
      // Note: This subscription lives for the application lifetime (service is singleton)
      // so we don't need to unsubscribe
      this.checkAuthStatus().subscribe();
    } else {
      this.isLoadingSubject.next(false);
    }
  }

  /**
   * Authenticate user with email and password
   *
   * Stores authentication tokens in HttpOnly cookies and updates auth state
   *
   * @param credentials - User credentials (email and password)
   * @returns Observable of authenticated user
   */
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

  /**
   * Logout current user
   *
   * Invalidates tokens, clears auth state, and redirects to login page
   *
   * @returns Observable that completes when logout is finished
   */
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

  /**
   * Refresh the access token using the refresh token cookie
   *
   * @returns Observable of boolean indicating success
   */
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

  /**
   * Check authentication status by validating the refresh token
   * Returns an Observable that completes after checking
   * Automatically updates the auth state (currentUser$, isAuthenticated$)
   *
   * @returns Observable that emits the AuthResponse or null if not authenticated
   */
  checkAuthStatus(): Observable<AuthResponse | null> {
    this.isLoadingSubject.next(true);
    return this.http
      .post<IJSendSuccess<AuthResponse>>(`${this.apiUrl}/me`, {}, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.currentUserSubject.next(response.data.user);
          this.isAuthenticatedSubject.next(true);
          this.isLoadingSubject.next(false);
        }),
        map((response) => response.data),
        catchError(() => {
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          this.isLoadingSubject.next(false);
          return of(null);
        })
      );
  }

  /**
   * Get the current authenticated user synchronously
   *
   * @returns Current user or null if not authenticated
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is currently authenticated (synchronous)
   *
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
