import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Network error: ${error.error.message}`;
        console.error('[Client Error]', error.error);
      } else {
        // Server-side error
        console.error('[Server Error]', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          body: error.error,
        });

        // Extract error message from JSend format
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.data?.message) {
          // Handle JSend fail format
          errorMessage = error.error.data.message;
        } else if (error.statusText) {
          errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Don't show notification for:
      // - 401 errors (handled by auth service with redirect)
      // - 0 status (typically canceled requests or network offline)
      if (error.status !== 401 && error.status !== 0) {
        notificationService.error(errorMessage);
      }

      // Re-throw the error for components to handle if needed
      return throwError(() => error);
    })
  );
};
