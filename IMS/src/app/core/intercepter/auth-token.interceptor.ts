import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
/*This is an HTTP interceptor in Angular. Specifically, it's a function-based interceptor (HttpInterceptorFn), introduced in Angular 15+ as a simpler alternative to class-based interceptors.

🧠 What Does It Do?
Intercepts every outgoing HTTP request made using Angular's HttpClient.
Checks if a JWT token is stored in the browser's localStorage.
If a token is found:
It adds an Authorization header to the request:
Authorization: Bearer <your-token>
Then it forwards the modified request to the next handler in the chain.
🔐 Why Is This Important?
Most APIs require authentication using a JWT (JSON Web Token).
This interceptor automatically attaches the token to every request, so you don’t have to manually add it each time.
It ensures that your app communicates securely with the backend.
✅ Explanation Line-by-Line
1. import { HttpInterceptorFn } from '@angular/common/http';
Imports the function-based interceptor type from Angular.
2. export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
Declares and exports the interceptor function.
req: the outgoing HTTP request.
next: the next handler in the chain.
3. const token = localStorage.getItem('token');
Retrieves the JWT token from browser storage.
4. if (token) { ... }
Checks if a token exists.
5. req = req.clone({ setHeaders: { Authorization: Bearer ${token} } });
Clones the request and adds the Authorization header.
6. return next(req);
Passes the modified request to the next handler (usually the backend).
🧩 Summary
Feature	Purpose
Interceptor	Middleware for HTTP requests
JWT Token	Used for secure API access
localStorage.getItem('token')	Retrieves stored token
req.clone()	Adds headers without mutating original request
Authorization: Bearer <token>	Standard format for JWT authentication*/
