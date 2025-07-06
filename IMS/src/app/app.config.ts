/*The file app.config.ts is typically used in standalone 
Angular applications to define the application-wide configuration. 
It replaces some of the setup that used to be done in AppModule in traditional Angular apps.

🧠 Purpose of app.config.ts
It centralizes the configuration for things like:

Routing (provideRouter)
HTTP client setup (provideHttpClient)
Interceptors (like JWT token handling)
Change detection settings (provideZoneChangeDetection)
Any other global providers your app needs
*/
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authExpiredInterceptor } from './core/intercepter/auth-expired.interceptor';
import { authTokenInterceptor } from './core/intercepter/auth-token.interceptor'; // ← new
//This is the main configuration object for your Angular application. 
//It sets up core services like routing, HTTP, and change detection.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    /*Purpose: Sets up Angular's routing system.
      routes: This is your route configuration (like /login, /admin, etc.).
      It tells Angular how to navigate between pages/components.*/
    provideRouter(routes),  

    /*Purpose: Sets up Angular's HTTP client for making API calls.
      withInterceptors([...]): Adds custom logic to every HTTP request or response.
    */
    provideHttpClient(
      withInterceptors([
        /* authTokenInterceptor
            Injects JWT token into every outgoing HTTP request.
            Ensures secure communication with the backend.
            Example: Adds Authorization: Bearer <token> to headers.
            🧠 Think of it as: "Attach my login token to every API call."*/
        authTokenInterceptor,   // 🔐 inject JWT

        /*Handles expired tokens or unauthorized responses (like HTTP 401).
          Can redirect to login or refresh the token.
          🧠 Think of it as: "If my token is expired, catch it and handle it gracefully."*/
        authExpiredInterceptor  // 🛑 handle 401 responses
      ])
    )
  ]
};
