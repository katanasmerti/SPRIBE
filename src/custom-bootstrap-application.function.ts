import { ApplicationRef, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MockBackendInterceptor } from './app/shared/mock-backend/mock-backend.interceptor';

export const customBootstrapApplication = async (): Promise<ApplicationRef> => {

  return bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(BrowserModule, HttpClientModule),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MockBackendInterceptor,
        multi: true
      }
    ],
  });
};
