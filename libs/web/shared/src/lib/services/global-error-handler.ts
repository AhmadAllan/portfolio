import { ErrorHandler, Injectable, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common';
import { NotificationService } from './notification.service';
import { ENVIRONMENT, Environment } from '../config/environment.token';

/**
 * Global error handler for unhandled errors in the Angular application
 *
 * Implements Angular's ErrorHandler interface to catch and handle:
 * - Unhandled client-side errors (JavaScript errors, promise rejections)
 * - HTTP errors (delegated to the error interceptor for notifications)
 *
 * Features:
 * - Centralized error logging
 * - User-friendly error notifications
 * - Development vs production error handling
 * - Integration ready for external error tracking (Sentry, LogRocket)
 *
 * Note: HTTP errors are primarily handled by the error interceptor to avoid
 * duplicate notifications. This handler focuses on unexpected runtime errors.
 *
 * @example
 * // Register in app configuration
 * providers: [
 *   { provide: ErrorHandler, useClass: GlobalErrorHandler }
 * ]
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  /**
   * Handle unhandled errors
   *
   * Distinguishes between HTTP errors and client-side errors:
   * - HTTP errors: Logged but not shown to user (handled by interceptor)
   * - Client errors: Logged and shown to user with generic message
   *
   * @param error - The error that occurred (client or HTTP error)
   */
  handleError(error: Error | HttpErrorResponse): void {
    // Log error to console
    if (error instanceof HttpErrorResponse) {
      // Server or network error
      console.error('[HTTP Error]', {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        url: error.url,
        error: error.error,
      });

      // Don't show notification for HTTP errors - they're handled by interceptor
    } else {
      // Client-side error
      console.error('[Global Error]', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      // Show user-friendly notification
      this.notificationService.error(
        'An unexpected error occurred. Please refresh the page and try again.'
      );
    }

    // TODO: Send to error tracking service in production
    if (this.env.production) {
      // Example: Send to Sentry, LogRocket, etc.
      // this.sentryService.captureException(error);
    }
  }
}
