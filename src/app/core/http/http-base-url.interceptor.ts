import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from './api-base-url.token';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_BASE_URL);

  // não mexe em URL absoluta
  if (/^https?:\/\//i.test(req.url)) return next(req);

  const url = `${baseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  return next(req.clone({ url }));
};
