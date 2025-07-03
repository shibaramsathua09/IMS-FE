import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

let hasHandled401 = false; // prevents multiple redirects

export const authExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !hasHandled401) {
        hasHandled401 = true;
        console.warn('[auth-expired.interceptor] Session expired or user unauthorized.');
        
        snackBar.open('Your session has expired. Please log in again.', 'Dismiss', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        // Optional: clear local storage or token
        localStorage.removeItem('token');

        router.navigate(['/home'], { queryParams: { expired: true } });
      }
      return throwError(() => error);
    })
  );
};
