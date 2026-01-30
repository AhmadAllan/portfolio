import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ErrorLoggerService } from '../logging/error-logger.service';

export interface JSendFailResponse {
  status: 'fail';
  data: Record<string, unknown>;
}

export interface JSendErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  data?: unknown;
}

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly errorLogger: ErrorLoggerService,
    private readonly configService: ConfigService
  ) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Log the error with context
    this.errorLogger.logError(
      exception,
      `HTTP ${request.method} ${request.url}`,
      {
        statusCode: status,
        requestUrl: request.url,
        method: request.method,
      }
    );

    // Client errors (4xx) - JSend "fail"
    if (status >= 400 && status < 500) {
      const failResponse: JSendFailResponse = {
        status: 'fail',
        data:
          typeof exceptionResponse === 'object'
            ? (exceptionResponse as any)
            : { message: exceptionResponse },
      };

      response.status(status).json(failResponse);
      return;
    }

    // Server errors (5xx) - JSend "error"
    const errorResponse: JSendErrorResponse = {
      status: 'error',
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Internal server error',
      code: `HTTP_${status}`,
    };

    response.status(status).json(errorResponse);
  }
}

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly errorLogger: ErrorLoggerService,
    private readonly configService: ConfigService
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Log the unexpected error
    const error = exception instanceof Error ? exception : new Error(String(exception));
    this.errorLogger.logError(
      error,
      `Unhandled Exception: ${request.method} ${request.url}`,
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        requestUrl: request.url,
        method: request.method,
      }
    );

    // Sanitize error message in production
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const errorMessage = isProduction
      ? 'An unexpected error occurred. Please try again later.'
      : exception instanceof Error
      ? exception.message
      : 'Internal server error';

    const errorResponse: JSendErrorResponse = {
      status: 'error',
      message: errorMessage,
      code: 'INTERNAL_SERVER_ERROR',
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
