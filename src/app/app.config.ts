import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { API_BASE_URL } from './core/http/api-base-url.token';
import { environment } from '../environments/environment';
import { errorInterceptor } from './core/http/http-error.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './core/http/http-base-url.interceptor';
import { timeoutInterceptor } from './core/http/http-timeout.interceptor';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideAnimations } from '@angular/platform-browser/animations';
import { toastInterceptor } from './core/http/toast.interceptor';
import { ArcElement, BarController, BarElement, CategoryScale, Chart, DoughnutController, Legend, LinearScale, registerables, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

registerLocaleData(localePt);
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  ChartDataLabels,
);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        timeoutInterceptor,
        errorInterceptor,
        toastInterceptor,
      ]),
    ),
    provideAnimations(),
  ],
};
