import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();
  const apiRequest = req.url.startsWith('http://localhost:3000/');
  const request = token && apiRequest
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(request).pipe(catchError((error: { status?: number }) => {
    if (apiRequest && error.status === 401 && !req.url.endsWith('/auth/login') && !req.url.endsWith('/auth/register')) {
      auth.logout();
    }
    return throwError(() => error);
  }));
};
