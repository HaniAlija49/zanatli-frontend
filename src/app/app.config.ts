import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([jwtInterceptor]),
      withFetch()
    ),
    provideAnimations(),
    { provide: 'API_URL', useValue: environment.apiUrl }
  ]
};
