import { ApplicationRef, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';

export const customBootstrapApplication = async (): Promise<ApplicationRef> => {

  return bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(BrowserModule, HttpClientModule),
    ],
  });
};
