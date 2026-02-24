import { Routes } from '@angular/router';
import { RecurringListPageComponent } from './pages/recurring-list-page/recurring-list-page.component';
import { RecurringFormPageComponent } from './pages/recurring-form-page/recurring-form-page.component';
import { RecurringGeneratePageComponent } from './pages/recurring-generate-page/recurring-generate-page.component';

export const recurringRoutes: Routes = [
  { path: '', component: RecurringListPageComponent },
  { path: 'new', component: RecurringFormPageComponent },
  { path: ':id/edit', component: RecurringFormPageComponent },
  { path: 'generate', component: RecurringGeneratePageComponent },
];
