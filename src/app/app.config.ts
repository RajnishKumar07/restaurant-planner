import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideToastr({
      timeOut: 3000,
      easeTime: 300,
      easing: 'easing',
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideAnimations(),
  ],
};
