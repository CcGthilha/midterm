import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <-- ต้องเป็น AppComponent

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));