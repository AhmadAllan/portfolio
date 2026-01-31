import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface JSendSuccessResponse<T> {
  status: 'success';
  data: T;
}

export interface JSendSuccessResponseWithMeta<T> {
  status: 'success';
  data: T;
  meta?: any;
}

@Injectable()
export class JSendInterceptor<T>
  implements NestInterceptor<T, JSendSuccessResponse<T> | JSendSuccessResponseWithMeta<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<JSendSuccessResponse<T> | JSendSuccessResponseWithMeta<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already has meta, include it in the response
        if (data && typeof data === 'object' && 'meta' in data) {
          const { meta, ...rest } = data;
          return {
            status: 'success' as const,
            data: rest as T,
            meta,
          };
        }

        return {
          status: 'success' as const,
          data,
        };
      })
    );
  }
}
