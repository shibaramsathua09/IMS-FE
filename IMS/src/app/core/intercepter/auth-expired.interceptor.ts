/*This code is an Angular HTTP interceptor written in TypeScript. 
It’s designed to handle expired authentication sessions (specifically HTTP 401 errors) in a web application. 
Let’s break it down step by step so it’s easy to understand:*/
/*🧠 Why this code is written
In many web apps, users log in and get a token (like a JWT) stored in local storage. This token is used to authenticate API requests. But sometimes:

The token expires.
The user is logged out from the server side.
The token is invalid.
When this happens, the server responds with a 401 Unauthorized error. This interceptor catches that error and:

Shows a message to the user.
Clears the token.
Redirects the user to the login or home page.*/


/*These are Angular and RxJS modules:

inject: used to get services like Router and MatSnackBar.
HttpInterceptorFn: a function-based interceptor.
HttpErrorResponse: represents an error response from an HTTP call.
Router: used to navigate between pages.
MatSnackBar: shows a popup message.
catchError: handles errors in HTTP responses.
throwError: rethrows the error after handling.*/
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/*This flag ensures that if multiple requests fail with 401, 
the app doesn’t keep redirecting or showing multiple snackbars.*/
let hasHandled401 = false; // prevents multiple redirects


/*This is the actual interceptor. It:

Gets the Router and MatSnackBar services.
Intercepts every HTTP request.*/
export const authExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  /*If the server responds with a 401 error and it hasn’t been handled yet:

Set the flag to true.
Show a warning in the console.
*/
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !hasHandled401) {
        hasHandled401 = true;
        console.warn('[auth-expired.interceptor] Session expired or user unauthorized.');

        /*This shows a popup message at the top of the screen for 5 seconds.*/
        snackBar.open('Your session has expired. Please log in again.', 'Dismiss', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        // Optional: clear local storage or token
        /*Removes the token from local storage.
Redirects the user to /home with a query parameter expired=true.*/
        localStorage.removeItem('token');

        router.navigate(['/home'], { queryParams: { expired: true } });
      }
      return throwError(() => error);
    })
  );
};
