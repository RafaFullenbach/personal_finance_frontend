import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

const DEFAULT_TIMEOUT_MS = 12_000;

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(timeout(DEFAULT_TIMEOUT_MS));
};
