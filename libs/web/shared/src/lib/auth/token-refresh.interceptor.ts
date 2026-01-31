import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Only try to refresh on 401 errors
        if (error.status !== 401) {
          return throwError(() => error);
        }

        // Don't retry refresh token or login endpoints
        if (
          request.url.includes('/auth/refresh') ||
          request.url.includes('/auth/login')
        ) {
          return throwError(() => error);
        }

        // If already refreshing, wait for the refresh to complete
        if (this.isRefreshing) {
          return this.refreshTokenSubject.pipe(
            filter((result) => result !== null),
            take(1),
            switchMap((success) => {
              if (success) {
                return next.handle(request);
              }
              return throwError(() => error);
            })
          );
        }

        // Start refresh process
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);

        return this.authService.refreshToken().pipe(
          switchMap((success) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(success);

            if (success) {
              return next.handle(request);
            }
            return throwError(() => error);
          }),
          catchError((refreshError) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(false);
            return throwError(() => refreshError);
          })
        );
      })
    );
  }
}
