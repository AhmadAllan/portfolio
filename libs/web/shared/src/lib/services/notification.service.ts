import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationSubject = new Subject<Notification>();
  private notificationId = 0;

  public readonly notifications$: Observable<Notification> = this.notificationSubject.asObservable();

  /**
   * Show a success notification
   * @param message - Success message to display
   * @param duration - Duration in milliseconds (default: 3000)
   */
  success(message: string, duration = 3000): void {
    this.notify({
      id: this.generateId(),
      type: 'success',
      message,
      duration,
    });
  }

  /**
   * Show an error notification
   * @param message - Error message to display
   * @param details - Optional error details for logging
   * @param duration - Duration in milliseconds (default: 5000)
   */
  error(message: string, details?: unknown, duration = 5000): void {
    if (details) {
      console.error('[Error]', message, details);
    }
    this.notify({
      id: this.generateId(),
      type: 'error',
      message,
      duration,
    });
  }

  /**
   * Show a warning notification
   * @param message - Warning message to display
   * @param duration - Duration in milliseconds (default: 4000)
   */
  warning(message: string, duration = 4000): void {
    this.notify({
      id: this.generateId(),
      type: 'warning',
      message,
      duration,
    });
  }

  /**
   * Show an info notification
   * @param message - Info message to display
   * @param duration - Duration in milliseconds (default: 3000)
   */
  info(message: string, duration = 3000): void {
    this.notify({
      id: this.generateId(),
      type: 'info',
      message,
      duration,
    });
  }

  /**
   * Emit a notification
   * @param notification - Notification object
   */
  private notify(notification: Notification): void {
    this.notificationSubject.next(notification);
  }

  /**
   * Generate a unique notification ID
   */
  private generateId(): string {
    return `notification-${++this.notificationId}-${Date.now()}`;
  }
}
