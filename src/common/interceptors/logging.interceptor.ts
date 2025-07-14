import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

type RequestContext = {
  requestId: string;
  path: string;
  method: string;
};

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  private static readonly als = new AsyncLocalStorage<RequestContext>();
  private readonly logger = new Logger(RequestIdInterceptor.name);

  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const requestId = uuidv4();
    const requestContext: RequestContext = {
      requestId,
      path: request.path,
      method: request.method,
    };

    // Agregar requestId a headers de request y response
    request.headers['x-request-id'] = requestId;
    response.setHeader('x-request-id', requestId);

    return RequestIdInterceptor.als.run(requestContext, () => {
      this.logRequestStart(requestContext);

      return next.handle().pipe(
        tap(() => this.logRequestCompletion(requestContext)),
        catchError((err: unknown) => {
          const error = err instanceof Error ? err : new Error(String(err));
          this.logRequestError(error, requestContext);
          return throwError(() => this.prepareError(error));
        }),
      );
    });
  }

  private logRequestStart(context: RequestContext): void {
    this.logger.log({
      message: 'Request started',
      ...context,
    });
  }

  private logRequestCompletion(context: RequestContext): void {
    this.logger.log({
      message: 'Request completed',
      ...context,
    });
  }

  private logRequestError(error: Error, context: RequestContext): void {
    this.logger.error({
      message: 'Request failed',
      error: error.message,
      stack: error.stack,
      ...context,
    });
  }

  private prepareError(error: Error): Error {
    // Puedes personalizar el error aquí si quieres
    return error;
  }

  static getContext(): RequestContext | undefined {
    return this.als.getStore();
  }
}
