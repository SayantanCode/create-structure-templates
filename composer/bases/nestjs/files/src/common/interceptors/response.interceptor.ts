import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

// Wraps every successful controller return value in the standard envelope:
// { success: true, data }. Controllers just return their data directly.
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, { success: true; data: T }> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<{ success: true; data: T }> {
    return next.handle().pipe(map((data) => ({ success: true as const, data })));
  }
}
