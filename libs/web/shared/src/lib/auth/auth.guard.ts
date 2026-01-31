import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable, map, take, filter } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoading$.pipe(
    filter((loading) => !loading),
    take(1),
    map(() => {
      if (authService.isAuthenticated()) {
        return true;
      }
      return router.createUrlTree(['/dashboard/login']);
    })
  );
};

/**
 * Guard to prevent authenticated users from accessing login page
 */
export const guestGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoading$.pipe(
    filter((loading) => !loading),
    take(1),
    map(() => {
      if (!authService.isAuthenticated()) {
        return true;
      }
      return router.createUrlTree(['/dashboard']);
    })
  );
};
