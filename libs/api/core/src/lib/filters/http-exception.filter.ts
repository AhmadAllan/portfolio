import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export interface JSendFailResponse {
  status: 'fail';
  data: Record<string, any>;
}

export interface JSendErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  data?: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

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
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse: JSendErrorResponse = {
      status: 'error',
      message: exception instanceof Error ? exception.message : 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
