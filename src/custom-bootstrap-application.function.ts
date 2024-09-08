import { ApplicationRef, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MockBackendInterceptor } from './app/shared/mock-backend/mock-backend.interceptor';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app-routes.const';

// Used to remove the App Module and migrate to standalone App Component.
export const customBootstrapApplication = async (): Promise<ApplicationRef> => {
  return bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(APP_ROUTES),
      importProvidersFrom(BrowserModule, HttpClientModule),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MockBackendInterceptor,
        multi: true
      }
    ],
  });
};
