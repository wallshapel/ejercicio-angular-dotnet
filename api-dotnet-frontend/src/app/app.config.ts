import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../shared/api-tokens';

declare global {
  interface Window { __env?: { API_BASE_URL?: string } }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: API_BASE_URL,
      useFactory: () => window.__env?.API_BASE_URL ?? 'http://localhost:8080' // fallback
    }
  ]
};
