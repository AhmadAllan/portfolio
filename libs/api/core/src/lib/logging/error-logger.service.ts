import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ErrorLogData {
  message: string;
  stack?: string;
  context?: string;
  timestamp: string;
  environment: string;
  requestUrl?: string;
  userId?: string;
}

@Injectable()
export class ErrorLoggerService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Log an error with context information
   * @param error - The error to log
   * @param context - Optional context (e.g., service name, route)
   * @param metadata - Optional additional metadata
   */
  logError(error: Error, context?: string, metadata?: Record<string, unknown>): void {
    const errorData: ErrorLogData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('NODE_ENV') || 'development',
      ...metadata,
    };

    // Log to console in development
    if (this.configService.get<string>('NODE_ENV') === 'development') {
      console.error('[Error]', {
        ...errorData,
        name: error.name,
      });
    } else {
      // In production, log less verbose output
      console.error('[Error]', {
        message: errorData.message,
        context: errorData.context,
        timestamp: errorData.timestamp,
      });
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: this.sentryService.captureException(error, { extra: errorData });
  }

  /**
   * Log a warning
   * @param message - Warning message
   * @param context - Optional context
   * @param metadata - Optional additional metadata
   */
  logWarning(message: string, context?: string, metadata?: Record<string, unknown>): void {
    const warningData = {
      message,
      context,
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('NODE_ENV') || 'development',
      ...metadata,
    };

    console.warn('[Warning]', warningData);
  }

  /**
   * Log an info message
   * @param message - Info message
   * @param context - Optional context
   * @param metadata - Optional additional metadata
   */
  logInfo(message: string, context?: string, metadata?: Record<string, unknown>): void {
    const infoData = {
      message,
      context,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    if (this.configService.get<string>('NODE_ENV') === 'development') {
      console.log('[Info]', infoData);
    }
  }
}
