import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authExpiredInterceptor } from './core/intercepter/auth-expired.interceptor';
import { authTokenInterceptor } from './core/intercepter/auth-token.interceptor'; // ← new

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authTokenInterceptor,   // 🔐 inject JWT
        authExpiredInterceptor  // 🛑 handle 401 responses
      ])
    )
  ]
};
