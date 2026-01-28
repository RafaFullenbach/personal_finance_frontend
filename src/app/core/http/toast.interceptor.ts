import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { mapHttpError } from '../error/error-mapper';
import { AppError } from '../error/app-error';
import { ToastService } from '../toast/toast.service';

function isAppError(e: any): e is AppError {
  return e && typeof e === 'object' && typeof e.kind === 'string' && typeof e.message === 'string';
}

export const toastInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err) => {
      const appErr = isAppError(err) ? err : mapHttpError(err);

      const msg = appErr.code
        ? `${appErr.message} (${appErr.code})`
        : appErr.message;

      toast.error(msg);

      return throwError(() => appErr);
    })
  );
};
